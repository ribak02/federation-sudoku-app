const express = require("express");
const crypto = require("crypto");
const base64 = require("url-safe-base64");
const jwt = require("jsonwebtoken");
const querystring = require("querystring");
const bcrypt = require("bcrypt");
const Speakeasy = require("speakeasy");
const moment = require('moment');

const SERVER_ID = 12;
const TOKEN_KEY = process.env.TOKEN_KEY;

const router = express.Router();
const { pool } = require("../db/database");

router.use(express.json());

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validatePassword(password) {
    if (password == null || password.length < 8) {
        return false;
    }
    else {
        return true;
    }
}

function validateUsername(username) {
    return /\s/.test(username);
}

async function validateNewUser(user_data) {
    try {
        let username = user_data.username;
        let email = user_data.email;
        let password = user_data.password;

        if (!validatePassword(password)) {
            return ({
                success: false,
                error_message: "Password must be at least 8 characters long.",
            });
        }

        if (!validateEmail(email)) {
            return ({
                success: false,
                error_message: "Email invalid.",
            });
        }

        if (validateUsername(username)) {
            return ({
                success: false,
                error_message: "Username invalid, must not include any spaces.",
            });
        }

        const username_check_result = await pool.query(
            "SELECT * FROM Account WHERE username = ?",
            [username]
        );

        if (username_check_result.length > 0) {
            // Duplicate username found
            return ({
                success: false,
                error_message: "Username already taken.",
            });
        } else {
            const email_check_result = await pool.query(
                "SELECT * FROM Account WHERE email = ?",
                [email]
            );

            if (email_check_result.length > 0) {
                // Duplicate email
                return ({
                    success: false,
                    error_message: "Email already in use.",
                });
            } else {
                return ({
                    success: true,
                });
            };
        }
    } catch (error) {
        return ({
            success: false,
            error_message: "Database error: " + error,
        });
    }
}

/**
 * Generates a verification code for the new user and returns it. We would have sent it by email but that can't happen
 */
router.post("/api/get_verification_code", async (req, res) => {
    const email = req.body.email;

    if (validateEmail(email)) {
        let { secret } = req.signedCookies;

        if (secret == null) {
            secret = Speakeasy.generateSecret().base32;

            res.cookie(
                "verification_code_secret", secret, {
                maxAge: 1000 * 60 * 5, // 5 min
                signed: true,
            });
        }

        const code = Speakeasy.totp({
            secret: secret,
            encoding: "base32",
            email: email,
            window: 6
        })

        res.json({
            success: true,
            code: code
        });
    } else {
        res.json({
            success: false
        });
    }
});

/**
 * Checks that the new user's details are valid
 */
router.post("/api/validate_new_user", async (req, res) => {
    const result = await validateNewUser(req.body);
    res.json(result);
});


/**
 * Registers a new user after verifying the verification code
 */

router.post("/api/register", async (req, res) => {
    const result = await validateNewUser(req.body);

    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (result.success) {
        // Now check verification code
        const { verification_code_secret } = req.signedCookies;
        const valid = Speakeasy.totp.verify({
            secret: verification_code_secret,
            encoding: "base32",
            token: req.body.code,
            email: email,
            window: 6
        });

        if (valid) {
            //Hash password and register new user
            const hash = await bcrypt.hash(password, 10);

            const new_user_result = await pool.query(
                "INSERT INTO Account(username, email, hashed_password, name, server_id, requested_promotion, streak, account_role) VALUES (?, ?, ?, ?, ?, false, 1, 3)",
                [username, email, hash, name, SERVER_ID]
            );

            if (new_user_result.affectedRows == 1) {
                res.json({
                    success: true,
                });
            } else {
                res.json({
                    success: false,
                    error_message: "Failed to register new user"
                });
            }
        } else {
            res.json({
                success: false,
                error_message: "Invalid verification code"
            })
        }
    } else {
        res.json(result);
    }
});


/**

 */

