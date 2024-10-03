<template>
    <div>
        <NavBar />
    <br />
    <br />
    <div class = "align-items-center justify-content-center row">
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">P</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">R</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">O</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">F</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">I</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">L</p>
        </div>
        <div class = "welcome-box animate__animated animate__bounce">
            <p class="welcome-letter animate__animated animate__bounce">E</p>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <ProfileComp :username='username' />
        </div>
    </div>
    </div>
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
import ProfileComp from "@/components/ProfileComp.vue";

export default {
    name: 'ProfilePage',
    data() {
        return {
            username: this.$route.params.username
        }
    },
    components: {
        NavBar,
        ProfileComp
    }
}
</script>