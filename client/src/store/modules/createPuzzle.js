import { generateGridRecur, changeDigit, checkSolutionRecur } from "@/api/sudoku";
import { postPuzzle } from "@/services/PuzzleService";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import Swal from "sweetalert2";

export default {
    namespaced: true,
    state() {
        return {
            new_grid: Array(9)
                .fill(0)
                .map(() => Array(9).fill(0)),
            solution_grid: Array(9)
                .fill(0)
                .map(() => Array(9).fill(0)),
            difficulty: 1,
            initial_grid: Array(9)
                .fill(0)
                .map(() => Array(9).fill(0)),
        };
    },
    mutations: {
        deleteDigit(state, { x, y }) {
            changeDigit(state, x, y);
        },
        generateGrid(state) {
            let full_grid = generateGridRecur(state);
            //make a deep copy of this grid
            for (let i = 0; i < state.new_grid.length; i++) {
                for (let j = 0; j < state.new_grid.length; j++) {
                    state.new_grid[i][j] = full_grid[i][j];
                    state.initial_grid[i][j] = full_grid[i][j];
                }
            }
            return state.new_grid;
        },
        generateGridFromImported(state, imported_grid) {
            if (imported_grid.type == "classic") {
                state.new_grid = imported_grid.grid;
            }
        },
        checkValidPuzzleReturnDifficulty(state) {
            let amount_deleted = 0;
            for (let i = 0; i < state.new_grid.length; i++) {
                for (let j = 0; j < state.new_grid.length; j++) {
                    if (state.new_grid[i][j] == "") {
                        amount_deleted += 1;
                    }
                }
            }

            if (amount_deleted == 0) {
                //don't allow to submit if full puzzle
                return -1;
            } else {
                if (amount_deleted > 52) {
                    state.difficulty = 5;
                } else if (amount_deleted > 40) {
                    state.difficulty = 4;
                } else if (amount_deleted > 28) {
                    state.difficulty = 3;
                } else if (amount_deleted > 16) {
                    state.difficulty = 2;
                } else {
                    state.difficulty = 1;
                }
            }
            return state.difficulty;
        },
        create(state, { puzzletype, title }) {

            let deleted = 0;

            let copy = Array(9)
                .fill(0)
                .map(() => Array(9).fill(0));
            for (let i = 0; i < state.new_grid.length; i++) {
                for (let j = 0; j < state.new_grid.length; j++) {
                    if (state.new_grid[i][j] == "") {
                        copy[i][j] = "";
                        deleted = 1;
                    } else {
                        copy[i][j] = state.new_grid[i][j].toString();
                    }
                }
            }

            if (deleted == 0) { //full grid
                Swal.fire({
                    title: "Error",
                    text: "Too easy!",
                    icon: 'error',
                });
                return;
            }


            let possible_solutions = [];
            let empty_as_zero = Array(9)
                .fill(0)
                .map(() => Array(9).fill(0));
            //for each square in grid, if it's empty make it 0
            for (let i = 0; i < state.new_grid.length; i++) {
                for (let j = 0; j < state.new_grid.length; j++) {
                    if (state.new_grid[i][j] != 0) {
                        empty_as_zero[i][j] = state.new_grid[i][j];
                    }
                }
            }

            checkSolutionRecur({ solution_grid: empty_as_zero }, empty_as_zero, possible_solutions);
            if (possible_solutions.length > 1) {
                //multiple solutions
                Swal.fire({
                    title: "Error",
                    text: "Cannot create puzzle - there are multiple solutions!",
                    icon: 'error',
                });
            } else {

                //also turn the solution to all strings
                let copy_solution = Array(9)
                    .fill(0)
                    .map(() => Array(9).fill(0));
                for (let i = 0; i < state.initial_grid.length; i++) {
                    for (let j = 0; j < state.initial_grid.length; j++) {
                        copy_solution[i][j] = state.initial_grid[i][j].toString();
                    }
                }
                postPuzzle(
                    parseInt(puzzletype),
                    parseInt(state.difficulty),
                    copy,
                    new Date().toISOString().slice(0, 19).replace("T", " "),
                    title,
                    cookies.get('user').username,
                    copy_solution,
                    cookies.get('user').user_id,
                    cookies.get('user').server_id,
                );
                Swal.fire({
                    title: "Puzzle created!",
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'grey',
                    icon: 'success'
                })
            }
        },
    },
};
