<template>
    <div class="container">
        <h2 class = "text">Local Puzzles</h2>
        <br>
        <div class="row align-items-center align-self-center">
            <div
                v-for="(puzzle, id) in local_puzzles"
                :key="id"
                class="col-12 col-lg-3 col-md-4 col-sm-6 p-2"
            >
                <OnePuzzleIntroVue :puzzle="puzzle" />
            </div>
        </div>
    </div>
</template>

<script>
import OnePuzzleIntroVue from "./OnePuzzleIntro.vue";
import { mapState } from "vuex";
export default {
    name: "GetAllPuzzlesLocal",
    components: {
        OnePuzzleIntroVue,
    },
    computed: mapState("getAllPuzzlesLocal", {
        local_puzzles: (state) => state.local_puzzles,
    }),
    mounted() {
        this.$store.commit("getAllPuzzlesLocal/getPuzzlesLocal");
    },
};
</script>
<style>
    .text{
        font-family:BioRhyme;
        font-weight: bolder;
        color: #3a533a;
    }
</style>
