import axios from "axios";
import Swal from "sweetalert2";

export async function getPuzzle(puzzle_id) {
    const res = await axios.get("/api/get_puzzle/" + puzzle_id);
    return res.data;
}

export async function submitPuzzle(puzzle_id, user_id, time_taken, rating){
    axios.post("/api/submit_puzzle",{
        user_id: user_id,
        puzzle_id: puzzle_id,
        time_taken: time_taken,
        account_rating: rating,
    }).then((response) => console.log(response))
        .catch((err) => console.log(err));
}

export async function postPuzzle(puzzle_type,difficulty,puzzle_grid,created_at,puzzle_name,created_by,puzzle_solution,user_id,server_id) {
    axios.post("/api/create_puzzle", {
        puzzle_type: puzzle_type,
        difficulty: difficulty,
        puzzle_grid: puzzle_grid,
        created_at: created_at,
        puzzle_name: puzzle_name,
        created_by: created_by,
        puzzle_solution: puzzle_solution,
        account_id: user_id,
        server_id: server_id,
    }).then((response) => {
        if (response.data.success) {
            Swal.fire({
                title: "Successfully created puzzle",
                confirmButtonText: 'Ok',
                confirmButtonColor: 'grey',
                icon: 'success'})
        } else {
            Swal.fire({
                title:"Error",
                text: "Puzzle name already exists",
                icon:'error',
                });
        }
    });
}

export async function postSkyscraper(puzzle_grid, puzzle_solution, puzzle_name, heights, username, user_id, difficulty) {
    axios.post("/api/create_skyscraper", {
        puzzle_type: 2,
        puzzle_name: puzzle_name,
        puzzle_grid: puzzle_grid,
        difficulty: difficulty,
        puzzle_solution: puzzle_solution,
        heights: heights,
        created_by: username,
        account_id: user_id,
        server_id: 12,
    }).then((response) => {
        if (response.data.success) {
            Swal.fire({
                title: "Successfully created puzzle",
                confirmButtonText: 'Ok',
                confirmButtonColor: 'grey',
                icon: 'success'})
        } else {
            Swal.fire({
                title:"Error",
                text: "Puzzle name already exists",
                icon:'error',
                });
        }
    });
}

export async function getAllPuzzlesLocal() {
    const puzzles = await axios.get("/api/puzzles");
    return puzzles.data;
}

export async function getAllPuzzlesFederation() {
    const puzzles = await axios.get("/fedapi/federation_puzzles");
    return puzzles.data;
}

export async function getPuzzleUsers(puzzle_id) {
    const userPuzzles = await axios.get("/api/get_puzzle_users/" + puzzle_id);
    return userPuzzles.data;
}

export async function getRatingUsers(puzzle_id) {
    const userRatings = await axios.get("/api/get_rating_users/" + puzzle_id);
    return userRatings.data;
}


export async function getUsername(account_id) {
    const username = await axios.get("/api/get_username/" + account_id);
    return username.data;
}
