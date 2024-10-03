<template>
    <div class="center" style="justify-content: center; align-items: center; display: flex;">
        <star-rating id="ratte" @update:rating ="getRating" :rating="0" :increment="0.01" :read-only="false" :show-rating="false"  :animate="false" :star-size="35"></star-rating>
    </div>
</template>

<script>
// import { store } from '@/store';
import StarRating from 'vue-star-rating'
const store = require('../store/modules/playPuzzle').default

export default {
    components: {
        StarRating,
    },
    methods: {
        getRating(rating) {
            store.state.puzzle_rating = rating;
        },
    },
};
</script>
