<template>
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
    <NavBar />
    <br />
    <div class = "align-items-center justify-content-center row">
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">W</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">E</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">L</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">C</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">O</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">M</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">E</p>
        </div>
    </div> 
    <div class = "align-items-center justify-content-center row">
        <h1 class="welcome-text">{{ this.$store.getters.getUser }}!</h1>
    </div>   
    <br>
    <br>
    <div id="localpuzzles">
        <GetAllPuzzlesLocal />
    </div>
</template>
<script>
import GetAllPuzzlesLocal from '@/components/GetAllPuzzlesLocal.vue';
import NavBar from "@/components/NavBar.vue";
import 'animate.css';

export default {
    name: 'HomePage',
    components: {
    NavBar,
    GetAllPuzzlesLocal,
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