<template>
    <NavBar />
    <br>
    <h1 style = "font-family: BioRhyme; color: #3a533a; font-weight: bolder">External Login Page</h1>
    <OAuthLoginComp />
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
</template>
<script>
import OAuthLoginComp from "@/components/OAuthLoginComp.vue";
import NavBar from "@/components/NavBar.vue";

export default {
    name: "LoginPage",
    components: {
        NavBar,
        OAuthLoginComp,
    },
};
</script>
