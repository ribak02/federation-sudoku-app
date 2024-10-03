import * as sid from "../../src/api/sudoku.js"

// can_place_in_row FUNCTION

/**
 * Test that checks if the can_place_in_row function returns true for a case where given value does not exist in given row
 */
describe('Checks can_place_in_row function', () => {
    it('returns true if number does not exist in row', () => {
        let state = { // test state created with random values in solution_grid
            solution_grid: [[3, 9, 5, 4, 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, 9, 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]]
        }

        let cell = { // test object with row index and column index
            rowIndex: 1,
            colIndex: 8
        }
        expect(sid.can_place_in_row(state, cell, 3, true)).toBe(true); // tests if function returns true for a value of 3 to be placed in row
    })
})

/**
 * Test that checks if the can_place_in_row function returns falses for a case where given value does exist in given row
 */
describe('Checks can_place_in_row function', () => {
    it('returns false if number does exist in row', () => {
        let state = { // test state created with random values in solution_grid
            solution_grid: [[3, 9, 5, 4, 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, 9, 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]]
        }

        let cell = { // test object with row index and column index
            rowIndex: 0,
            colIndex: 3
        }
        expect(sid.can_place_in_row(state, cell, 5, true)).toBe(false);// tests if function returns false for a value of 5 to be placed in row due to the existence of 5 in the given row
    })
})

// can_place_in_col FUNCTION

/**
 * Test that checks if the can_place_in_col function returns true for a case where given value does not exist in given column
 */
describe('Checks can_place_in_col function', () => {
    it('returns true if number does not exist in column', () => {
        let state = { // test state created with random values in solution_grid
            solution_grid: [[3, 9, 5, 4, 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, 9, 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]]
        }

        let cell = { // test object with row index and column index
            rowIndex: 0,
            colIndex: 1
        }
        expect(sid.can_place_in_col(state, cell, 4, true)).toBe(true);// tests if function returns true for a value of 4 to be placed in row
    })
})

/**
 * Test that checks if the can_place_in_col function returns false for a case where given value does exist in given column
 */
describe('Checks can_place_in_col function', () => {
    it('returns false if number does exist in column', () => {
        let state = {
            solution_grid: [[3, 9, 5, 4, 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, 9, 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]]
        }
        let cell = {
            rowIndex: 0,
            colIndex: 3
        }
        expect(sid.can_place_in_col(state, cell, 4, true)).toBe(false);// tests if function returns false for a value of 4 to be placed in column due to the existence of 4 in the given column
    })
})

// can_place_in_subsquare FUNCTION

/**
 * Test that checks if the can_place_in_subsquare function returns true for a case where given value does not exist in current subsquare
 */
describe('Checks can_place_in_subsquare function', () => {
    it('returns true if number does not exist in subsquare', () => {
        let state = {
            solution_grid: [[3, 9, , 4, 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, , 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]]
        }
        let cell = {
            rowIndex: 3,
            colIndex: 2
        }
        expect(sid.can_place_in_subsquare(state, cell, 9, true)).toBe(true);// tests if function returns true for a value of 9 to be placed
    })
})

/**
 * Test that checks if the can_place_in_subsquare function returns false for a case where given value does exist in current subsquare
 */
describe('Checks can_place_in_subsquare function', () => {
    it('returns false if number does exist in subsquare', () => {
        let state = {
            solution_grid: [[3, 9, 5, 4, 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, 9, 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]]
        }
        let cell = {
            rowIndex: 3,
            colIndex: 0
        }
        expect(sid.can_place_in_subsquare(state, cell, 8, true)).toBe(false);// tests if function returns false for a value of 8 to be placed in subsquare due to the existence of 8 in the given subsquare
    })
})

// safe_to_place FUNCTION

/**
 * Test that checks if the safe_to_place function returns true for a case where given value is legally allowed
 */
describe('Checks safe_to_place function', () => {
    it('returns true if number is safe to put', () => {
        let state = {
            solution_grid: [[3, 9, 5, 4, 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, , 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]]
        }
        let cell = {
            rowIndex: 3,
            colIndex: 2
        }
        expect(sid.safe_to_place(state, cell, 9, true)).toBe(true); // tests if true is returned 
    })
})


/**
 * Test that checks if the safe_to_place function returns false for a case where given value is legally not allowed
 */
describe('Checks safe_to_place function', () => {
    it('returns false if number is not safe to put', () => {
        let state = {
            solution_grid: [[3, 9, 5, 4, 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, 9, 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]]
        }
        let cell = {
            rowIndex: 7,
            colIndex: 3
        }
        expect(sid.safe_to_place(state, cell, 9, true)).toBe(false); // tests if false is returned 
    })
})

// shuffleList FUNCTION

/**
 * Tests if shuffleList function shuffles list
 */
