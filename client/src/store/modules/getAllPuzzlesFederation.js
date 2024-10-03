import { getAllPuzzlesFederation } from "@/services/PuzzleService"

export default {
    namespaced: true,
    state() {
        return {
            federation_puzzles: {},
            fed_puzzle: [],
            fed_solution: []
        }
    },
    mutations: {
        getPuzzlesFederation(state) {
            getAllPuzzlesFederation().then((response) => {
                state.federation_puzzles = response;
            })
        },
        getSpecificFedPuzzle(state, { server_id, sudoku_id }) {
            let puzzles_of_server = state.federation_puzzles[server_id];
            for (let i = 0; i < puzzles_of_server.length; i++) {
                if (puzzles_of_server[i].sudoku_id == sudoku_id) {
                    state.fed_puzzle = puzzles_of_server[i].puzzle;
                    state.fed_solution = puzzles_of_server[i].solution;
                }
            }
        }
    },
}