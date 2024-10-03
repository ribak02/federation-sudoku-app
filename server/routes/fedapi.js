const express = require("express");
const querystring = require("querystring");
const jwt = require("jsonwebtoken");
const { pool } = require("../db/database");
const cors = require("cors");
const axios = require("axios");
const { make_domain, getTokenDetails } = require("./user");

const SERVER_ID = 12;
const REQUEST_TIMEOUT = 5000;

const router = express.Router();

router.use(cors());

/**
 * Gets our server secret
 * @returns our server secret
 */
async function get_our_secret() {
    const result = await pool.query(
        "SELECT server_secret FROM Server WHERE server_id = ?",
        [SERVER_ID]
    );
    if (result.length == 1) {
        return result[0]["server_secret"];
    } else {
        return null;
    }
}

/**
 * Checks that a given server id and secret match
 * @param {*} server_id 
 * @param {*} secret 
 * @returns true if they match, false otherwise
 */
async function secret_is_valid(server_id, secret) {
    const result = await pool.query(
        "SELECT server_id FROM Server WHERE server_id = ? AND server_secret = ?",
        [server_id, secret]
    );
    if (result.length == 1) {
        return true;
    }
    return false;
}

/**
 * Gets all the servers that are online right now
 * @returns a list of server ids
 */
async function get_online_servers() {
    var online_servers = [];

    for (let server_id = 10; server_id < 20; server_id++) {
        if (server_id != SERVER_ID) {
            await axios
                .get(make_domain(server_id))
                .then(response => {
                    online_servers.push(server_id);
                })
                .catch((err) => { });
        }
    }

    return online_servers;
}

/**
 * Returns all online server ids
 */
router.get("/fedapi/online_servers", async (req, res) => {
    res.json(await get_online_servers());
});

/**
 * Returns a liveness message with some basic information
 */
router.get("/fedapi", (req, res) => {
    res.send({
        group: 12,
        greeting: "Welcome to our federated backend!",
    });
});

/**
 * Redirects a user to our external login page
 */
router.get("/fedapi/auth/authorise", (req, res) => {
    let query = {
        response_type: req.query.response_type,
        redirect_uri: req.query.redirect_uri,
        client_id: req.query.client_id,
        state: req.query.state,
    };

    let invalid_response = { success: false, error_message: null };

    if (query.response_type != "code") {
        invalid_response.error_message = "Invalid response type.";
    } else if (10 > query.client_id && query.client_id > 19) {
        invalid_response.error_message = "Invalid client ID.";
    } else if (query.state != null && query.state.length == 0) {
        invalid_response.error_message = "Invalid state.";
    }

    if (invalid_response.error_message == null) {
        const redirect_query_string = querystring.stringify(query);
        res.redirect("/oauth_login?" + redirect_query_string);
    } else {
        res.json(invalid_response);
    }
});

/**
 * Returns the authenticated user's jwt after validaating the given grant
 */
router.post("/fedapi/auth/token", async (req, res) => {
    const grant_type = req.body.grant_type;
    const grant_token = req.body.code;
    const server_id = req.body.client_id;
    const secret = req.body.client_secret;

    if (grant_type && grant_token && server_id && secret) {
        if (grant_type == "authorization_code") {
            if (10 <= server_id && server_id <= 19) {
                if (await secret_is_valid(server_id, secret)) {
                    const result = await pool.query(
                        "SELECT jwt FROM Account_JWT WHERE grant_token = ? AND server_in_use_id = ?",
                        [grant_token, server_id]
                    );
                    if (result.length == 1) {
                        var jwtResult = result[0]["jwt"];

                        var details = getTokenDetails(jwtResult);

                        if (details != null) {
                            res.json({
                                access_token: jwtResult,
                                expires_in: details.exp * 1000 - Date.now(),
                            });
                        } else {
                            res.status(401).json({
                                error: "token_error",
                                expires_in: "Token expired.",
                            });
                        }
                    } else {
                        res.status(400).json({
                            error: "invalid_grant",
                            error_description: "The grant token is invalid.",
                        });
                    }
                } else {
                    res.status(401).json({
                        error: "unauthorized_client",
                        error_description:
                            "The client secret or ID is invalid.",
                    });
                }
            } else {
                res.status(400).json({
                    error: "invalid_client",
                    error_description: "The client ID is invalid.",
                });
            }
        } else {
            res.status(400).json({
                error: "unsupported_grant_type",
                error_description: "The grant type is unsupported.",
            });
        }
    } else {
        res.status(400).json({
            error: "invalid_request",
            error_description: "The request is invalid.",
        });
    }
});

/**
 * Returns the user's details after valdating the jwt
 */
router.get("/fedapi/user", async (req, res) => {
    var token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
        token = token.substring(7, token.length);
    } else {
        res.status(400).json({
            error: "bad_request",
            error_description: "Header is invalid",
        });
        return;
    }

    const jwt_check_result = await pool.query(
        "SELECT account_id FROM Account_JWT WHERE jwt = ?",
        [token]
    );

    if (jwt_check_result.length == 1) {
        user_id = jwt_check_result[0]["account_id"];
        const user_result = await pool.query(
            "SELECT username, email FROM Account WHERE account_id = ?",
            [user_id]
        );

        if (user_result.length == 1) {
            const user = user_result[0];

            res.json({
                username: user.username,
                email: user.email,
                id: user_id,
                group: SERVER_ID,
            });
        } else {
            res.status(500).json({
                error: "databse_error",
                error_description: "Error in database",
            });
        }
    } else {
        res.status(401).json({
            error: "invalid_token",
            error_description: "Authorization token is invalid",
        });
    }
});

