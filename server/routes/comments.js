const express = require("express");
const router = express.Router();
const { pool } = require("../db/database.js");

router.get("/api/get_comments/:puzzle_id", async function (req, res) {
    let puzzle_id = req.params.puzzle_id;
    try {
        const result = await pool.query(
            "SELECT comment_id, Comment.account_id, time_stamp, comment, isParent, parent_id, edited, username FROM Comment LEFT JOIN Account ON Comment.account_id = Account.account_id WHERE Comment.puzzle_id = ? ORDER BY time_stamp DESC",
            [parseInt(puzzle_id)]
        );
        if (result.length >= 1) {
            res.json(result)
        } else {
            res.send([]);
        }
    } catch (error) {
        res.send(error);
    }
});

router.post("/api/submit_comment", async function (req, res) {
    let puzzle_id = req.body.puzzle_id;
    let account_id = req.body.user_id;
    let comment = req.body.comment_message;
    let isParent = req.body.comment_is_parent;
    let parent = req.body.comment_parent;
    let edited = req.body.comment_edited; try {
        await pool.query(
            "INSERT IGNORE INTO Account_Puzzle(account_id, puzzle_id) VALUES (?,?)",
            [parseInt(account_id), parseInt(puzzle_id)]
        ); let account_puzzle_id_q = await pool.query(
            "SELECT account_puzzle_id FROM Account_Puzzle WHERE account_id=? AND puzzle_id=?",
            [parseInt(account_id), parseInt(puzzle_id)]
        ); let account_puzzle_id = account_puzzle_id_q[0].account_puzzle_id; if (account_puzzle_id != NaN) {
            let returned_id = await pool.query(
                "INSERT INTO Comment(account_puzzle_id, puzzle_id, account_id, time_stamp, comment, isParent, parent_id, edited) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?) RETURNING comment_id",
                [parseInt(account_puzzle_id), parseInt(puzzle_id), parseInt(account_id), comment, isParent, parent, edited]
            );
            let return_id = returned_id[0].comment_id;
            res.json({ commentid: return_id });
        }
    }
    catch (error) {
        res.send(error);
    }
});

router.post("/api/update_comment", async function (req, res) {
    let comment = req.body.comment_message;
    let edited = req.body.comment_edited;
    let comment_id = req.body.comment_id;
    try {
        await pool.query(
            "UPDATE Comment SET edited=?, comment=?, time_stamp=NOW() WHERE comment_id=?",
            [edited, comment, comment_id]
        );
        res.json({
            success: true,
        });
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;