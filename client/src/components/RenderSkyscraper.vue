<template>
    <NavBar />
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
    <div class="row">
        <div class="column left">
            <AddComment :isParent="1" :parentid="null" />
            <SeeComments />
            <div style="visibility:hidden">
                <StarRatings id="stars" style="padding: 31%; padding-top: 0px; padding-bottom: 0px;">
                </StarRatings>
            </div>
        </div>
        <div class="column middle">
            <br>
            <div class="align-items-center justify-content-center row puzzle">
                <div class=" wholegrid align-items-center justify-content-center row">
                    <table>
                        <tbody>
                            <td class="heights-number m-10" v-for="(col_h, i) in heights.COLS" :key="i">{{ col_h['top'] }}
                            </td>
                        </tbody>
                    </table>
                    <div class="together">
                        <div>
                            <p class="heights-number" v-for="(row_h, i) in heights.ROWS" :key="i">
                                {{ row_h['left'] }}
                            </p>
                        </div>
                        <div>
                            <table class="grid">
                                <tbody>
                                    <tr class="gridrow" v-for="(row, idx) in grid" :key="idx">
                                        <td class="tablegrid m-0 p-0" v-for="(cell, idy) in row" :key="idy"
                                            :class="{ locked: grid[idx][idy].original, selected: grid[idx][idy].selected, error: grid[idx][idy].error }"
                                            @click="setSelected(idx, idy)">
                                            <div class="waffle_cell">
                                                <div class="original-number" v-if="grid[idx][idy].original">
                                                    {{ grid[idx][idy].value }}
                                                </div>
                                                <div class="input-number vertical-center"
                                                    v-if="!grid[idx][idy].original && (grid[idx][idy].value != ' ' || grid[idx][idy].value != '')">
                                                    {{ grid[idx][idy].value }}
                                                </div>


                                                <div class="pencilMarks m-0"
                                                    v-if="pencilMarksActive && !grid[idx][idy].original && (grid[idx][idy].value == ' ' || grid[idx][idy].value == '')">
                                                    <div class="m-0" v-if="grid[idx][idy].pencilMarks.has(1)"
                                                        v-on:click=grid[idx][idy].pencilMarks.delete(1)>1</div>
                                                    <div class="m-0" v-if="grid[idx][idy].pencilMarks.has(2)"
                                                        v-on:click=grid[idx][idy].pencilMarks.delete(2)>2</div>
                                                    <div class="m-0" v-if="grid[idx][idy].pencilMarks.has(3)"
                                                        v-on:click=grid[idx][idy].pencilMarks.delete(3)>3</div>
                                                    <div class="m-0" v-if="grid[idx][idy].pencilMarks.has(4)"
                                                        v-on:click=grid[idx][idy].pencilMarks.delete(4)>4</div>
                                                    <div class="m-0" v-if="grid[idx][idy].pencilMarks.has(5)"
                                                        v-on:click=grid[idx][idy].pencilMarks.delete(5)>5</div>
                                                    <div class="m-0" v-if="grid[idx][idy].pencilMarks.has(6)"
                                                        v-on:click=grid[idx][idy].pencilMarks.delete(6)>6</div>
                                                    <div class="m-0" v-if="grid[idx][idy].pencilMarks.has(7)"
                                                        v-on:click=grid[idx][idy].pencilMarks.delete(7)>7</div>
                                                    <div class="m-0" v-if="grid[idx][idy].pencilMarks.has(8)"
                                                        v-on:click=grid[idx][idy].pencilMarks.delete(8)>8</div>
                                                    <div class="m-0" v-if="grid[idx][idy].pencilMarks.has(9)"
                                                        v-on:click=grid[idx][idy].pencilMarks.delete(9)>9</div>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <p class="heights-number" v-for="(row_h, i) in heights.ROWS" :key="i">
                                {{ row_h['right'] }}
                            </p>
                        </div>
                    </div>
                    <table style="width: 45em">
                        <tbody>
                            <td class="heights-number" v-for="(col_h, i) in heights.COLS" :key="i">{{ col_h['bottom'] }}
                            </td>
                        </tbody>
                    </table>
                </div>
                <div class="align-items-center justify-content-center row">
                    <button class="submit-button" @click="checkAndSubmit()">Submit</button>
                </div>

            </div>
        </div>
        <div class="right">
            <div class="align-items-left justify-content-left row">
                <div class="stopwatch-box  ">
                    <div class="centered-element" style="margin-left: 1.3em;">
                        <StopwatchComp />
                    </div>
                </div>
            </div>
            <div class="row card-body controls rounded">
                <div class="button-block col-3">
                    <span><i class="bi bi-pencil-fill space"></i></span>
                    <Label class="space">Pencil</Label>
                    <Toggle v-model="pencilMarksActive"></Toggle>
                </div>
                <div class="button-block col-3">
                    <span><i class="bi bi-x-square-fill space"></i></span>
                    <Label class="space">
                        Checker
                    </Label>
                    <Toggle v-model="autocorrectActive" @change=toggleAutocheck()></Toggle>
                </div>
                <div class="col-3">
                    <span class="save">
                        <a @click="reset()" class="btn save-button">
                            <i class="bi bi-eraser-fill space"></i>Reset Puzzle
                        </a>
                    </span>
                </div>
                <div class="col-3">
                    <span class="save">
                        <a @click="savePuzzle()" class="btn save-button">
                            <i class="bi bi-arrow-down-square-fill space"></i>Save Puzzle
                        </a>
                    </span>
                </div>
            </div>
            <LeaderboardComp class="align-items-left justify-content-left row leaderboard"/>
        </div>
    </div>
    
    <div style="visibility:hidden">
        <StarRatings id="stars" style="padding: 31%; padding-top: 0px; padding-bottom: 0px;">
        </StarRatings>
    </div>
