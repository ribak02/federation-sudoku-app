<template>
    <div class="card shadow pt-22 p-md-4 mx-auto"
    style="background-color: #fefae0">
        <div
            class="card-header border-0 p-0 d-flex align-items-center justify-content-center"
            style="background-color: #fefae0"
        >
            <div class="post-meta">
                <div
                    class="media d-flex align-items-center justify-content-between"
                >
                    <div class="post-group">
                        <i class="bi bi-person"></i>
                        {{ puzzle.author_id ? puzzle.author_id : puzzle.created_by }}
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <h3 class="h4">
                {{ puzzle.sudoku_id }}
            </h3>
            <span class="card-pf-item-text"
                >Difficulty: {{ puzzle.difficulty }}</span
            >
        </div>
        <div class="card-footer  pb-0 px-0"
        style="background-color: #fefae0">
            <div class="d-flex align-items-center justify-content-center">
                <button
                    class="btn-puzzle-intro"
                    @click="selectPuzzle(puzzle)"
                >
                    <span><i class="bi bi-play-fill"></i></span> Play
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import router from "@/router";
export default {
    props: {
        puzzle: Object,
    },
    methods: {
        selectPuzzle(puzzle) {
            router.push({
                name: "PlayPuzzleFed",
                params: {
                    serverid: puzzle.group,
                    sudokuid: puzzle.sudoku_id,
                }
            });
        },
    },
};
</script>
