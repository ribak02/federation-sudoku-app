import { getPuzzle } from "../../services/PuzzleService";
import { submitPuzzle } from "../../services/PuzzleService";
import Authentication from "./Authentication";
import { validMove } from "../../api/sudoku";
import router from "@/router";
import Swal from "sweetalert2";
import 'animate.css';


export default {
    namespaced: true,
    state() {
        return {
            puzzle_id: "",
            grid: Array(9)
            .fill(0)
            .map(() => Array(9).fill(0)),
            origGridString: null,
            solution: [],
            selected: null,
            wonSudoku: false,
            heights: {
                COLS: [
                    {'top': 0, 'bottom':0},
                    {'top': 0, 'bottom':0},
                    {'top': 0, 'bottom':0},
                    {'top': 0, 'bottom':0},
                    {'top': 0, 'bottom':0},
                    {'top': 0, 'bottom':0},
                    {'top': 0, 'bottom':0},
                    {'top': 0, 'bottom':0},
                    {'top': 0, 'bottom':0},
                ],
                ROWS: [
                    {'left': 0, 'right':0},
                    {'left': 0, 'right':0},
                    {'left': 0, 'right':0},
                    {'left': 0, 'right':0},
                    {'left': 0, 'right':0},
                    {'left': 0, 'right':0},
                    {'left': 0, 'right':0},
                    {'left': 0, 'right':0},
                    {'left': 0, 'right':0},
                ],
            },
            USER_ROWS: {
                0: [0,0,0,0,0,0,0,0,0],
                1: [0,0,0,0,0,0,0,0,0],
                2: [0,0,0,0,0,0,0,0,0],
                3: [0,0,0,0,0,0,0,0,0],
                4: [0,0,0,0,0,0,0,0,0],
                5: [0,0,0,0,0,0,0,0,0],
                6: [0,0,0,0,0,0,0,0,0],
                7: [0,0,0,0,0,0,0,0,0],
                8: [0,0,0,0,0,0,0,0,0],
            },
            USER_COLS: {
                0: [0,0,0,0,0,0,0,0,0],
                1: [0,0,0,0,0,0,0,0,0],
                2: [0,0,0,0,0,0,0,0,0],
                3: [0,0,0,0,0,0,0,0,0],
                4: [0,0,0,0,0,0,0,0,0],
                5: [0,0,0,0,0,0,0,0,0],
                6: [0,0,0,0,0,0,0,0,0],
                7: [0,0,0,0,0,0,0,0,0],
                8: [0,0,0,0,0,0,0,0,0],
            },
            USER_SUBSQUARES: {
                "0,0": [0,0,0,0,0,0,0,0,0],
                "0,1": [0,0,0,0,0,0,0,0,0],
                "0,2": [0,0,0,0,0,0,0,0,0],
                "1,0": [0,0,0,0,0,0,0,0,0],
                "1,1": [0,0,0,0,0,0,0,0,0],
                "1,2": [0,0,0,0,0,0,0,0,0],
                "2,0": [0,0,0,0,0,0,0,0,0],
                "2,1": [0,0,0,0,0,0,0,0,0],
                "2,2": [0,0,0,0,0,0,0,0,0],
            },
            ROWS: {
                0: new Set(),
                1: new Set(),
                2: new Set(),
                3: new Set(),
                4: new Set(),
                5: new Set(),
                6: new Set(),
                7: new Set(),
                8: new Set(),
            },
            COLS: {
                0: new Set(),
                1: new Set(),
                2: new Set(),
                3: new Set(),
                4: new Set(),
                5: new Set(),
                6: new Set(),
                7: new Set(),
                8: new Set(),
            },
            SUBSQUARES: {
                "0,0": new Set(),
                "0,1": new Set(),
                "0,2": new Set(),
                "1,0": new Set(),
                "1,1": new Set(),
                "1,2": new Set(),
                "2,0": new Set(),
                "2,1": new Set(),
                "2,2": new Set(),
            },
        };
    },
    mutations: {
        //mutations are ways to change state
        initGrid(state,puzzle_id) {
            state.puzzle_id = puzzle_id;
            state.wonSudoku = false;
            getPuzzle(puzzle_id).then((response) => {
                state.origGridString = response;
                state.grid = JSON.parse(response.puzzle_grid);
                state.solution = JSON.parse(response.puzzle_solution);
                for (let i = 0; i < state.grid.length; i++) {
                    for (let x = 0; x < state.grid[i].length; x++) {
                        let val = {
                            value: state.grid[i][x] == (""| " ") ? " " : parseInt(state.grid[i][x], 10),
                            original: state.grid[i][x] == ("" | " ") ? false : true, //cannot be changed
                            possibilities: new Set(),
                            selected: false,
                            solution: parseInt(state.grid[i][x], 10),
                            error: false,
                            pencilMarks: new Set(),
                        };
                        state.grid[i][x] = val;
                    }
                }
                this.commit("playPuzzle/get_possibilities", state.grid);
            });
        },
        initGridFed(state,{grid,solution}){
            state.wonSudoku = false;
            state.grid = grid;
            state.solution = solution;
            for (let i = 0; i < state.grid.length; i++) {
                for (let x = 0; x < state.grid[i].length; x++) {
                    let val = {
                        value: state.grid[i][x] == "" ? " " : parseInt(state.grid[i][x], 10),
                        original: state.grid[i][x] == "" ? false : true, //cannot be changed
                        possibilities: new Set(),
                        selected: false,
                        solution: parseInt(state.grid[i][x], 10),
                        error: false,
                        pencilMarks: new Set(),
                    };
                    state.grid[i][x] = val;
                }
            }
            this.commit("playPuzzle/get_possibilities", state.grid);
        },
        newReset(state){
            state.ROWS= {
                0: new Set(),
                1: new Set(),
                2: new Set(),
                3: new Set(),
                4: new Set(),
                5: new Set(),
                6: new Set(),
                7: new Set(),
                8: new Set(),
            };
            state.COLS= {
                0: new Set(),
                1: new Set(),
                2: new Set(),
                3: new Set(),
                4: new Set(),
                5: new Set(),
                6: new Set(),
                7: new Set(),
                8: new Set(),
            };
            state.SUBSQUARES= {
                "0,0": new Set(),
                "0,1": new Set(),
                "0,2": new Set(),
                "1,0": new Set(),
                "1,1": new Set(),
                "1,2": new Set(),
                "2,0": new Set(),
                "2,1": new Set(),
                "2,2": new Set(),
            };
            state.USER_ROWS= {
                0: [0,0,0,0,0,0,0,0,0],
                1: [0,0,0,0,0,0,0,0,0],
                2: [0,0,0,0,0,0,0,0,0],
                3: [0,0,0,0,0,0,0,0,0],
                4: [0,0,0,0,0,0,0,0,0],
                5: [0,0,0,0,0,0,0,0,0],
                6: [0,0,0,0,0,0,0,0,0],
                7: [0,0,0,0,0,0,0,0,0],
                8: [0,0,0,0,0,0,0,0,0],
            };
            state.USER_COLS= {
                0: [0,0,0,0,0,0,0,0,0],
                1: [0,0,0,0,0,0,0,0,0],
                2: [0,0,0,0,0,0,0,0,0],
                3: [0,0,0,0,0,0,0,0,0],
                4: [0,0,0,0,0,0,0,0,0],
                5: [0,0,0,0,0,0,0,0,0],
                6: [0,0,0,0,0,0,0,0,0],
                7: [0,0,0,0,0,0,0,0,0],
                8: [0,0,0,0,0,0,0,0,0],
            };
            state.USER_SUBSQUARES= {
                "0,0": [0,0,0,0,0,0,0,0,0],
                "0,1": [0,0,0,0,0,0,0,0,0],
                "0,2": [0,0,0,0,0,0,0,0,0],
                "1,0": [0,0,0,0,0,0,0,0,0],
                "1,1": [0,0,0,0,0,0,0,0,0],
                "1,2": [0,0,0,0,0,0,0,0,0],
                "2,0": [0,0,0,0,0,0,0,0,0],
                "2,1": [0,0,0,0,0,0,0,0,0],
                "2,2": [0,0,0,0,0,0,0,0,0],
            };
        },
        initGridSkyscraper(state,puzzle_id){
            state.ROWS= {
                0: new Set(),
                1: new Set(),
                2: new Set(),
                3: new Set(),
                4: new Set(),
                5: new Set(),
                6: new Set(),
                7: new Set(),
                8: new Set(),
            };
            state.COLS= {
                0: new Set(),
                1: new Set(),
                2: new Set(),
                3: new Set(),
                4: new Set(),
                5: new Set(),
                6: new Set(),
                7: new Set(),
                8: new Set(),
            };
            state.SUBSQUARES= {
                "0,0": new Set(),
                "0,1": new Set(),
                "0,2": new Set(),
                "1,0": new Set(),
                "1,1": new Set(),
                "1,2": new Set(),
                "2,0": new Set(),
                "2,1": new Set(),
                "2,2": new Set(),
            },
            state.puzzle_id = puzzle_id;
            state.wonSudoku = false;
            let temp_grid = Array(9).fill(0).map(() => Array(9).fill(0));
            getPuzzle(puzzle_id).then((response) => {
                state.heights = JSON.parse(response.heights);
                state.solution = JSON.parse(response.puzzle_solution);
                let grid = JSON.parse(response.puzzle_grid);
                for (let i = 0; i <  JSON.parse(response.puzzle_solution).length; i++) {
                    for (let x = 0; x <  JSON.parse(response.puzzle_solution).length; x++) {
                        let val = {
                            value: grid[i][x],
                            original: Number.isInteger(grid[i][x]) ? true : false, //cannot be changed
                            selected: false,
                            solution: state.solution[i][x],
                            error: false,
                            pencilMarks: new Set(),
                        };
                        temp_grid[i][x] = val;
                        state.ROWS[i].add(val.value);
                        state.COLS[x].add(val.value);
                        let subsquare_key = [Math.floor(i/ 3), Math.floor(x/ 3)].join(",");
                        state.SUBSQUARES[subsquare_key].add(val.value);
                    }
                }
                state.grid = temp_grid;
            });

        },
        get_possibilities(state, grid) {
            //setting up all of the rows and columns and subsquares
            for (let x = 0; x < grid.length; x++) {
                for (let y = 0; y < grid[x].length; y++) {
                    if (grid[x][y].value != " ") {
                        state.ROWS[x].add(grid[x][y].value);
                        state.COLS[y].add(grid[x][y].value);
                        state.SUBSQUARES[
                            [Math.floor(x / 3), Math.floor(y / 3)].join(",")
                        ].add(grid[x][y].value);
                    }
                }
            }

            //loop through digits 1-9, see if it can be added to the grid at that position
            for (let digit = 1; digit < 10; digit++) {
                for (let x = 0; x < grid.length; x++) {
                    for (let y = 0; y < grid[x].length; y++) {
                        if (!grid[x][y].original) {
                            if (
                                !state.ROWS[x].has(digit) &&
                                !state.COLS[y].has(digit) &&
                                !state.SUBSQUARES[
                                    [Math.floor(x / 3), Math.floor(y / 3)].join(
                                        ","
                                    )
                                ].has(digit)
                            ) {
                                state.grid[x][y].possibilities.add(digit);
                            }
                        }
                    }
                }
            }
        },
        toggledAutocorrect(state,autocorrectActive){
            //each one should not have an error
            for (let x=0;x<state.grid.length;x++){
                for (let y=0;y<state.grid.length;y++){
                    state.grid[x][y].error = false;
                }
            }
            if (autocorrectActive){
                validMove(state);
            } 
         
        },
        setPencilMarks(state,{x,pencilMarksActive}) {
            if (!state.selected || x == 0 || !pencilMarksActive) return;
            if (pencilMarksActive) {
                state.grid[state.selected.x][state.selected.y].pencilMarks.add(x);
            }
        },
        // note for self, put puzzle id in store
        checkAndSubmit(state, puzzle_id){
            //go through the grid and compare
            for (let x=0;x<state.grid.length;x++){
                for (let y=0;y<state.grid.length;y++){
                    if (parseInt(state.grid[x][y].value) != parseInt(state.solution[x][y])){
                        Swal.fire({
                            title:"Error",
                            text: "Try Again!",
                            icon:'error',
                            });
                        return;
                    }
                }
            }

            let el = document.getElementById('stars');
            let time = document.querySelector(".stopwatch").textContent;
            let rating;            Swal.fire({
                title: 'Yay, your time: \n' + time + '\n \n Rate this puzzle:',
                html: el,
                showClass: {
                    popup: 'animate__heartBeat'
                  },
                showDenyButton: true,
                confirmButtonText: 'Home',
                denyButtonText: `Play Again`,
                confirmButtonColor: 'grey',
                denyButtonColor: 'grey',
                icon: 'success'
              }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/home");
                } else if (result.isDenied) {
                    window.location.reload();
                }                
                let u = document.getElementById("ratte").childNodes[0].outerText;
                rating = parseFloat(u.slice(6, 11));
                if(isNaN(rating) || rating < 0 || rating > 5) {
                    rating = 0;
                }                let user_id = Authentication.state.user_id;
                submitPuzzle(puzzle_id, user_id, time, rating);
            })
        },
        setDigit(state,{x,autocorrectActive}) {
            if (!state.selected) return; //nothing selected
            let subsquare_key = [Math.floor(state.selected.x / 3), Math.floor(state.selected.y / 3)].join(",");
            let digit_there = state.grid[state.selected.x][state.selected.y].value;

            if(digit_there != " " ||  digit_there != ""){
                state.USER_ROWS[state.selected.x][digit_there] = Math.max(0,state.USER_ROWS[state.selected.x][digit_there]-1);
                state.USER_COLS[state.selected.y][digit_there] = Math.max(0,state.USER_COLS[state.selected.y][digit_there]-1);
                state.USER_SUBSQUARES[subsquare_key][digit_there] = Math.max(0, state.USER_SUBSQUARES[subsquare_key][digit_there]-1);
            }
            if (x==0){
                state.grid[state.selected.x][state.selected.y].error = false;
                state.grid[state.selected.x][state.selected.y].value = "";
                if (autocorrectActive){
                    this.commit("playPuzzle/toggledAutocorrect", true);
                }
                return;
            }
            state.grid[state.selected.x][state.selected.y].value = x;
                
            state.USER_ROWS[state.selected.x][x] += 1;
            state.USER_COLS[state.selected.y][x] += 1;
            state.USER_SUBSQUARES[subsquare_key][x] += 1;
    
            if (autocorrectActive){
                this.commit("playPuzzle/toggledAutocorrect", true);
    
            }
        },

        setSelected(state, pos) {
            if (state.grid[pos.x][pos.y].original) return; //can't change the "original" values
            for (let i = 0; i < state.grid.length; i++) {
                let row = state.grid[i];
                for (let x = 0; x < row.length; x++) {
                    if ((i !== pos.x || x != pos.y) && row[x].selected) {
                        row[x].selected = false; //to reset the previous selected
                    }
                    if (i === pos.x && x === pos.y) {
                        row[x].selected = true;
                        state.selected = pos;
                    }
                }
            }
        },
        setSkyscraperDigitNoHeights(state, {x, autocorrectActive}){
            if (!state.selected) return; //nothing selected
            let subsquare_key = [Math.floor(state.selected.x / 3), Math.floor(state.selected.y / 3)].join(",");
            let digit_there = state.grid[state.selected.x][state.selected.y].value;

            if(digit_there != " " ||  digit_there != ""){
                state.USER_ROWS[state.selected.x][digit_there] = Math.max(0,state.USER_ROWS[state.selected.x][digit_there]-1);
                state.USER_COLS[state.selected.y][digit_there] = Math.max(0,state.USER_COLS[state.selected.y][digit_there]-1);
                state.USER_SUBSQUARES[subsquare_key][digit_there] = Math.max(0, state.USER_SUBSQUARES[subsquare_key][digit_there]-1);
            }
            if (x==0){
                state.grid[state.selected.x][state.selected.y].error = false;
                state.grid[state.selected.x][state.selected.y].value = "";
                if (autocorrectActive){
                    this.commit("playPuzzle/toggledAutocorrect", true);
                }
                return;
            }
            state.grid[state.selected.x][state.selected.y].value = x;
                
            state.USER_ROWS[state.selected.x][x] += 1;
            state.USER_COLS[state.selected.y][x] += 1;
            state.USER_SUBSQUARES[subsquare_key][x] += 1;
    
            if (autocorrectActive){
                    
                this.commit("playPuzzle/toggledAutocorrect", true);
    
            }

        },
        setSelectedSkyscraper(state,pos){
            if (state.grid[pos.x][pos.y].original) return; //can't change the "original" values
            for (let i = 0; i < state.grid.length; i++) {
                let row = state.grid[i];
                for (let x = 0; x < row.length; x++) {
                    if ((i !== pos.x || x != pos.y) && row[x].selected) {
                        row[x].selected = false; //to reset the previous selected
                    }
                    if (i === pos.x && x === pos.y) {
                        row[x].selected = true;
                        state.selected = pos;
                    }
                }
            }
        }

    },
};
