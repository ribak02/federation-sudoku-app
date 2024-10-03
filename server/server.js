const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config({ path: __dirname + '/../.env' });
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/dist/")));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    cors({
        credentials: true,
        origin: [
            `http://127.0.0.1:${process.env.PORT}`,
            "http://127.0.0.1:8080",
            "https://cs3099user12.host.cs.st-andrews.ac.uk",
        ],
        exposedHeaders: ['set-cookie']
    })
);

const { pool } = require("./db/database");

app.all("/", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
//  Session setup
app.use(session({
    secret: process.env.COOKIE_SECRET,
    cookie: {
        secure: true
    },
    saveUninitialized: false,
    resave: false,
    unset: 'destroy'
}));

app.use(require("./routes/fedapi.js"));
app.use(require("./routes/user.js").router);
app.use(require("./routes/puzzle.js"));
app.use(require("./routes/comments.js"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.get("/test", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Account");
        res.json(result);
    } catch (error) {
        res.json({
            status: false,
            error_message: " Database error:" + error,
        });
    }
});

app.get("/api/account", function (req, res) {
    res.send("Account");
});

app.all("/api/*", function (req, res) {
    res.status(404).send("404: Page not found.");
});

app.all("/fedapi/*", function (req, res) {
    res.status(404).send("404: Page not found.");
});

app.all("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(process.env.PORT, function () {
    console.log("Server is running on port: " + process.env.PORT);
});
