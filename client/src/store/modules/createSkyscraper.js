import { getCanSee } from "@/api/sudoku";
import { postSkyscraper } from "@/services/PuzzleService";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import Swal from "sweetalert2";


export default {
    namespaced: true,
    state() {
        return {
            grid: Array(9).fill(0).map(() => Array(9).fill(0)),
            solution: Array(9).fill(0).map(() => Array(9).fill(0)),
            finished: 0,
            has_deleted: 0,
            USER_ROWS: {
                0: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                1: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                2: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                3: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                4: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                5: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                6: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                7: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                8: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
            },
            USER_COLS: {
                0: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                1: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                2: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                3: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                4: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                5: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                6: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                7: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                8: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
            },
            USER_SUBSQUARES: {
                "0,0": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "0,1": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "0,2": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "1,0": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "1,1": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "1,2": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "2,0": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "2,1": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "2,2": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
            },
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
            }
        }
    },
    mutations: {
        generateGridForSkyscraper(state, obj) {
            let grid = obj.cur_grid;
            state.USER_ROWS= {
                0: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                1: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                2: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                3: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                4: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                5: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                6: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                7: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                8: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
            };
            state.USER_COLS={
                0: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                1: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                2: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                3: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                4: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                5: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                6: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                7: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                8: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
            };
            state.USER_SUBSQUARES= {
                "0,0": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "0,1": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "0,2": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "1,0": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "1,1": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "1,2": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "2,0": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "2,1": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "2,2": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
            };
            state.solution = obj.initial_grid;
            for (let i = 0; i < state.grid.length; i++) {
                for (let j = 0; j < state.grid.length; j++) {
                    let new_cell = {
                        value: grid[i][j] ? grid[i][j] : "",
                        selected: false,
                        error: false,
                    };
                    state.grid[i][j] = new_cell;
                    if (new_cell.value != ""){
                        state.USER_ROWS[i][new_cell.value] += 1;
                        state.USER_COLS[j][new_cell.value] += 1;
                        let subsquare_key = [Math.floor(i/ 3), Math.floor(j/ 3)].join(",");
                        state.USER_SUBSQUARES[subsquare_key][new_cell.value] += 1;
                    }
                }
            }
            this.commit("createSkyscraper/generateHeights");
            this.commit("createSkyscraper/isFinished");
        },
        generateGridFromImport(state, imported){
            state.USER_ROWS= {
                0: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                1: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                2: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                3: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                4: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                5: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                6: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                7: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                8: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
            };
            state.USER_COLS={
                0: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                1: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                2: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                3: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                4: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                5: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                6: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                7: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                8: [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
            };
            state.USER_SUBSQUARES= {
                "0,0": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "0,1": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "0,2": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "1,0": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "1,1": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "1,2": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "2,0": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "2,1": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
                "2,2": [0, 0, 0, 0, 0, 0, 0, 0, 0,0],
            };
            state.solution = imported.solution;
            for (let i = 0; i < state.grid.length; i++) {
                for (let j = 0; j < state.grid.length; j++) {
                    let new_cell = {
                        value: imported.grid[i][j],
                        selected: false,
                        error: false,
                    };
                    state.grid[i][j] = new_cell;
                    state.USER_ROWS[i][new_cell.value] += 1;
                    state.USER_COLS[j][new_cell.value] += 1;
                    let subsquare_key = [Math.floor(i/ 3), Math.floor(j/ 3)].join(",");
                    state.USER_SUBSQUARES[subsquare_key][new_cell.value] += 1;
                }
            }
            this.commit("createSkyscraper/generateHeights");
            this.commit("createSkyscraper/isFinished");

        },
        createSkyscraper(state, title) {

            let to_play = state.grid;
            for (let row=0; row<state.grid.length; row++){
                for (let col=0; col<state.grid.length; col++){
                    to_play[row][col] = parseInt(state.grid[row][col].value,0);
                }
            }


            //get difficulty
            let amount_deleted = 0;
            for (let i = 0; i < state.grid.length; i++) {
                for (let j = 0; j < state.grid.length; j++) {
                    if (isNaN(to_play[i][j])) {
                        amount_deleted += 1;
                        to_play[i][j] = "";
                    }
                }
            }

            if (amount_deleted == 0) {
                Swal.fire({
                    title:"Error",
                    text: "Cannot create puzzle - too easy!",
                    icon:'error',
                    });
            } else if (state.has_deleted == 0) {
                Swal.fire({
                    title:"Error",
                    text: "Cannot create puzzle - a copy!",
                    icon:'error',
                    });
            } else {
                let difficulty;
                if (amount_deleted > 52) {
                    difficulty = 5;
                } else if (amount_deleted > 40) {
                    difficulty = 4;
                } else if (amount_deleted > 28) {
                    difficulty = 3;
                } else if (amount_deleted > 16) {
                    difficulty = 2;
                } else {
                    difficulty = 1;
                }
                
                postSkyscraper(to_play, state.solution, title, state.heights, cookies.get('user').username,cookies.get('user').user_id, difficulty);
            }
        },
        generateHeightsFinal(state, grid_to_check){
            state.heights={
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
            }
            //go through rows first
            for (let row=0; row < grid_to_check.length; row++){
                let current_row = grid_to_check[row];
                state.heights.ROWS[row]['left'] = getCanSee(current_row, 1);
                //traverse other way
                state.heights.ROWS[row]['right'] = getCanSee(current_row, 0);

                //setting up the columns for this row
                let column = [];
                for (let j=0; j<9; j++){
                    column.push(grid_to_check[j][row]);
                }
                state.heights.COLS[row]['top'] = getCanSee(column,1);
                state.heights.COLS[row]['bottom'] = getCanSee(column,0);
            }            
        },
        generateHeights(state) {

            //go through rows first
            for (let row=0; row < state.solution.length; row++){
                let current_row = state.solution[row];
                state.heights.ROWS[row]['left'] = getCanSee(current_row, 1);
                //traverse other way
                state.heights.ROWS[row]['right'] = getCanSee(current_row, 0);

                //setting up the columns for this row
                let column = [];
                for (let j=0; j<9; j++){
                    column.push(state.solution[j][row]);
                }
                state.heights.COLS[row]['top'] = getCanSee(column,1);
                state.heights.COLS[row]['bottom'] = getCanSee(column,0);
            }            
        },
        setSelected(state, pos) {
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
        deleteDigit(state, {x,y}) {
            state.grid[x][y].value = "";
            state.has_deleted = 1;
        },
        setSkyscraperDigit(state, {x}){

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
                state.finished = false;
                state.grid[state.selected.x][state.selected.y].value = "";
                return;
            }
            state.grid[state.selected.x][state.selected.y].value = x;
            state.USER_ROWS[state.selected.x][x] += 1;
            state.USER_COLS[state.selected.y][x] += 1;
            state.USER_SUBSQUARES[subsquare_key][x] += 1;
            this.commit("createSkyscraper/generateHeights");

            this.commit("createSkyscraper/isFinished");
            
        },
        isFinished(state) {
            state.finished = false;
            for (let i = 0; i < state.grid.length; i++) {
                for (let j = 0; j < state.grid.length; j++) {
                    if (state.grid[i][j].error == true || state.grid[i][j].value=="" || state.grid[i][j].value==" "){
                        state.finished = false;
                        return;
                    }
                }
            }
            state.finished = true;
        }
    },
}