<template>
    <NavBar />
    <br>
    <br>
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
    <div class = "align-items-center justify-content-center row">
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">W</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">A</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">F</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">F</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">L</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">E</p>
        </div>
    </div> 
    <br />
    <br />
    <br />
    <span style = "font-family: 'BioRhyme';font-size: 60px; font-weight: bolder; color: #3a533a">Welcome to Waffle!</span>
    <br />
    <p style = "font-family: BioRhyme; color: #3a533a; font-weight: bolder">Log in to continue or register if you haven't already.</p>
    <br />
    <div class="row">
        <div class="col-4"></div>
        <div class="row col-4">
            <div class="col-6">
                <router-link to="/login">
                    <a
                        class="btn"
                        style="background-color: #e9cd85; font-family: BioRhyme; color: #3a533a; font-weight: bolder"
                        id="loginPage"
                    >
                        Login
                    </a>
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/register">
                    <a
                        class="btn"
                        style="background-color: #e9cd85; font-family: BioRhyme; color:#3a533a; font-weight: bolder "
                        id="registerPage"
                    >
                        Register
                    </a>
                </router-link>
            </div>
            <div class="col-4"></div>
        </div>
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
