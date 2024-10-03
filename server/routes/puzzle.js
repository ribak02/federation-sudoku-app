const { time } = require("console");
const express = require("express");
const router = express.Router();
const { pool } = require("../db/database.js");


/**
 * adds puzzle to puzzle database
 */
router.post("/api/create_puzzle", async function (req, res) {
    let puzzle_type = req.body.puzzle_type;
    let difficulty = req.body.difficulty;
    let puzzle_grid = JSON.stringify(req.body.puzzle_grid);
    let puzzle_name = req.body.puzzle_name;
    let created_by = req.body.created_by;
    let puzzle_solution = JSON.stringify(req.body.puzzle_solution);
    let account_id = req.body.account_id;
    let server_id = req.body.server_id;

    try {
        await pool.query(
            "INSERT INTO Puzzle(puzzle_type, difficulty, puzzle_grid, created_at, puzzle_name, created_by, puzzle_solution,account_id,server_id) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)",
            [
                puzzle_type,
                difficulty,
                puzzle_grid,
                new Date().toISOString().
                    replace(/T/, ' ').
                    replace(/\..+/, ''),// Gets datetime in YYYY-MM-DD hh:mm:ss format
                puzzle_name,
                created_by,
                puzzle_solution,
                account_id,
                server_id,
            ]
        );

        res.json({
            success: true,
        });
    } catch (error) {
        res.json({
            success: false,
            error_message: error
        });
    }
});

router.post("/api/create_skyscraper", async function (req, res) {

    let puzzle_type = req.body.puzzle_type;
    let puzzle_grid = JSON.stringify(req.body.puzzle_grid);
    let difficulty = req.body.difficulty;
    let puzzle_name = req.body.puzzle_name;
    let created_by = req.body.created_by;
    let puzzle_solution = JSON.stringify(req.body.puzzle_solution);
    let account_id = req.body.account_id;
    let heights = JSON.stringify(req.body.heights);

    try {
        const result = await pool.query(
            "INSERT INTO Puzzle(puzzle_type, difficulty, created_at, puzzle_grid, puzzle_name, created_by, puzzle_solution,account_id,server_id, heights) VALUES (?, ?, NOW(), ?, ?, ?, ?,?,?,?)",
            [
                puzzle_type,
                difficulty,
                puzzle_grid,
                puzzle_name,
                created_by,
                puzzle_solution,
                account_id,
                12,
                heights,
            ]
        );

        res.json({
            success: true,
        });
    } catch (error) {
        res.send(error)
    }
});


/**
 * gets all puzzles in puzzle database
 */
router.get("/api/puzzles", async function (req, res) {
    try {
        const result = await pool.query("SELECT * FROM Puzzle");
        res.json(result);
    } catch (error) {
        res.send(error);
    }
});

/**
 * gets ONE puzzle based on puzzle id
 * parameters: puzzle_id
 */
router.get("/api/get_puzzle/:puzzle_id", async function (req, res) {
    let puzzle_id = req.params.puzzle_id;
    try {
        const result = await pool.query(
            "SELECT * FROM Puzzle WHERE puzzle_id = ?",
            [puzzle_id]
        );
        if (result.length == 1) {
            res.send(result[0]);
        } else {
            res.send("Puzzle does not exist");
        }
    } catch (error) {
        res.send(error);
    }
});

router.post("/api/submit_puzzle", async function (req, res) {
    let puzzle_id = req.body.puzzle_id;
    let account_id = req.body.user_id;
    let time_taken = req.body.time_taken;
    let account_rating = req.body.account_rating;

    time_taken = time_taken.replace(/\s/g, "");
    let ms = parseInt(time_taken.substring(9, 12));
    let s = parseInt(time_taken.substring(6, 8));
    let m = parseInt(time_taken.substring(3, 5));
    let h = parseInt(time_taken.substring(0, 2));
    let t = ms + (s * 1000) + (m * 60000) + (h * 3600000);

    try {
        const puzzle_submit_result = await pool.query(
            "INSERT INTO Account_Puzzle(account_id, puzzle_id, account_rating, time_taken, solved) VALUES (?, ?, ?, ?, 1)",
            [account_id, puzzle_id, account_rating, t]
        );
        res.json({
            success: true,
        });
    }
    catch (error) {
        if (error.code == "ER_DUP_ENTRY") {
            console.log('Already solved puzzle');
        }
        else {
            console.log(error)
        }
        res.send(error.code);
    }
});

module.exports = router;
