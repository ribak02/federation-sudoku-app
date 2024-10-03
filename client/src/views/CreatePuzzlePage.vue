<template>
    <NavBar />
    <br>
    <br>
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
    <div class = "align-items-center justify-content-center row">
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">C</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">R</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">E</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">A</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">T</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">E</p>
        </div>
    </div> 
    <br>
    <CreatePuzzle/>
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
</template>
<script>
import CreatePuzzle from '@/components/CreatePuzzle.vue'
import NavBar from "@/components/NavBar.vue";

export default {
    name : 'CreatePuzzlePage',
    components: {
        NavBar,
        CreatePuzzle
    }
}
</script>
<style>
    .welcome-text{
        font-family:BioRhyme;
        font-weight: bolder;
        color: white;
    }

    .welcome-box{
        display: inline;
        background-color: #E9CD85;
        width: 75px;
        height: 75px;
        border-radius: 8px;        
        padding: 0px;
        margin: 10px;
        border:#f6e2ac ;
        border-width: 10px;
        border-style: solid;

    }


    .welcome-letter{
        font-family:BioRhyme;
        font-weight: bolder;
        color: white;
        font-size: xx-large;
        padding-top: 6px;
    }
</style>