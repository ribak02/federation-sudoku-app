<template>
    <div id="app">
        <router-view :key="$route.fullPath" />
    </div>
</template>

<script>

export default {
    name: "App",
    components: {
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #e9edc9;

}
</style>
