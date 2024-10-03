import { getAllPuzzlesLocal } from "@/services/PuzzleService"

export default {
    namespaced: true,
    state() {
        return {
            local_puzzles: [],
        }
    },
    mutations: {
        getPuzzlesLocal(state) {
            getAllPuzzlesLocal().then((response) => {
                state.local_puzzles = response;
            })
        }
    }
}