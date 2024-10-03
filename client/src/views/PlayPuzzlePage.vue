<template>
    <NavBar/>
    <h1>Play Puzzle</h1>
    <RenderPuzzle />
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
</template>
<script>
import RenderPuzzle from '@/components/RenderPuzzle.vue'
import NavBar from "@/components/NavBar.vue";

export default {
    name : 'PlayPuzzlePage',
    components: {
        NavBar,
        RenderPuzzle
    }
}
</script>