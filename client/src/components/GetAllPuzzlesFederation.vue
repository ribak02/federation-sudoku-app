<template>
    <div class="container">
        <div v-if="Object.keys(federation_puzzles).length === 0" class = "align-items-center justify-content-center row" style="margin-top: 10%">
            <div class = "loading-box animate__animated animate__rollIn">
                <p class="welcome-letter animate__animated animate__rollIn">L</p>
            </div>
            <div class = "loading-box animate__animated animate__rollIn">
                <p class="welcome-letter animate__animated animate__rollIn">O</p>
            </div>
            <div class = "loading-box animate__animated animate__rollIn">
                <p class="welcome-letter animate__animated animate__rollIn">A</p>
            </div>
            <div class = "loading-box animate__animated animate__rollIn">
                <p class="welcome-letter animate__animated animate__rollIn">D</p>
            </div>
            <div class = "loading-box animate__animated animate__rollIn">
                <p class="welcome-letter animate__animated animate__rollIn">I</p>
            </div>
            <div class = "loading-box animate__animated animate__rollIn">
                <p class="welcome-letter animate__animated animate__rollIn">N</p>
            </div>
            <div class = "loading-box animate__animated animate__rollIn">
                <p class="welcome-letter animate__animated animate__rollIn">G</p>
            </div>
            <div class = "loading-box animate__animated animate__rollIn">
                <p class="welcome-letter animate__animated animate__bounce">.</p>
            </div>
            <div class = "loading-box animate__animated animate__rollIn">
                <p class="welcome-letter animate__animated animate__bounce">.</p>
            </div>
            <div class = "loading-box animate__animated animate__rollIn">
                <p class="welcome-letter animate__animated animate__bounce">.</p>
            </div>
        </div>
        <div class="text" v-for="(serverPuzzles, id) in federation_puzzles" :key="id">
            <h3>Server {{ id }}</h3>
            <div class="row align-items-center align-self-center">
                <div v-for="(puzzle, puzzle_id) in serverPuzzles" :key="puzzle_id"
                    class="col-12 col-lg-3 col-md-4 col-sm-6 p-2">
                    <OnePuzzleIntroFedVue :puzzle="puzzle" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import OnePuzzleIntroFedVue from "./OnePuzzleIntroFed.vue";
import { mapState } from "vuex";
export default {
    name: "GetAllPuzzlesFederation",
    components: {
        OnePuzzleIntroFedVue,
    },
    data(){
        return{
            gotPuzzles: false
        }

    },
    computed: mapState("getAllPuzzlesFederation", {
        federation_puzzles: (state) => state.federation_puzzles,
    }),
    mounted() {
        this.$store.commit("getAllPuzzlesFederation/getPuzzlesFederation");
    },
};
</script>
<style>
    .loading-box{
        display: inline;
        background-color: #ccd5ae;
        width: 50px;
        height: 50px;
        border-radius: 8px;        
        padding: 0px;
        margin: 10px;

    }

</style>