</template>


<script>
import { mapState } from 'vuex';
import Toggle from '@vueform/toggle';
import NavBar from "@/components/NavBar.vue";
import StopwatchComp from './StopwatchComp.vue';
import LeaderboardComp from './LeaderboardComp.vue';
import SeeComments from './SeeComments.vue';
import AddComment from './AddComment.vue';
import 'animate.css';
import StarRatings from './StarRatings.vue';

const saveFile = require("easy-file-saver");

export default {
    name: 'RenderPuzzle',
    components: {
        NavBar,
        StopwatchComp,
        LeaderboardComp,
        Toggle,
        SeeComments,
        AddComment,
        StarRatings,
    },
    props: ['puzzle_id'],
    data() {
        return {
            autocorrectActive: false,
            pencilMarksActive: false,
        }
    },
    computed: {
        ...mapState('playPuzzle', { grid: state => state.grid, heights: state => state.heights }),
        ...mapState('Authentication', { username: state => state.user })
    },
    methods: {
        setSelected(x, y) {
            //whenever something changes in the grid, we update our puzzle array
            this.$store.commit('playPuzzle/setSelectedSkyscraper', { x, y });
        },
        typeNumber(e) {
            let typed = parseInt(String.fromCharCode(e.keyCode), 10);
            if (!typed) return;
            if (this.pencilMarksActive) {
                this.$store.commit('playPuzzle/setPencilMarks', { x: typed, pencilMarksActive: this.pencilMarksActive });
            }
            else {
                this.$store.commit('playPuzzle/setDigit', { x: typed, autocorrectActive: this.autocorrectActive });
            }
        },
        keypress(e) {
            if (e.which == 8) {
                if (this.pencilMarksActive) {
                    this.$store.commit('playPuzzle/setPencilMarks', { x: 0, pencilMarksActive: this.pencilMarksActive })
                }
                else {
                    this.$store.commit('playPuzzle/setDigit', { x: 0, autocorrectActive: this.autocorrectActive });
                }

            }
        },
        toggleAutocheck() {
            this.$store.commit('playPuzzle/toggledAutocorrect', this.autocorrectActive);
        },
        checkAndSubmit() {
            document.getElementById("box").style.display = "none";

            this.$store.commit('playPuzzle/checkAndSubmit', this.puzzle_id);
        },
        reset() {
            for (const row_num in this.grid) {
                for (const cell_num in this.grid[row_num]) {
                    if (!this.grid[row_num][cell_num].original) {
                        this.grid[row_num][cell_num].value = ' ';
                        this.grid[row_num][cell_num].pencilMarks = new Set();
                        this.grid[row_num][cell_num].error = false;
                    }
                }
            }
        },
        savePuzzle() {
            var puzzle = []
            var solution = []

            for (const row_num in this.grid) {
                var puzzle_row = []
                var solution_row = []
                for (const cell_num in this.grid[row_num]) {
                    puzzle_row.push(this.grid[row_num][cell_num].value.toString());
                    solution_row.push(this.grid[row_num][cell_num].solution.toString());
                }
                puzzle.push([...puzzle_row]);
                solution.push([...solution_row]);
            }

            var data = {
                type: "skyscraper",
                title: "Puzzle - imported",
                grid: puzzle,
                solution: solution,
                heights: this.heights,
            }

            saveFile({ data: data, debug: false, filename: "puzzle.json" });
        }
    },
    mounted() {
        this.$store.commit('playPuzzle/newReset');
        this.$store.commit('playPuzzle/initGridSkyscraper', this.puzzle_id);
        window.addEventListener('keypress', this.typeNumber);
        window.addEventListener('keydown', this.keypress);
    },
    unmounted() {
        window.removeEventListener('keypress', this.typeNumber);
    }
}