/**
 * Fetches the user's jwt from the home server
 */
router.post("/fedapi/get_access_token", async (req, res) => {
    const target_server_id = req.body.server_id;
    const code = req.body.code;
    const state = req.body.state;

    const { state_cookie } = req.signedCookies;


    if (state != null && target_server_id != null && code != null) {
        if (state_cookie != null) {
            if (state.normalize() == state_cookie.normalize()) {
                const params = new URLSearchParams({
                    client_id: SERVER_ID,
                    client_secret: await get_our_secret(),
                    grant_type: "authorization_code",
                    code: code,
                });
                axios
                    .post(
                        make_domain(target_server_id) + "/fedapi/auth/token",
                        params
                    )
                    .then((response) => {

                        res.cookie("jwt_cookie", response.data.access_token, {
                            maxAge: response.data.expires_in,
                            signed: true,
                        });

                        res.json({
                            success: true,
                            token: response.data.access_token,
                        });
                    })
                    .catch((err) => {
                        res.json({
                            success: false,
                            error: err.data,
                        });
                    });
            } else {
                res.json({
                    success: false,
                    error_message: "Invalid state",
                });
            }
        } else {
            res.json({
                success: false,
                error_message: "State cookie not found",
            });
        }
    } else {
        res.json({
            success: false,
            error_message: "Invalid query values",
        });
    }
});

/**
 * Fetches the user's details from the home server
 */
router.post("/fedapi/get_user_details", async (req, res) => {
    const target_server_id = req.body.server_id;

    const { jwt_cookie } = req.signedCookies;

    if (jwt_cookie != null) {
        axios
            .get(make_domain(target_server_id) + "/fedapi/user", {
                headers: {
                    Authorization: `Bearer ${jwt_cookie}`,
                },
            })
            .then((response) => {
                var data = response.data;
                if (data.username && data.id && data.group && data.email) {
                    res.json({
                        is_authenticated: true,
                        is_logged_in: true,
                        user_id: data.id,
                        username: data.username,
                        account_role: 3,
                        server_id: data.group,
                        email: data.email,
                    });
                } else {
                    res.json({
                        success: false,
                        error_message: "Invalid user details returned",
                    });
                }
            })
            .catch((error) => {
                res.json({
                    success: false,
                    error_message: "Error: " + error.data,
                });
            });
    } else {
        res.json({
            success: false,
            error_message: "JWT cookie not found",
        });
    }
});

/**
 * Converts a puzzle to the federation protocol
 * @param {*} puzzles 
 */
function clean_puzzles(puzzles) {
    for (let index = 0; index < puzzles.length; index++) {
        puzzle = puzzles[index]
        puzzles[index]["author_id"] = puzzle["author_id"].toString();
        puzzles[index]["sudoku_id"] = puzzle["sudoku_id"].toString();
        puzzles[index]["puzzle"] = JSON.parse(puzzle["puzzle"]);
        puzzles[index]["solution"] = JSON.parse(puzzle["solution"]);
    }
}

/**
 * Returns all sudoku puzzles. Accepts an optional difficulty parameter
 */
router.get("/fedapi/sudoku", async (req, res) => {
    difficulty = req.query.difficulty;

    if (difficulty) {
        difficulty = Number(difficulty);
        if (Number.isInteger(difficulty) && difficulty > 0) {
            const sudoku_result = await pool.query("SELECT puzzle_id AS sudoku_id, account_id AS author_id, server_id AS 'group', difficulty, puzzle_grid AS puzzle, puzzle_solution AS solution FROM Puzzle WHERE difficulty = ?",
                [difficulty]);

            clean_puzzles(sudoku_result);
            res.json(sudoku_result);

        } else {
            res.json({
                error: "invalid_difficulty",
                error_description: "DIfficulty must be a positive integer"
            })
        }
    } else {
        const sudoku_result = await pool.query("SELECT puzzle_id AS sudoku_id, account_id AS author_id, server_id AS 'group', difficulty, puzzle_grid AS puzzle, puzzle_solution AS solution FROM Puzzle");

        clean_puzzles(sudoku_result);
        res.json(sudoku_result);
    }
});

/**
 * Fetches all sudoku puzzles from a given server, and time out if the request took too long
 * @param {*} puzzles 
 * @param {*} server_id 
 */
async function get_puzzles_from_server(puzzles, server_id) {
    await new Promise(async resolve => {
        setTimeout(resolve, REQUEST_TIMEOUT);
        await axios
            .get(make_domain(server_id) + "/fedapi/sudoku")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    puzzles[server_id.toString()] = response.data;
                }
            }).catch(err => { });
        resolve();
    })
}

/**
 * Fetches all sudoku puzzles from all servers
 */
router.get("/fedapi/federation_puzzles", async function (req, res) {

    const online_servers = await get_online_servers();
    var puzzles = {};

    for (const server_id of online_servers) {
        await get_puzzles_from_server(puzzles, server_id);
    }

    res.json(puzzles);
});


module.exports = router;

