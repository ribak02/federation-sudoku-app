<template>
    <NavBar />
    <WaffleComp />
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
    <br />
    <br />
    <br />
    <h3 style = "font-family: BioRhyme; color: #3a533a; font-weight: bolder">Whoops</h3>
    <br />
    <p style = "font-family: BioRhyme; color: #3a533a; font-weight: bolder">Unfortunately this page does not exist. Click below to go back to the home page!</p>
    <br />
    <div class="row">
        <div class="col-4"></div>
        <div class="col-4">
            <router-link to="/login">
                <a class="btn" style="background-color: #e9cd85; font-family: BioRhyme; color: #3a533a; font-weight: bolder" id="homePage">
                    Home
                </a>
            </router-link>
        </div>
        <div class="col-4"></div>
    </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
import WaffleComp from "@/components/WaffleComp.vue"

export default {
    name: "NotFoundPage",
    components: {
        NavBar,
        WaffleComp
    }
};
</script>
