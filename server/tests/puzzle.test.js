const request = require('supertest');
const baseURL = 'https://cs3099user12.host.cs.st-andrews.ac.uk/';

/**
 * Test that checks get_puzzle API
 */
describe('Checking get_puzzle API', () => {
    it('returns response with body containing puzzle details for successful retrieval of puzzle', async () => {
        const response = await request(baseURL).get('api/get_puzzle/90');
        // console.log(response.body);
        expect(response.body.puzzle_id).toBe(90); // checks if puzzle_id retrieved is 94
    })
})

/**
 * Test that checks get_puzzle API
 */
describe('Checking get_puzzle API', () => {
    it('returns response with empty body for unsuccessful retrieval of puzzle', async () => {
        const response = await request(baseURL).get('api/get_puzzle/');
        expect(response.body.puzzle_id).toBe(undefined);
    })
})

/**
 * Test that checks puzzles API
 */
describe('Checking puzzles API', () => {
    it('returns response body with length >= 1 for successful retrieval of puzzles', async () => {
        const response = await request(baseURL).get('api/puzzles');
        expect(response.body.length).toBeGreaterThanOrEqual(0); // checks if body length is greater than 0  
    })
})

/**
 * Test that checks create_puzzle API
 */
describe('Checking create_puzzle API', () => {
    it('returns response with status code 502 due to wrong data type for one of input fields', async () => {
        // object with test data
        const puzzle_details = {
            puzzle_type : 1,
            difficulty : "p", 
            puzzle_grid : [["3","9","5","4","8","6","2","7","1"],["4","6","2","5","7","1","8","",""],["1","7","8","2","3","9","6","5","4"],["2","3","9","6","4","8","5","1","7"],["8","","1","7","","3","9","","2"],["6","5","7","1","9","2","4","3","8"],["5","1","4","9","","7","3","","6"],["7","2","3","8","6","5","1","4","9"],["9","8","6","3","1","4","7","2","5"]],
            created_at : "2022-11-11T16:44:12.000Z",
            puzzle_name : 'test-api-puzzle',
            created_by : 'breakingjaws',
            puzzle_solution : [["3","9","5","4","8","6","2","7","1"],["4","6","2","5","7","1","8","0","0"],["1","7","8","2","3","9","6","5","4"],["2","3","9","6","4","8","5","1","7"],["8","0","1","7","0","3","9","0","2"],["6","5","7","1","9","2","4","3","8"],["5","1","4","9","0","7","3","0","6"],["7","2","3","8","6","5","1","4","9"],["9","8","6","3","1","4","7","2","5"]],
            account_id : 34,
            server_id : 12
        }

        const response = await request(baseURL).post('/api/create_puzzle').send(puzzle_details); // post request is made
        expect(response.body.name).toBe("SqlError"); // checks if name attribute in response is an Sql Error
    })
})

/**
 * Test that checks create_skyscraper API
 */
describe('Checking create_skyscraper API', () => {
    it('returns response with status code 502 due to wrong data type for one of input fields', async () => {
        // object with test data
        const puzzle_details = {
            puzzle_type : 1,
            difficulty : "p", 
            puzzle_grid : [["3","9","5","4","8","6","2","7","1"],["4","6","2","5","7","1","8","",""],["1","7","8","2","3","9","6","5","4"],["2","3","9","6","4","8","5","1","7"],["8","","1","7","","3","9","","2"],["6","5","7","1","9","2","4","3","8"],["5","1","4","9","","7","3","","6"],["7","2","3","8","6","5","1","4","9"],["9","8","6","3","1","4","7","2","5"]],
            puzzle_name : 'test-api-puzzle',
            created_by : 'breakingjaws',
            puzzle_solution : [["3","9","5","4","8","6","2","7","1"],["4","6","2","5","7","1","8","0","0"],["1","7","8","2","3","9","6","5","4"],["2","3","9","6","4","8","5","1","7"],["8","0","1","7","0","3","9","0","2"],["6","5","7","1","9","2","4","3","8"],["5","1","4","9","0","7","3","0","6"],["7","2","3","8","6","5","1","4","9"],["9","8","6","3","1","4","7","2","5"]],
            account_id : 34,
        }

        const response = await request(baseURL).post('/api/create_skyscraper').send(puzzle_details); // post request is made
        expect(response.body.name).toBe("SqlError"); // checks if name attribute in response is an Sql Error
    })
})