function getTokenDetails(token) {
    try {
        return jwt.verify(token, process.env.TOKEN_KEY);
    } catch {
        return null;
    }
}

/**
 * Helper function to make the server domain given an id
 * @param {*} server_id 
 * @returns 
 */
function make_domain(server_id) {
    return "https://cs3099user" + server_id + ".host.cs.st-andrews.ac.uk";
}

async function userIsLoggedIn(username) {
    const logged_in_result = await pool.query(
        "SELECT account_id, logged_in FROM Account WHERE username = ?",
        [username]
    );

    if (logged_in_result.length == 1) {

        if (logged_in_result[0]["logged_in"]) {
            user_id = logged_in_result[0]["account_id"];
            const jwt_result = await pool.query(
                "SELECT jwt FROM Account_JWT WHERE account_id = ?",
                [user_id]
            );

            if (jwt_result.length == 1) {
                if (getTokenDetails(jwt_result[0]["jwt"])) {
                    return true;
                } else {
                    // Delete invalid token
                    await pool.query("DELETE FROM Account_JWT WHERE account_id = ?", [user_id]);
                }
            }

            // Update user logged in status to false
            await pool.query("UPDATE Account SET logged_in = ? WHERE account_id = ?", [false, user_id]);
            return false;
        }
    }

    return false;
}

async function updateUserJWT(user_id, jwt, grant_token, target_server_id) {
    await pool.query(
        "UPDATE Account_JWT SET server_in_use_id = ?, jwt = ?, grant_token = ?, created_at = ? WHERE account_id = ?",
        [target_server_id, jwt, grant_token, new Date(Date.now()), user_id]
    );
}

async function updateStreak(user_id) {
    const result = await pool.query("SELECT last_logged_in, streak FROM Account WHERE account_id=?", [user_id]);
    const last_date = moment(result[0]["last_logged_in"]);
    var new_streak = result[0]["streak"];
    const now = moment(moment.utc());

    const diff = now.diff(last_date, 'days');
    // alter event update_streak on schedule every '1' day starts '2023-03-16 00:15:00' do update Account set streak=0 where DATEDIFF(NOW(), last_logged_in) > 1;
    if (diff === 1) {
        new_streak++;
    } else if (diff > 1) {
        new_streak = 0;
    }

    await pool.query("UPDATE Account SET last_logged_in=?, streak=? WHERE account_id=?", [new Date(now.toDate().getTime()), new_streak, user_id]);
}

async function resetStreak() {
    await pool.query("UPDATE Account SET streak=0 WHERE DATEDIFF(NOW(), last_logged_in) > 1");
}

async function logInUser(user_id, jwt, grant_token, target_server_id) {
    const logged_in_result = await pool.query(
        "UPDATE Account SET logged_in = ? WHERE account_id = ?",
        [true, user_id]
    );

    if (logged_in_result.affectedRows == 1) {
        try {
            await pool.query(
                "INSERT INTO Account_JWT(account_id, server_in_use_id, jwt, grant_token, created_at) values (?, ?, ?, ?, ?)",
                [user_id, target_server_id, jwt, grant_token, new Date(Date.now())]
            );

            await updateStreak(user_id);
        } catch (error) {
            // Undo update on Account to keep things consistent
            await pool.query(
                "UPDATE Account SET logged_in = ? WHERE account_id = ?",
                [false, user_id]
            );
            return false;
        }

        return true;
    }
    return false;
}

async function getUserIDFromUsername(username) {
    const result = await pool.query(
        "SELECT account_id FROM Account WHERE username = ?",
        [username]
    );
    if (result.length == 1) {
        return result[0]["account_id"];
    } else {
        return null;
    }
}

async function hasPrivileges(req, level) {
    const { jwt_cookie } = req.signedCookies;

    const token_details = getTokenDetails(jwt_cookie);

    if (token_details) {
        const result = await pool.query("SELECT Account_Role.role_name as role FROM Account JOIN Account_Role ON Account.account_role = Account_Role.role_id WHERE Account.account_id = ?",
            [token_details.user_id])
        return result?.[0]["role"] == level;
    }

    return false;
}

