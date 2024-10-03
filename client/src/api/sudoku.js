
// booleans
export function can_place_in_row(state, cell, num,is_solution) {
    if (is_solution) {
        return state.solution_grid[cell.rowIndex].indexOf(num) == -1;
    }
    return state.grid[cell.rowIndex].indexOf(num) == -1;

}

export function can_place_in_col(state, cell, num,is_solution) {
    if (is_solution) {
        //go through the column index per row
        return !state.solution_grid.some((row) => row[cell.colIndex] == num);
        //some returns true if at least one of the values in array meet criteria
    }
    return !state.grid.some((row) => row[cell.colIndex] == num);

}

export function can_place_in_subsquare(state, cell, num,is_solution) {
    //each subsquare's top left region
    let box_startRow = cell.rowIndex - (cell.rowIndex % 3);
    let box_startCol = cell.colIndex - (cell.colIndex % 3);
    if (is_solution) {
        for (let i = 0; i < 3; i++) {
            //each box region from 0-2
            for (let j = 0; j < 3; j++) {
                if (state.solution_grid[box_startRow + i][box_startCol + j] == num) {
                    return false;
                }
            }
        }
        return true;
    } else {
        for (let i = 0; i < 3; i++) {
            //each box region from 0-2
            for (let j = 0; j < 3; j++) {
                if (state.grid[box_startRow + i][box_startCol + j] == num) {
                    return false;
                }
            }
        }
        return true;
    }

}

export function safe_to_place(state, cell, num) {
    return (
        can_place_in_row(state, cell, num,true) &&
        can_place_in_col(state, cell, num,true) &&
        can_place_in_subsquare(state, cell, num,true)
    );
}

export function safe_to_place_user_grid(state,cell,num) {
    return (
        can_place_in_row(state, cell, num,false) &&
        can_place_in_col(state, cell, num,false) &&
        can_place_in_subsquare(state, cell, num,false)
    );
}

export function shuffle_list(nums) {
    let new_arr = [...nums];
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [new_arr[i], new_arr[j]] = [new_arr[j], new_arr[i]];
    }
    return new_arr;
}
export function findEmpty(grid) {
    const emptyCell = { rowIndex: "", colIndex: "" };
    grid.forEach((row, rowIndex) => {
        if (emptyCell.colIndex !== "") return; //already assigned
        let zeroLoci = row.find((col) => col === 0);
        if (zeroLoci === undefined) return; //go to next row if no zeroes

        emptyCell.rowIndex = rowIndex;
        emptyCell.colIndex = row.indexOf(zeroLoci);
    });

    if (emptyCell.colIndex !== "") return emptyCell;
    //no more zeroes if empty cell not assigned
    return false;
}

export function generateGridRecur(state) {
    const empty_cell = findEmpty(state.solution_grid);
    if (!empty_cell) {
        return state.solution_grid;
    } //fully filled

    let possible_nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let shuffled = shuffle_list(possible_nums);

    // //timeout in case algo takes too long to generate a number
    let counter = 0;
    for (let i = 0; i < shuffled.length; i++) {
        counter++;
        let num = shuffled[i];
        if (counter > 20000000) throw new Error("Recursion Timeout");
        if (safe_to_place(state, empty_cell, num)) {
            state.solution_grid[empty_cell.rowIndex][empty_cell.colIndex] = num;

            //recursive call to place num in the next empty
            if (generateGridRecur(state)) {
                return state.solution_grid;
            } else {
                //backtrack if we cannot place the future num - prev num wrong
                state.solution_grid[empty_cell.rowIndex][empty_cell.colIndex] = 0;
            }
        }
    }
    return false; //if we cannot place any number, return false, so we go back to a prev state
}

