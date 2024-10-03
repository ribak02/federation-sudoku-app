<template>
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
    <NavBar />
    <br />
    <WaffleComp />
    <br />
    <RegisterComp />
</template>
<script>
import RegisterComp from '../components/RegisterComp.vue'
import NavBar from "@/components/NavBar.vue";
import WaffleComp from "@/components/WaffleComp.vue";

export default {
    name: 'RegisterPage',
    components: {
        NavBar,
        RegisterComp,
        WaffleComp
    }
}
</script>