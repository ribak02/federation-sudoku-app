<template>
    <NavBar />
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
    <img src="../assets/title.png" width="492" height="96" class="d-inline-block align-top pt-3" alt="" />
    <br />
    <br />
    <br />
    <h3>Forbidden!</h3>
    <br />
    <p>You do not have permission to view this page &#128533;. Click below to go back to the home page</p>
    <br />
    <div class="row">
        <div class="col-4"></div>
        <div class="col-4">
            <router-link to="/login">
                <a class="btn" style="background-color: #e9cd85" id="homePage">
                    Home
                </a>
            </router-link>
        </div>
        <div class="col-4"></div>
    </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";

export default {
    name: "ForbiddenPage",
    components: {
        NavBar
    }
};
</script>
