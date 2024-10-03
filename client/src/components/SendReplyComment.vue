<template>
    <div class="send-reply-box">
        <input class="reply__field" type="text" placeholder=" " @keypress="submitComment($event)" v-model="newComment"
            id="reply_field_id" />
        <button class="submit_reply_comment" @click="submitComment($event)"><i class="bi bi-reply-fill"></i></button>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'SendReplyComment',
    props: {
        isParent: String,
        parentid: String,
        puzzleid: String,
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
                    this.$store.commit('comments/post', { puzzle_id: this.puzzleid, isParent: this.isParent, parent: this.parentid, message: this.newComment });
                    this.newComment = '';
                }
            } else if (event.type === "click") {
                if (this.newComment.trim() != "") {
                    this.$store.commit('comments/post', { puzzle_id: this.puzzleid, isParent: this.isParent, parent: this.parentid, message: this.newComment });
                    this.newComment = '';
                }
            }
        }
    }
}
</script>

<style>
.send-reply-box {
    margin-top: 20px;
    margin-left: 3%;
    display: flex;
    flex: row;
    justify-content: center;
    padding-bottom: 10px;
}

.reply__field {
    position: relative;
    border: none;
    outline: none;
    border-bottom: 1px solid currentColor;
    width: 50%;
    height: 5%;
    padding: 10px;
    color: currentColor;
    background: transparent;
    font-size: 1.2em;
    transition: 300ms smooth;
}

.reply__field:focus {
    border: none;
    border-bottom: 2px solid currentColor;
}

.submit_reply_comment {
    margin-top: 10px;
    margin-left: 5px;
    width: 10%;
    font-size: 25px;
    border-radius: 30px;
    padding: 0;
    border: none;
    background-color: transparent;
    transition: 0.5s;
    height: 50px;
}

.submit_reply_comment:hover {
    background-color: white;
}
</style>