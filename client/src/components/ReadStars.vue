<template>

<div class="center" style="justify-content: center; align-items: center; display: flex;">

    <star-rating v-if="rated" id="ratte" :rating="rating" :increment="0.01" :read-only="true" :show-rating="false"  :animate="false" :star-size="35"></star-rating>

    <p v-else>No ratings</p>

</div>
</template>

<script>
// import { store } from '@/store';
import StarRating from 'vue-star-rating'
import { getRatingUsers } from '@/services/PuzzleService'

export default {
    components: {
        StarRating,
    },
    data() {
        return {
            rating: 0,
            rated: false
        }
    },
    mounted() {
        let puzzle_id = this.$parent.$props.puzzle.puzzle_id;
        getRatingUsers(puzzle_id).then((res) => {
            if(res.success) {
                this.rated = true;
                let total = 0;
                for (let i = 0; i < res.data.length; i++) {
                    let rating = res.data[i].account_rating;
                    total += parseFloat(rating);
                }
                let averageRating = total/res.data.length;
                this.rating = averageRating;
            }
        })
    }
};
</script>