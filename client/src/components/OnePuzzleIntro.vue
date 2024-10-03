<template>
    <div class="card shadow pt-22 p-md-4 mx-auto" style="background-color: #fefae0">
        <div class="card-header border-0 p-0 d-flex align-items-center justify-content-center"
            style="background-color: #fefae0" v-if="puzzle.created_by">
            <div class="post-meta">
                <div class="media d-flex align-items-center justify-content-between">
                    <div class="post-group">
                        <a class="text btn m-0 p-0" @click="view(puzzle)">
                            <i class="bi bi-person"></i>
                            {{ puzzle.created_by }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="text card-body" style="background-color: #fefae0">
            <h3 class="text">
                {{ puzzle.puzzle_name }}
            </h3>
            <p class="text card-text mb-2">
                <ReadStars></ReadStars>
            </p>
            <span class="text card-pf-item-text">Difficulty: {{ puzzle.difficulty }}</span>
            <br>
            <span class="text card-pf-item-text" v-if = "puzzle.puzzle_type == 1" >Type: Classic</span>
            <span class="text card-pf-item-text" v-if = "puzzle.puzzle_type == 2" >Type: Skyscraper</span>

        </div>
        <div class="text card-footer pb-0 px-0" style="background-color: #fefae0">
            <div class="d-flex align-items-center justify-content-center">
                <button class="btn-puzzle-intro" @click="selectPuzzle(puzzle.puzzle_id)">
                    <span><i class="bi bi-play-fill"></i></span> Play
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import router from "@/router";
import ReadStars from "./ReadStars.vue";

export default {
    props: {
        puzzle: Object,
    },
    components: {
        ReadStars,
    },
    methods: {
        view(puzzle) {
            router.push({
                name: "Profile",
                params: { username: puzzle.created_by },
            });
        },
        selectPuzzle(puzzle_id) {
            if (this.puzzle.puzzle_type == 1){
                router.push({
                name: "PlayPuzzle",
                params: { puzzle_id: puzzle_id },
            });
            } else {
                router.push({
                name: "PlaySkyscraper",
                params: { puzzle_id: puzzle_id },
            });
            }

        },
    },
    // data() {
    //     return {
    //       rating: null,
    //       resetableRating: 5,
    //       currentRating: "No Rating",
    //       mouseOverRating: null
    //     };
    // }
};
</script>
<style>

.text{
    font-family:BioRhyme;
    font-weight: bolder;
    color: #3a533a;
}
.btn-puzzle-intro {
    background-color: #fefae0;
    border: 2px solid #4c4e43;
    border-radius: 30px;
    box-shadow: #4c4e43 4px 4px 0 0;
    color: #4c4e43;
    cursor: pointer;
    display: inline-block;
    font-weight: 600;
    font-size: 16px;
    font-family: BioRhyme;
    padding: 0px 15px;
    line-height: 50px;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
}

.btn-puzzle-intro:hover {
    transition: 100ms linear;
    transform: scale(1.05);
    color: #291203;
    border-color: #291203;
    box-shadow: #291203 4px 4px 0 0;
}

.btn-puzzle-intro:active {
    box-shadow: #CCD5AE 2px 2px 0 0;
    transform: translate(2px, 2px);
}

@media (min-width: 768px) {
    .btn-puzzle-intro {
        min-width: 80px;
        min-height: 0px;
    }
}</style>