</script>
<style src="@vueform/toggle/themes/default.css"></style>
<style scoped>
.left {
    width: 30%;
    padding-top: 2em;
    padding-left: 5em;

}

.middle {
    width: 40%;

}

.right {
    width: 30%;
    padding-top: 2em;
    left: 0;
    padding-right: 5em;
}

.puzzle {
    transform: scale(0.7);
    transform-origin: top;
}

.together {
    display: flex;
    flex: row;
    margin: auto;
    justify-content: center;
}

.wholegrid {
    margin: auto;
    width: 100%;

}

.heights-number {
    font-size: xx-large;
    font-weight: bolder;
    color: #3455DB;
    text-align: center;
    padding: 0.45em;
    font-family: BioRhyme;
}

table {
    max-width: 50em;
    max-height: 50em;
    min-width: 50em;
    max-height: 50em;
    margin: 0 auto;
}

.leaderboard {
    margin-top: 1em;
    padding-top: 1em;
}


.stopwatch-box {
    background-color: #ccd5ae;
    width: 94.5%;
    height: 70px;
    margin: 0;
    position: relative;
    border-radius: 8px;
}

.centered-element {
    margin: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.vertical-center {
    margin: 0;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
}

.submit-button {
    max-width: 45em;
    height: 3em;
    background-color: #ccd5ae;
    font-weight: bold;
    color: #3a533a;
    text-align: center;
    border: none;
    border-radius: 0.8em;
    font-family: BioRhyme;
    font-weight: bolder;
}


table.grid {
    border-collapse: collapse;
    border: 10px solid;
    margin: 5px;
    border-color: #c7af71;
    background-color: #f6e2ac;
    height: 45em;
    width: 45em;
    max-width: 45em;
    max-height: 45em;
    min-width: 45em;
    min-height: 45em;
}

.waffle_cell {
    margin: 0.25em;
    background-color: #E9CD85;
    text-align: center;
    height: 5em;
    width: 5em;
    max-width: 5em;
    max-height: 5em;
    min-width: 5em;
    min-height: 5em;
    border-radius: 1em;
}

.controls {
    width: 100%;
    padding-top: 2%;
    margin-top: 1em;
    padding-bottom: 2%;
    background-color: #ccd5ae;
    color: #3a533a;
    justify-content: center;
    font-family: BioRhyme;
    font-weight: bolder;
}

.save-button {
    color: #3a533a;
    font-weight: bold;
    min-width: 100%
}

.original-number {
    font-size: xx-large;
    font-weight: bolder;
    color: #3a533a;
    text-align: center;
    padding: 0.5em;
    font-family: BioRhyme;

}

.input-number {
    font-size: xx-large;
    color: #3455DB;
    font-weight: bolder;
    text-align: center;
    padding: 0px;
    position: relative;
    font-family: BioRhyme;

}

.table_div {
    height: 50em;
    width: 50em;
}

.pencilMarks {
    color: #3455DB;
    font-weight: bold;
    display: grid;
    grid-template-columns: repeat(3, 1.6666666666em);
    grid-template-rows: repeat(3, 1.6666666666em);
    font-family: BioRhyme;
}

.button-block {
    vertical-align: middle;
    justify-items: center;
    justify-content: center;
    padding-top: 0.3em;
    font-weight: bold;
}

.space {
    margin-right: 3%;
}


td {
    border-color: #f6e2ac;
    text-align: center;
    padding: 0px;
}

table tbody tr td:nth-child(3),
table tbody tr td:nth-child(6),
table tbody tr td:nth-child(9) {
    border-right: 0.5em solid;
    border-color: #c7af71;
}

table tbody tr:nth-child(3),
table tbody tr:nth-child(6),
table tbody tr:nth-child(9) {
    border-bottom: 0.5em solid;
    border-color: #c7af71;
}

td.locked {
    cursor: not-allowed;
}

td {
    cursor: pointer;
    font-weight: bolder;
}

td.selected {
    background-color: #3455DB;
}

td.error {
    background-color: #e67065;
}

td.original {
    font-weight: bolder;
}
</style> 

