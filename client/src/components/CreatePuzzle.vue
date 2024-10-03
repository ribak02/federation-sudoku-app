<template>
    <div class="row">
        <div class="column left">
            <div v-if="puzzletype == 1" class="d-flex align-items-center justify-content-center puzzle">
                <table>
                    <tbody>
                        <tr v-for="(row, idx) in new_grid" :key="idx">
                            <td v-for="(cell, idy) in row" :key="idy" @click="deleteDigit(idx, idy)">
                                <div class="waffle_cell">
                                    <div class="original-number">
                                        {{ new_grid[idx][idy] }}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="puzzletype == 2" class="puzzle2">
                <CreateSkyscraperVue :title=this.title :import=this.import :cur_grid=new_grid :initial_grid=initial_grid />
            </div>
        </div>
        <div class="column right">
            <div class=""
                style="background-color: #ccd5ae; border-radius: 8px; margin-right: 15em; width: 25em; height: 28em">
                <form @submit.prevent="createPuzzle">
                    <div style="background-color: #ccd5ae; width: 25em; height: 5em; border-radius:8px; margin: auto;"
                        class="d-flex align-items-center justify-content-center">
                        <span style="font-family: BioRhyme; font: #3455DB; font-weight: bolder">Title: </span>
                        <input class="form-label" id="titlee" v-model="title" @input="event => text = event.target.value"
                            style="width:50%">
                    </div>
                    <br>
                    <div style="background-color:; border-radius: 8px; width: 15em; margin: auto;">
                        <span style="font-family: BioRhyme; color: #3a533a; font-weight: bolder; font-size: 25px;">Puzzle
                            Type</span><br>
                        <div>
                            <input v-model="puzzletype" type="radio" value="1" @click="refreshPuzzle()" />Classic<br />
                            <input v-model="puzzletype" type="radio" value="2" />Skyscraper<br />
                        </div>
                    </div>
                    <br>
                </form>
                <div v-if="puzzletype == 1" class="container">
                    <button class="button" @click="refreshPuzzle()" style="background-color: #e9edc9; border-radius: 8px;">
                        Randomize Grid </button>
                </div>
                <br />

                <div v-if="puzzletype == 1" class="container" style="display: flex; flex:column">
                    <input class="input form-control" style="width: 60%; margin: auto ;" type="file" id="inputFile"
                        name="inputFile" accept=".json">
                    <button class="button" @click="importPuzzle()"
                        style="background-color: #e9edc9; border-radius: 8px; margin-right:0; width: 7em;"> Import </button>
                    <br>
                </div>
                <br>
                <div v-if="puzzletype == 1" class="container pb-2">
                    <button class="button" @click="createPuzzle()" style="background-color: #e9edc9; border-radius: 8px;">
                        Create Puzzle! </button>
                </div>
                <div v-if="puzzletype == 2" class="container pb-2" style="margin-top: 6.3em;">
                    <button class="button" @click="pressGenerateHeight()"
                        style="background-color: #e9edc9; border-radius: 8px;">Create Puzzle!</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from "@/router";
import { mapState } from "vuex";
import CreateSkyscraperVue from "./CreateSkyscraper.vue";
import Swal from "sweetalert2";


export default {
    name: "CreatePuzzle",
    components: {
        CreateSkyscraperVue,
    },
    data() {
        return {
            puzzletype: 1,
            title: "Puzzle",
            import: null,
        }
    },
    computed: {
        ...mapState("createPuzzle", { new_grid: (state) => state.new_grid, initial_grid: (state) => state.initial_grid }),
    },
    methods: {
        deleteDigit(x, y) {
            this.$store.commit("createPuzzle/deleteDigit", { x: x, y: y });
        },
        pressGenerateHeight() {
            let titlee = document.getElementById("titlee").value;
                this.$store.commit('createSkyscraper/createSkyscraper', titlee);
                router.push("/home");
                // this.$emit(this.pressGenerateHeights);
        },
        createPuzzle() {
            if (this.$store.commit("createPuzzle/checkValidPuzzleReturnDifficulty") == -1) {
                Swal.fire({
                    title: "Error",
                    text: "Puzzle cannot be created",
                    icon: 'error',
                });
            } else {
                this.$store.commit("createPuzzle/create", { puzzletype: this.puzzletype, title: this.title });
            }
            router.push("/home");
        },
        refreshPuzzle() {
            window.location.reload();
        },
        importPuzzle() {
            const files = document.getElementById('inputFile').files;
            if (files.length <= 0) {
                return false;
            }
            const fr = new FileReader();

            fr.onload = e => {
                const result = JSON.parse(e.target.result);
                this.import = result;
                if (this.import.type == "classic") {
                    this.$store.commit("createPuzzle/generateGridFromImported", this.import);
                    this.title = this.import.title;
                } else {
                    this.puzzletype = 2;
                    this.title = this.import.title;
                }
            }

            fr.readAsText(files.item(0));
        },

    },
    mounted() {
        this.$store.commit("createPuzzle/generateGrid");
    },
};
</script>
<style src="@vueform/toggle/themes/default.css"></style>
<style scoped>
.submit-button {
    max-width: 810px;
    height: 50px;
    background-color: #ccd5ae;
    font-weight: bold;
    color: #3a533a;
    text-align: center;
    border: none;
    border-radius: 8px;
    font-family: BioRhyme;
    font-weight: bolder;
}

.puzzle {
    transform: scale(0.7);
    transform-origin: top;
    margin-left: 25em;
}

.puzzle2 {
    transform: scale(0.7);
    transform-origin: top;
    margin-left: 25em;
}

.left {
    width: 60%;
}

.right {
    width: 40%;
}

.button {
    background-color: #E9EDC9;
    border: none;
    border-radius: 8px;
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
    width: 60%;
    color: #3a533a;
}

.button:hover {
    transition: 100ms linear;
    transform: scale(1.1);
    color: #3a533a;
    border-color: #3a533a;
    box-shadow: #3a533a 4px 4px 0 0;
}

.waffle_cell {
    margin: 5px;
    background-color: #E9CD85;
    text-align: center;
    height: 90px;
    width: 90px;
    max-width: 90px;
    max-height: 90px;
    min-width: 90px;
    min-height: 90px;
    border-radius: 15px;
}

.original-number {
    font-size: xx-large;
    font-weight: bolder;
    color: #3a533a;
    text-align: center;
    padding: 24px;
    font-family: BioRhyme;

}

table {
    border-collapse: collapse;
    border: 10px solid;
    margin: 5px;
    border-color: #c7af71;
    background-color: #f6e2ac;
    height: 830px;
    width: 830px;
    max-width: 830px;
    max-height: 830px;
    min-width: 830px;
    min-height: 830px;
}

td {
    border-color: #f6e2ac;
    text-align: center;
    padding: 0px;
    height: 100px;
    width: 100px;
}

table tbody tr td:nth-child(3),
table tbody tr td:nth-child(6),
table tbody tr td:nth-child(9) {
    border-right: 10px solid;
    border-color: #c7af71;
}

table tbody tr:nth-child(3),
table tbody tr:nth-child(6),
table tbody tr:nth-child(9) {
    border-bottom: 10px solid;
    border-color: #c7af71;
}


td {
    cursor: pointer;
    font-weight: bolder;
}
</style> 