export function checkSolutionRecur(state, grid, all_solutions) {
    const empty_cell = findEmpty(grid);
    if (!empty_cell){
        all_solutions.push(grid);
        return false; //should keep failing - we want to go through every possible solution
    } 

    let possible_nums = [1,2,3,4,5,6,7,8,9];
    let shuffled = shuffle_list(possible_nums);
    let counter = 0;
    for (let i=0; i<shuffled.length; i++){
        counter ++;
        let num = shuffled[i];
        if (counter > 20000000) throw new Error("Recursion Timeout");
        if (safe_to_place(state, empty_cell, num)){
            grid[empty_cell.rowIndex][empty_cell.colIndex] = num;

            if (checkSolutionRecur(state, grid, all_solutions)) {
                return all_solutions;
            } else {
                grid[empty_cell.rowIndex][empty_cell.colIndex] = 0; //should always come here
            }
        }
    }
    return false;
    
}

export function changeDigit(state, x, y) {

    if (state.new_grid[x][y] != "") {
        state.new_grid[x][y] = ""; //for standardisation - a 0 means empty.
    } else {
        state.new_grid[x][y] = state.solution_grid[x][y];
    }

}

export function validMove(state) {
    let hasError = false;
    for( let x = 0; x < state.grid.length; x++){
        for( let y = 0; y < state.grid.length; y++){
            state.grid[x][y].error = false;

            if (!Number.isInteger(state.grid[x][y].value)){
                continue;
            }
            //rows
            let digit = state.grid[x][y].value;
            if ((state.ROWS[x].has(digit) && !state.grid[x][y].original) || state.USER_ROWS[x][digit] > 1 && !state.grid[x][y].original){
                hasError = true;
                state.grid[x][y].error = hasError;
                continue;
            } 
       
            if ((state.COLS[y].has(digit) && !state.grid[x][y].original) || (state.USER_COLS[y][digit] > 1 && !state.grid[x][y].original)){
                hasError = true;
                state.grid[x][y].error = hasError;
                continue;
            } 

            //subsquares
            let subsquare_key = [Math.floor(x / 3), Math.floor(y / 3)].join(
                ","
            );
            
            if ((state.SUBSQUARES[subsquare_key].has(digit) && !state.grid[x][y].original)|| 
            (state.USER_SUBSQUARES[subsquare_key][digit] > 1 && !state.grid[x][y].original)){

                hasError = true;
                state.grid[x][y].error = hasError;
                continue;

            }
        }
    }

}

export function validPutSkyscraper(state) {
    let hasError = false;
    for( let x = 0; x < state.grid.length; x++){
        for( let y = 0; y < state.grid.length; y++){
            state.grid[x][y].error = false;
            //rows
            let digit = state.grid[x][y].value;
            if (state.USER_ROWS[x][digit] > 1){
                hasError = true;
                state.grid[x][y].error = hasError;
                continue;
            } 
       
            if (state.USER_COLS[y][digit] > 1){
                hasError = true;
                state.grid[x][y].error = hasError;
                continue;
            } 

            //subsquares
            let subsquare_key = [Math.floor(x / 3), Math.floor(y / 3)].join(
                ","
            );
            
            if (state.USER_SUBSQUARES[subsquare_key][digit] > 1){

                hasError = true;
                state.grid[x][y].error = hasError;
                continue;

            }
        }
    }

}

export function getCanSee(to_iterate, forwards){
    //how many you can read in ascending order before you get to a '9' (don't count those lower than max of what's seen before)
    
    let pointer = 0;
    let can_see = 0;
    let cur_max = 0;
    if (forwards) {
        while (to_iterate[pointer] && pointer < 9){
            if ((to_iterate[pointer] != "") && (to_iterate[pointer] >= cur_max)){
                can_see += 1;
                cur_max = to_iterate[pointer];
            }
            pointer += 1;
        }
    } else {
        pointer = 8;
        can_see = 0;
        while (to_iterate[pointer] && pointer > -1){
            if ((to_iterate[pointer] != "") && (to_iterate[pointer] >= cur_max)){
                can_see += 1;
                cur_max = to_iterate[pointer];
            }
            pointer -= 1;
        }
    }
    return can_see;
}