describe('Checks shuffleList function', () => {
    it('returns a list with shuffled numbers', () => {
        let state = {
            solution_grid: [[3, 9, 5, 4, 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, 9, 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]]
        }

        expect(sid.shuffle_list(state.solution_grid[0])).not.toBe(state.solution_grid[0]); // checks if list has been shuffled
    })
})

// findEmpty FUNCTION

/**
 * Tests if findEmpty function returns the correct row index and column index of where 0 exists in the grid
 */
describe('Checks findEmpty function', () => {
    it('returns correct row index and column index if 0 exists in grid', () => {
        // test state with row index and column index of 0 placed at 1, 7
        let state = [[3, 9, 5, 4, 8, 6, 2, 7, 1],
        [4, 6, 2, 5, 7, 1, 8, 0,],
        [1, 7, 8, 2, 3, 9, 6, 5, 4],
        [2, 3, 9, 6, 4, 8, 5, 1, 7],
        [8, , 1, 7, , 3, 9, , 2],
        [6, 5, 7, 1, 9, 2, 4, 3, 8],
        [5, 1, 4, 9, , 7, 3, , 6],
        [7, 2, 3, 8, 6, 5, 1, 4, 9],
        [9, 8, 6, 3, 1, 4, 7, 2, 5]]

        // object with expected indexes
        let expected_indexes = {
            "colIndex": 7,
            "rowIndex": 1
        }

        expect(sid.findEmpty(state)).toEqual(expected_indexes); // tests if object returned from function is the same as the expected_indexes object
    })
})

/**
 * Tests if findEmpty function returns false if 0 does not exist in the grid
 */
describe('Checks findEmpty function', () => {
    it('returns false if no zeroes exist in the grid', () => {
        // test state with no 0 present in grid
        let state = [[3, 9, 5, 4, 8, 6, 2, 7, 1],
        [4, 6, 2, 5, 7, 1, 8, ,],
        [1, 7, 8, 2, 3, 9, 6, 5, 4],
        [2, 3, 9, 6, 4, 8, 5, 1, 7],
        [8, , 1, 7, , 3, 9, , 2],
        [6, 5, 7, 1, 9, 2, 4, 3, 8],
        [5, 1, 4, 9, , 7, 3, , 6],
        [7, 2, 3, 8, 6, 5, 1, 4, 9],
        [9, 8, 6, 3, 1, 4, 7, 2, 5]]


        expect(sid.findEmpty(state)).toEqual(false); // tests if function returns false
    })
})

/**
 * Tests if generateGridRecur function returns state with solution grid 
 */
describe('Checks generateGridRecur function', () => {
    it('returns state with solution grid if no zeroes exist in the grid', () => {
        // test state with no 0 present in grid
        let state = {
            solution_grid: [[3, 9, 5, 4, 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, 9, 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]]
        }

        expect(sid.generateGridRecur(state)).toEqual(state.solution_grid); // checks if function returns same solution grid
    })
})

// changeDigit FUNCTION

/**
 * Tests if changeDigit function changes values
 */
describe('Checks if changeDigit function changes the object digit', () => {
    it('changes state.new_grid at x and y coordinates to x and y coordinates of solution grid', () => {
        let state = {
            solution_grid: 
            [[3, 9, 5, 4, 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, 9, 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]],

            new_grid: 
            [[3, 9, 5, "", 8, 6, 2, 7, 1],
            [4, 6, 2, 5, 7, 1, 8, ,],
            [1, 7, 8, 2, 3, 9, 6, 5, 4],
            [2, 3, 9, 6, 4, 8, 5, 1, 7],
            [8, , 1, 7, , 3, 9, , 2],
            [6, 5, 7, 1, 9, 2, 4, 3, 8],
            [5, 1, 4, 9, , 7, 3, , 6],
            [7, 2, 3, 8, 6, 5, 1, 4, 9],
            [9, 8, 6, 3, 1, 4, 7, 2, 5]]
        }

        sid.changeDigit(state, 0, 3);

        expect(state.new_grid[0][3]).toBe(4);
    })
})

// getCanSee FUNCTION

/**
 * Tests if getCanSee function returns the correct number of buildings that can be seen. (Sky Scrapper Sudoku)
 */
describe('Checks if getCanSee function returns correct number of buildings that can be seen', () => {
    it('returns the numbers of buildings that can be seen forwards (towards the right)', () => {
        let buildings = [{value: 1}, {value: 2}, {value: 3}, {value: 5}, {value: 4}, {value: 6}, {value: 2}, {value: 3}, {value: 1}];
        expect(sid.getCanSee(buildings, true)).toBe(5);
    })

    it('returns the numbers of buildings that can be seen backwards (towards the left)', () => {
        let buildings = [{value: 1}, {value: 2}, {value: 3}, {value: 5}, {value: 4}, {value: 6}, {value: 2}, {value: 3}, {value: 1}];
        expect(sid.getCanSee(buildings, false)).toBe(3);
    })
})

