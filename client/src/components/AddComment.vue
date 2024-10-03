<template>
    <div class="add_comment_form">
        <h2 class="write_comment_label"><i class="bi bi-chat-text-fill"></i> Write a comment!</h2>
        <label class="input">
            <input class="input__field" type="text" placeholder=" " @keypress="submitComment($event)"
                v-model="newComment" />
            <span class="input__label">Type in your comment!</span>
        </label>
        <div class="button-group">
            <button class="submit_add_comment" @click="submitComment($event)"><span><i class="bi bi-plus-lg"></i></span>Add
                comment</button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'AddComment',
    props: {
        isParent: String,
        parentid: String,
    },
    data() {
        return {
            newComment: '',
        };
    },
    computed: {
        ...mapState('comments', { commentData: state => state.commentData }),
    },
    methods: {
        submitComment(event) {
            if (event.type === "keypress" && event.key === 'Enter') {
                if (this.newComment.trim() != "") {
                    this.$store.commit('comments/post', { puzzle_id: this.$parent.$props.puzzle_id, isParent: this.isParent, parent: this.parentid, message: this.newComment });
                    this.newComment = '';
                }
            } else if (event.type === "click") {
                if (this.newComment.trim() != "") {
                    this.$store.commit('comments/post', { puzzle_id: this.$parent.$props.puzzle_id, isParent: this.isParent, parent: this.parentid, message: this.newComment });
                    this.newComment = '';
                }
            }

        }
    }
}
</script>

<style>
    .add_comment_form {
        background: #ccd5ae;
        display: flex;
        flex-direction: column;
        padding: 3%;
        margin-top: 0;
        border-radius: 15px;
        width: 100%;
        justify-content: center;
        margin-left: 3%;
    }

    .write_comment_label {
        padding-bottom: 15px;
        font-family: BioRhyme;
        color: #3a533a 
    }

.input {
    position: relative;
}

    .input__label {
        position: absolute;
        left: 0;
        padding: 10px;
        pointer-events: none;
        font-size: 1.2em;
        transition: 0.5s;
        font-family: BioRhyme;
        color: #3a533a 
    }

    .input__field {
        width: 100%;
        border: 3px solid currentColor;
        padding: calc(var(--size-bezel) * 1.5) var(--size-bezel);
        color: currentColor;
        background: #e9edc9;
        border-radius: 5px;
        border-color: #e9edc9;
        padding: 10px;
        font-size: 1.2em;
        font-family: BioRhyme;
        color: #3a533a 
    }

.input input:focus~span {
    transform: translateX(10px) translateY(-18px);
    font-size: 0.9em;
    padding: 7px;
    background: #E9EDC9;
}

.button-group {
    margin-top: 25px;
}

    .submit_add_comment {
        background-color: #E9EDC9;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: inline-block;
        font-weight: 600;
        font-size: 16px;
        font-family: BioRhyme;
        padding: 0px 15px;
        line-height: 50px;
        text-align: center;
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        width: 60%;
        color: #3a533a;
    }

    .submit_add_comment:hover {
        transition: 100ms linear;
        transform: scale(1.1);
        color: #3a533a;
        border-color: #3a533a;
        box-shadow: #3a533a 4px 4px 0 0;
    }
</style>