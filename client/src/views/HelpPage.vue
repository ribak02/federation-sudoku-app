<template>
    <NavBar />
    <br>
    <br>
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
    <div class="align-items-center justify-content-center row">
        <div class="welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">H</p>
        </div>
        <div class="welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">E</p>
        </div>
        <div class="welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">L</p>
        </div>
        <div class="welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">P</p>
        </div>
    </div>
    <br />
    <div class="container p-3">
        <span style="font-family: 'BioRhyme';font-size: 60px; font-weight: bolder; color: #3a533a">Classic Sudoku</span>
        <br />
        <div>
            <p style="font-family: BioRhyme; text-align: left;">Classic Sudoku is a logic-based number placement
                puzzle that typically consists of a 9x9 grid divided into nine 3x3 sub-grids. The goal of the game is to
                fill in
                all
                the blank cells with digits from 1 to 9, such that every row, column, and sub-grid contains all the digits
                from
                1 to
                9 without any repetition. Here are the rules:

            <ol style="font-family: BioRhyme; text-align: left;">
                <li style="font-family: BioRhyme; text-align: left;">Each row must contain all the digits from 1 to 9
                    without
                    any repetition.</li>
                <li style="font-family: BioRhyme; text-align: left;">Each column must contain all the digits from 1 to 9
                    without
                    any repetition.</li>
                <li style="font-family: BioRhyme; text-align: left;">Each of the nine 3x3 sub-grids must contain all the
                    digits
                    from 1 to 9 without any repetition.</li>
                <li style="font-family: BioRhyme; text-align: left;">Each puzzle begins with a partially completed grid,
                    where
                    some cells have already been filled with numbers.
                </li>
                <li style="font-family: BioRhyme; text-align: left;">The player's goal is to fill in the remaining cells
                    with
                    numbers that satisfy the above three rules.</li>
                <li style="font-family: BioRhyme; text-align: left;">The numbers 1 to 9 can only be used once in each row,
                    column, and sub-grid.</li>
                <li style="font-family: BioRhyme; text-align: left;">The puzzle has only one solution, which can be reached
                    through logical deduction.</li>
            </ol>
            </p>
            <p style="font-family: BioRhyme; text-align: left;">
                The puzzle format for Classic Sudoku is in JSON and is as follows:
                {title: 'Your title', type: 'classic, grid: 2D array of string numbers with space characters for
                empty cells, solution: 2D array of string numbers}
            </p>
        </div>
        <br />
        <br />
        <span style="font-family: 'BioRhyme';font-size: 60px; font-weight: bolder; color: #3a533a">Skyscraper Sudoku</span>
        <br />
        <div>
            <p style="font-family: BioRhyme; text-align: left;">Skyscraper Sudoku on a 9x9 grid is a variant of the classic
                Sudoku puzzle that adds an additional set of constraints to the game. The puzzle consists of a 9x9 grid,
                divided
                into nine 3x3 sub-grids. Here are the rules:

            <ol style="font-family: BioRhyme; text-align: left;">
                <li style="font-family: BioRhyme; text-align: left;">Each row and column must contain all the digits from 1
                    to 9
                    without any repetition.</li>
                <li style="font-family: BioRhyme; text-align: left;">Each of the nine 3x3 sub-grids must contain all the
                    digits
                    from 1 to 9 without any repetition.</li>
                <li style="font-family: BioRhyme; text-align: left;">In addition to the standard Sudoku rules, Skyscraper
                    Sudoku
                    introduces "skyscraper" clues, which are indicated by numbers outside the grid. Each number represents
                    the
                    number of visible skyscrapers in that row or column when viewed from that direction.</li>
                <li style="font-family: BioRhyme; text-align: left;">A skyscraper is "visible" if its height is greater than
                    that of any other skyscraper in the same row or column,
                    looking from left to right or top to bottom, depending on the direction indicated by the clue.
                </li>
                <li style="font-family: BioRhyme; text-align: left;">In the 9x9 grid version, there are two sets of
                    skyscraper
                    clues, one set for the rows and one set for the
                    columns.
                </li>
            </ol>
            </p>
            <p style="font-family: BioRhyme; text-align: left;">
                The puzzle format for Skyscraper Sudoku is in JSON and is as follows:
                {title: 'Your title', type: 'skyscraper', grid: 2D array of string numbers with space characters for
                empty cells, solution: 2D array of string numbers, heights: {COLS: Array of {top: number, bottom: number},
                ROWS:
                Array of {left: number, right: number} } }
            </p>
        </div>
    </div>
    <br />
    <div class="row">

    </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";

export default {
    name: "StartPage",
    components: {
        NavBar
    }
};
</script>
<style>
.welcome-text {
    font-family: BioRhyme;
    font-weight: bolder;
    color: white;
}

.welcome-box {
    display: inline;
    background-color: #E9CD85;
    width: 75px;
    height: 75px;
    border-radius: 8px;
    padding: 0px;
    margin: 10px;
    border: #f6e2ac;
    border-width: 10px;
    border-style: solid;

}


.welcome-letter {
    font-family: BioRhyme;
    font-weight: bolder;
    color: white;
    font-size: xx-large;
    padding-top: 6px;
}
</style>
