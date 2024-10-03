const request = require('supertest');
const baseURL = 'https://cs3099user12.host.cs.st-andrews.ac.uk/';
const { validateEmail, validatePassword, validateUsername, make_domain, comparePassword, getUserIDFromUsername} = require("../../server/routes/user.js");
const bcrypt = require("bcrypt");

/**
 * Test that checks validate email function, true
 */
describe('Checking validateEmail function', () => {
    it('returns true if it is an email', () => {
        expect(validateEmail("example@gmail.com")).toBe(true);
    })
})

/**
 * Test that checks validate email function, false
 */
describe('Checking validateEmail function', () => {
    it('returns false if it is not an email', () => {
        expect(validateEmail("example'gmail.com")).toBe(false);
    })
})

/**
 * Test that checks validate password function, true
 */
describe('Checking validatePassword function', () => {
    it('returns true if password is greater than 8 characters', () => {
        expect(validatePassword("passwords")).toBe(true);
    })
})

/**
 * Test that checks validate password function, false
 */
describe('Checking validatePassword function', () => {
    it('returns false if password is less than 8 characters', () => {
        expect(validatePassword("passwor")).toBe(false);
    })
})

/**
 * Test that checks validateUsername function, false
 */
describe('Checking validateUsername function', () => {
    it('returns false if user name has no spaces', () => {
        expect(validateUsername("username")).toBe(false);
    })
})

/**
 * Test that checks validateUsername function, true
 */
describe('Checking validateUsername function', () => {
    it('returns true if user name has spaces', () => {
        expect(validateUsername("user name")).toBe(true);
    })
})

/**
 * Test that checks make_domain function
 */
describe('Checking make_domain function', () => {
    it('returns a concatenated string of form https://cs3099user" + INPUTTOFUNCTION + ".host.cs.st-andrews.ac.uk', () => {
        let server_id = 100;
        expect(make_domain(server_id)).toBe("https://cs3099user" + server_id + ".host.cs.st-andrews.ac.uk");
    })
})

/**
 * Test that checks comparePassword function
 */
describe('Checking comparePassword function', () => {
    it('returns true if hashed password and password are the same', async () => {
        let string_password = "testPassword@11";
        const hash = await bcrypt.hash(string_password, 10);
        expect(await comparePassword(string_password, hash)).toBe(true);
    })
})

/**
 * Test that checks comparePassword function
 */
describe('Checking comparePassword function', () => {
    it('returns false if hashed password and password are not the same', async () => {
        let string_password = "testPassword@11";
        let different_password = "testPasswordCopy"
        const hash = await bcrypt.hash(string_password, 10);
        expect(await comparePassword(different_password, hash)).toBe(false);
    })
})
