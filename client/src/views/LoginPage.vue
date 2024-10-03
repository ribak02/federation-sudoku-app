<template>
    <NavBar />
    <br />
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
    <WaffleComp />
    <h1 style = "font-family: BioRhyme; color: #3a533a; font-weight: bolder">Login</h1>
    <LoginComp />
</template>
<script>
import LoginComp from "@/components/LoginComp.vue";
import NavBar from "@/components/NavBar.vue";
import WaffleComp from "@/components/WaffleComp.vue";

export default {
    name: "LoginPage",
    components: {
        NavBar,
        LoginComp,
        WaffleComp,
    }
};
</script>