async function usernameMatchesID(req) {
    const { jwt_cookie } = req.signedCookies;

    const token_details = getTokenDetails(jwt_cookie);

    if (token_details) {
        const result = await pool.query("SELECT username FROM Account WHERE account_id = ?",
            [token_details.user_id])
        return result?.[0]["username"] == req.body.username;
    }

    return false;
}

router.post("/api/all_users", async function (req, res) {
    try {
        if (await hasPrivileges(req, "ADMIN")) {
            const only_pending = req.body.only_pending;
            var query = "SELECT username, email, logged_in, account_role, Account_Role.role_name FROM Account JOIN Account_Role ON Account.account_role = Account_Role.role_id";

            if (only_pending) {
                query += " WHERE requested_promotion=true"
            }

            query += " ORDER BY Account.account_id";

            const result = await pool.query(query);

            res.json({
                success: true,
                data: result
            })
        } else {
            res.json({
                success: false,
                error_message: "Permission denied"
            });
        }
    } catch (error) {
        res.json({
            success: false,
            error_message: error
        });
    }
});

/**
 * gets ONE puzzle based on puzzle id in account_puzzle, gets user_id and time_taken
 * parameters: puzzle_id
 */
router.get("/api/get_puzzle_users/:puzzle_id", async function (req, res) {
    let puzzle_id = req.params.puzzle_id;
    try {
        const result = await pool.query(
            "SELECT Account.username as username, time_taken FROM Account_Puzzle JOIN Account ON Account_Puzzle.account_id = Account.account_id WHERE puzzle_id = ? AND solved=true ORDER BY time_taken",
            [puzzle_id]
        );
        if (result.length >= 1) {
            res.json({
                success: true,
                data: result
            });
        } else {
            res.json({
                success: false,
                error: "Puzzle does not exist"
            });
        }
    } catch (error) {
        res.json({
            success: false,
            error: error
        });
    }
});

/**
 * gets puzzle rating from all users
 * parameters: puzzle_id
 */
router.get("/api/get_rating_users/:puzzle_id", async function (req, res) {
    let puzzle_id = req.params.puzzle_id;
    try {
        const result = await pool.query(
            "SELECT account_rating FROM Account_Puzzle WHERE puzzle_id = ?",
            [puzzle_id]
        );
        if (result.length >= 1) {
            res.json({
                success: true,
                data: result
            });
        } else {
            res.json({
                success: false,
                error: "Puzzle does not exist"
            });
        }
    } catch (error) {
        res.json({
            success: false,
            error: error
        });
    }
});

