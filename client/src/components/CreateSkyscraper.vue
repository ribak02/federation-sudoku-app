<template>
    <div class="wholegrid" style="margin-top: -2em;">
        <table style="margin-left: -5.6em;">
            <tbody>
                <td class = "heights-number m-10" v-for="(col_h, i) in heights.COLS" :key="i">{{ col_h['top'] }}</td>
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
                        <tr class="gridrow" v-for="(row,idx) in skyscraper_grid" :key="idx">
                            <td class="tablegrid" v-for="(cell,idy) in row" :key="idy"
                            :class="{ selected:skyscraper_grid[idx][idy].selected, error:skyscraper_grid[idx][idy].error }" @click=" setSelected(idx,idy)">
                                <div class = "waffle-cell">
                                    <div class = "original-number">
                                        {{skyscraper_grid[idx][idy].value}}
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
        <table style="width: 830px; margin-left: -5.6em;">
            <tbody>
                <td class = "heights-number" v-for="(col_h, i) in heights.COLS" :key="i">{{ col_h['bottom'] }}</td>
            </tbody>
        </table>
        <!-- <button class = "submit-button" v-if="all_digits_added" @click="pressGenerateHeights()">Create Puzzle!</button> -->
            
    </div>
    <div class="container pb-2">
    <button class="button" @click="pressGenerateHeights()"
                        style="background-color: #e9edc9; border-radius: 8px; margin-left: 63em; margin-top: -100em;">Create Puzzle!</button>
                </div>
</template>

<script>
    import router from '@/router';
import { mapState } from 'vuex';

    export default {
        name: 'CreateSkyscraper',
        props: {
            title: String,
            import: Object,
            cur_grid: Object,
            initial_grid: Object,
        },
        computed: {
            ...mapState('createSkyscraper',{skyscraper_grid: state=>state.grid, all_digits_added: state=>state.finished, heights: state=>state.heights, starting_from_import: state=>state.starting_from_import}),
        },
        methods: {
            setSelected(x,y) {
                //whenever something changes in the grid, we update our puzzle array
                this.$store.commit('createSkyscraper/deleteDigit',{x:x,y:y});
            },
            pressGenerateHeights() {
                this.$store.commit('createSkyscraper/createSkyscraper', this.title);
                router.push("/home");
            },
        },
        mounted() {
            if (this.import == null){
                this.$store.commit('createSkyscraper/generateGridForSkyscraper', {cur_grid: this.cur_grid, initial_grid: this.initial_grid});
            } else {
                this.$store.commit('createSkyscraper/generateGridFromImport', this.import);
            }
        },
    }
</script>

<style scoped>

.submit-button{
    max-width:810px;
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
    padding: 20px;
    font-family: BioRhyme;
}

.textright {
    text-align: right;
}

.textleft {
    text-align: left;
}

table {
    max-width: 930px;
    max-height: 930px;
    min-width: 930px;
    max-height: 930px;
    margin: 0 auto;
}

table.grid {
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


.waffle-cell {
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


td {
    text-align: center;
    padding: 0px;
    height: 100px;
    width: 100px;
   
}

td.tablegrid {
    background-color: #f6e2ac;
}

table tbody tr td:nth-child(3), table tbody tr td:nth-child(6),table tbody tr td:nth-child(9) {
    border-right: 10px solid;
    border-color: #c7af71;
}

table tbody tr:nth-child(3), table tbody tr:nth-child(6), table tbody tr:nth-child(9) {
    border-bottom: 10px solid;
    border-color: #c7af71;
}

td.selected {
    background-color:#3455DB;
}

td.error {
    background-color: #e67065;
}

</style> 