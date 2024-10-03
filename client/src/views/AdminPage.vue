<template>
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
    <NavBar />
    <br />
    <div class = "align-items-center justify-content-center row">
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">A</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">D</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">M</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">I</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">N</p>
        </div>
    </div>
    <br>
    <div class="container">
        <UsersTableComp :only_pending="true" />
    </div>
    <br />
    <br />
    <div class="container">
        <UsersTableComp :only_pending="false" />
    </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
import UsersTableComp from "@/components/UsersTableComp.vue";

export default {
    name: 'HomePage',
    components: {
        NavBar,
        UsersTableComp
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