router.post("/api/user_details", async (req, res) => {
    try {
        const username = req.body.username;

        var user_data = {
            isUser: null,
            canSee: null,
            profile: {
                icon: null,
                username: null,
                name: null,
                streak: null,
                role: null,
                requested_promotion: null,
                email: null
            },
            stats: {
                attempted: null,
                solved: null,
                unsolved: null,
                avg_time: null,
                avg_time_str: null,
            },
            solved: {}
        }

        await resetStreak();

        const result = await pool.query("SELECT username, name, email, streak, IFNULL(Account.profile_icon, Constant.default_profile_icon) as icon, Account_Role.role_name as role, requested_promotion FROM Account JOIN Constant JOIN Account_Role ON Account.account_role = Account_Role.role_id WHERE Account.username=?", [username]);

        const user = result[0]

        user_data.profile.icon = user.icon.toString()
        user_data.profile.username = user.username
        user_data.profile.streak = user.streak
        user_data.profile.role = user.role
        user_data.profile.requested_promotion = user.requested_promotion;

        user_data.isUser = await usernameMatchesID(req);
        if (user_data.isUser || await hasPrivileges(req, "ADMIN")) {
            user_data.profile.name = user.name
            user_data.profile.email = user.email;
            user_data.canSee = true;
        }

        const puzzle_result = await pool.query("SELECT COUNT(*) 'attempted', COUNT(IF(solved=true, 1, NULL)) 'solved', COUNT(IF(solved=false, 1, NULL)) 'unsolved', AVG(IF(solved=true, time_taken, NULL)) 'avg_time' FROM Account_Puzzle JOIN Account ON Account.account_id = Account_Puzzle.account_id JOIN Puzzle ON Account_Puzzle.puzzle_id = Puzzle.puzzle_id WHERE Account.username= ?", [username]);

        const stats = puzzle_result[0];

        user_data.stats.attempted = parseInt(stats.attempted);
        user_data.stats.solved = parseInt(stats.solved);
        user_data.stats.unsolved = parseInt(stats.unsolved);
        user_data.stats.avg_time = parseInt(stats.avg_time / 1000);

        const mins = Math.floor(user_data.stats.avg_time / 60);
        const secs = user_data.stats.avg_time % 60;
        user_data.stats.avg_time_str = mins + "m " + secs + "s";

        const solved_result = await pool.query("SELECT Puzzle.puzzle_id, created_by, puzzle_name, difficulty FROM Puzzle JOIN Account_Puzzle ON Account_Puzzle.puzzle_id = Puzzle.puzzle_id JOIN Account ON Account_Puzzle.account_id = Account.account_id WHERE Account.username= ? ", [username]);

        for (i = 0; i < solved_result.length; i++) {
            const puzzle = solved_result[i];
            if (puzzle.puzzle_id) {
                user_data.solved[puzzle.puzzle_id] = puzzle;
            }
        }

        const created_result = await pool.query("SELECT puzzle_id, puzzle_name, difficulty FROM Puzzle JOIN Account ON Account.account_id = Puzzle.account_id WHERE Account.username= ? ", [username]);

        if (created_result.length >= 1) {
            user_data.created = {}
            for (i = 0; i < created_result.length; i++) {
                const puzzle = created_result[i];
                user_data.created[puzzle.puzzle_id] = puzzle;
            }
        }

        if (result.length === 1) {
            res.json({
                success: true,
                data: user_data
            });
        } else {
            res.json({
                success: false,
                data: "User not found"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            error_message: "Failed to get data"
        });
    }
});

/**
 * promotes user to higher role
 */
router.post("/api/promote_user", async function (req, res) {
    try {
        if (await hasPrivileges(req, "ADMIN")) {
            const username = req.body.username;
            const result = await pool.query("SELECT account_role FROM Account WHERE username = ?", [username]);

            role = result[0]["account_role"]

            if (role > 1) {
                const promote_result = await pool.query("UPDATE Account SET account_role=?, requested_promotion=false WHERE username = ?", [(role - 1), username]);

                if (promote_result.affectedRows === 1) {
                    await logout(username);
                    res.json({
                        success: true
                    })
                } else {
                    res.json({
                        success: false,
                        error_message: "Failed to promote user"
                    })
                }
            } else {
                res.json({
                    success: false,
                    error_message: "Cannot promote user"
                })
            }
        } else {
            res.json({
                success: false,
                error_message: "Permission denied"
            });
        }
    } catch (error) {
        res.json({
            success: false,
            error_message: "Internal database error"
        });
    }
});

/**
 * demotes user to higher role
 */
router.post("/api/demote_user", async function (req, res) {
    try {
        if (await hasPrivileges(req, "ADMIN")) {
            const username = req.body.username;
            const result = await pool.query("SELECT account_role FROM Account WHERE username = ?", [username]);

            role = result[0]["account_role"]

            if (role < 3) {
                const demote_result = await pool.query("UPDATE Account SET account_role=? WHERE username = ?", [(role + 1), username]);

                if (demote_result.affectedRows === 1) {
                    await logout(username);
                    res.json({
                        success: true
                    })
                } else {
                    res.json({
                        success: false,
                        error_message: "Failed to demote user"
                    })
                }
            } else {
                res.json({
                    success: false,
                    error_message: "Cannot demote user"
                })
            }
        } else {
            res.json({
                success: false,
                error_message: "Permission denied"
            });
        }

    } catch (error) {
        res.json({
            success: false,
            error_message: "Internal database error"
        });
    }
});


router.post("/api/request_promotion", async function (req, res) {
    try {
        const username = req.body.username;
        await pool.query("UPDATE Account SET requested_promotion= true WHERE username = ?", [username]);

        res.json({
            success: true
        })

    } catch (error) {
        res.json({
            success: false,
            error_message: "Internal database error"
        });
    }
});

async function getGrantFromUsername(username) {
    const result = await pool.query(
        "SELECT Account_JWT.grant_token FROM Account_JWT INNER JOIN Account ON Account.account_id = Account_JWT.account_id WHERE Account.username =?",
        [username]
    );
    if (result.length == 1) {
        return result[0]["grant_token"];
    }
    return null;
}

function createUserJWT(user_id, target_server_id) {
    return jwt.sign(
        { user_id: user_id, server_id: target_server_id },
        TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
}

/**
 * Helper fucntion that is used to generate random strings
 * @returns A random string
 */
function createRandomString() {
    return base64.encode(crypto.randomBytes(100).toString("base64"));
}

/**
 * Gets the user's JWT. If the user has not been logged in or its token has expired, it creates a new token.
 * Otherwise it returns the current active token 
 * @param {*} user_id 
 * @param {*} target_server_id 
 * @returns The user's (jwt) token
 */
async function renewJWTIfLoggedInFromAnotherServer(user_id, target_server_id) {
    var jwt = null;
    const result = await pool.query(
        "SELECT server_in_use_id, jwt FROM Account_JWT WHERE account_id = ?",
        [user_id]
    );
    if (result.length == 1) {
        var logged_in_server_id = result[0]["server_in_use_id"];

        if (logged_in_server_id == target_server_id) {
            jwt = result[0]["jwt"];
        } else {
            const jwt_token = createUserJWT(user_id, target_server_id);
            const grant_token = createRandomString();

            try {
                await updateUserJWT(
                    user_id,
                    jwt_token,
                    grant_token,
                    target_server_id
                );

                jwt = jwt_token;
            } catch (error) {
                console.log("Got error.", error.message);
            }
        }

        if (getTokenDetails(jwt) === null) {
            const jwt_token = createUserJWT(user_id, target_server_id);
            const grant_token = createRandomString();
            await updateUserJWT(
                user_id,
                jwt_token,
                grant_token,
                target_server_id
            );
        }
    }

    return jwt;
}

async function comparePassword(password, hashed_password) {
    const result = await bcrypt.compare(password, hashed_password);
    return result;
}

/**
 * Logs a user into the system
 * @param {*} req 
 * @param {*} res 
 * @param {*} target_server_id 
 * @returns 
 */
async function login(req, res, target_server_id) {
    const username = req.body.username;
    const password = req.body.password;

    let response = {
        is_authenticated: false,
        is_logged_in: false,
    };

    try {
        const check_user_result = await pool.query(
            "SELECT * FROM Account WHERE username = ?",
            [username]
        );

        if (check_user_result.length == 1) {
            const correct_password = await comparePassword(password, check_user_result[0]["hashed_password"]);

            if (correct_password) {
                const account = check_user_result[0];
                const user_id = account.account_id;

                response.user_id = user_id;
                response.is_authenticated = true;
                response.username = username;
                response.account_role = account.account_role;
                response.server_id = account.server_id;
                response.profile_icon = account.profile_icon;
                response.email = account.email;

                const user_is_logged_in = await userIsLoggedIn(username);
                if (user_is_logged_in) {
                    response.jwt = await renewJWTIfLoggedInFromAnotherServer(user_id, target_server_id);

                    if (response.jwt != null) {
                        response.is_logged_in = true;
                    } else {
                        response.error_message = "Error: Inconsistency in database.";
                    }
                } else {
                    const jwt_token = createUserJWT(user_id, target_server_id);
                    const grant_token = createRandomString();

                    var logInResult = await logInUser(user_id, jwt_token, grant_token, target_server_id);

                    if (logInResult) {
                        response.jwt = jwt_token;

                        response.is_logged_in = true;
                    } else {
                        response.error_message = "Failed to log user in.";
                    }
                }
            } else {
                response.error_message = "Incorrect password.";
            }

        } else {
            response.error_message = "Incorrect username.";
        }
    } catch (err) {
        response.error_message = err.message;
    }

    if (response.is_logged_in) {
        res.cookie(
            "jwt_cookie",
            response.jwt,
            {
                signed: true,
            }
        );
    }

    return response;
}

router.post("/api/login", async (req, res) => {

    if (req.body.server_id == SERVER_ID) {
        const response = await login(req, res, SERVER_ID);

        res.json(response);
    } else {
        res.json({
            is_authenticated: false,
            is_logged_in: false,
        });
    }
});

/**
 * Redirects a user to an external login page of the home server
 */
router.post("/api/login_external", async (req, res) => {

    if (req.body.server_id != SERVER_ID) {
        const state = createRandomString();

        //store state parameter in cookie, set maxAge, and set signed to true
        res.cookie(
            "state_cookie",
            state,
            {
                maxAge: 1000 * 60 * 5, // 5 mins
                signed: true,
            }
        );

        const redirect_query_string = querystring.stringify({
            response_type: "code",
            redirect_uri:
                make_domain(SERVER_ID) + "/redirect/" + req.body.server_id,
            client_id: SERVER_ID,
            state: state,
        });
        // fedapi/auth/authorise?response_type=code&client_id=11&state=xyz
        const redirect_url =
            make_domain(req.body.server_id) +
            "/fedapi/auth/authorise?" +
            redirect_query_string;
        res.json({ redirect_uri: redirect_url });
    }
});

async function logout(username) {
    const response = {
        success: false,
        status: 200
    };
    try {
        await pool.query(
            "UPDATE Account SET logged_in = ? WHERE username = ?",
            [false, username]
        );

        const user_id = await getUserIDFromUsername(username);
        const remove_jwt_result = await pool.query(
            "DELETE FROM Account_JWT WHERE account_id = ?",
            [user_id]
        );

        if (remove_jwt_result.affectedRows == 1) {
            response.success = true;
        }
        return response;
    } catch (err) {
        response.status = 500;
        response.error_message = err.message;
        return response;
    }
}

router.post("/api/logout", async (req, res) => {
    const username = req.body.username;

    const response = await logout(username);

    res.cookie(
        "jwt_cookie",
        null,
        {
            signed: true,
            expires: new Date(0)
        }
    );


    res.status(response.status).json(response);
});

/**
 * Login for our users accessing another site
 */
router.post("/api/oauth/login", async (req, res) => {
    var client_id = req.body.client_id;
    if (client_id != null) {
        const login_result = await login(req, res, req.body.client_id);

        if (login_result.is_logged_in) {
            const grant_token = await getGrantFromUsername(req.body.username);

            const redirect_query_string = querystring.stringify({
                code: grant_token,
                state: req.body.state,
            });

            const redirect_uri =
                req.body.redirect_uri + "?" + redirect_query_string;

            res.json({
                success: true,
                redirect_uri: redirect_uri,
            });
        } else {
            res.json({
                success: false,
                error_message: login_result.error_messsage,
            });
        }
    } else {
        res.json({
            success: false,
            error_message: "Invalid client ID",
        });
    }
});

router.post("/api/token_is_valid", (req, res) => {
    res.json({ success: getTokenDetails(req.body.token) != null });
});

module.exports = { router, validateEmail, validatePassword, validateUsername, getTokenDetails, make_domain, createUserJWT, comparePassword, getUserIDFromUsername };
