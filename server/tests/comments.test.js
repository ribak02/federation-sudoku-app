const request = require('supertest');
const baseURL = 'https://cs3099user12.host.cs.st-andrews.ac.uk/';

/**
 * Test that checks get_comments API
 */
describe('Checking get_comments API', () => {
    it('returns response with body containing comments for the specified puzzle for successful retrieval of comments', async () => {
        const response = await request(baseURL).get('api/get_comments/92');
        console.log(response.body);
        expect(response.body[0].username).toBe('test'); // checks if puzzle_id retrieved is 94
    })
})

/**
 * Test that checks submit_comment API
 */
describe('Checking submit_comment API', () => {
    it('returns response with status code 502 due to wrong data type for one of input fields', async () => {
        // object with test data
        const puzzle_comment = {
            puzzle_id : "po",
            user_id : 34,
            comment_message: "hahah",
            comment_is_parent: true,
            comment_parent: true,
            comment_edited: true
        }

        const response = await request(baseURL).post('/api/submit_comment').send(puzzle_comment); // post request is made
        expect(response.body.name).toBe("SqlError"); // checks if name attribute in response is an Sql Error
    })
})