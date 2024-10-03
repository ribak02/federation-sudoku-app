<template>
    <div class="scroll-bg">
        <br>
        <h2 class="other_reviews_label" style="font-family: BioRhyme; color: #3a533a;"><i class="bi bi-people-fill"></i> Comments</h2>
        <div class="scroll-div">
            <div class="scroll-object">
                <div v-for="(comment, indexAll) in commentData" :key="indexAll" class="all-comments">
                    <div v-if="comment.isParent == true" class="comment__flex">
                        <h1 class="user-comment-label"><i class="bi bi-person"></i> {{comment.user}}</h1>
                        <p class="comment-content">{{comment.message}}</p>
                        <div class="comment__flex-btn">
                            <button v-if="comment.replies && comment.replies.length> 0" @click="toReplyTo(comment)" class="see-reply-btn"><i class="bi bi-caret-down-fill"></i> See replies</button>
                            <button v-if="this.seeRepliesBtnClicked == 1 && this.commentID == comment._id" @click="hideRepliesSection()" class="hide-replies-btn" ><i class="bi bi-caret-up-fill"></i> Hide</button>
                            <button v-if="(comment.isMine || isAdmin()) && comment.message != '[deleted]'" @click="deleteComment(comment)" class="delete-btn"><i class="bi bi-trash3-fill"></i> Delete</button>
                            <button class="replyButton" v-if="comment.message != '[deleted]'" v-on:click="toReplyTo(comment)"><i class="bi bi-reply-fill"></i> Reply</button>
                            <button class="editButton" v-if="comment.isMine && comment.message != '[deleted]'" @click="showEditBox(comment)"><i class="bi bi-pencil-fill"></i> Edit</button>
                        </div>
                        <EditComment v-if="this.commentID == comment._id && this.showEdit == 1" :userComment=comment :puzzleid=this.$parent.$props.puzzle_id :showEdit=this.showEdit @hideEdit="hideEditBox($event)"></EditComment>
                        <div v-if="comment.showReply == true && this.seeRepliesBtnClicked == 1 && this.commentID == comment._id" class="replies">
                            <SendReplyComment :isParent="0" :parentid=comment._id :puzzleid=this.$parent.$props.puzzle_id></SendReplyComment>
                            <div v-for="(reply,index) in comment.replies" :key="index">
                                <div class="replies__flex">
                                    <h1 class="user-comment-label"><i class="bi bi-person"></i> {{reply.user}}</h1>
                                    <p class="reply-message-content">{{reply.message}}</p>
                                    <button v-if="(reply.isMine || isAdmin()) && reply.message != '[deleted]'" @click="deleteComment(reply)" class="delete-reply-btn"><i class="bi bi-trash3-fill"></i> Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import SendReplyComment from './SendReplyComment.vue';
import EditComment from './EditComment.vue';

export default {
    name: 'SeeComments',
    components: {
        SendReplyComment,
        EditComment
    },
    computed: {
        ...mapState('comments',{commentData: state=>state.commentData}),
    },
    data() {
        return {
            seeRepliesBtnClicked: 0,
            commentID: 0,
            userSubmitReply: 0,
            showEdit:0
        }
    },
    methods: {
        isAdmin() {
            return this.$store.getters.getRole == 1;
        },
        toReplyTo(comment) {
            this.$store.commit('comments/seeReplies', comment);
            this.seeRepliesBtnClicked = 1;
            this.commentID = comment._id;
        },
        deleteComment(comment) {
            this.$store.commit('comments/delete',{puzzle_id: this.puzzleid, commentToDelete: comment});
        },
        hideRepliesSection() {
            this.seeRepliesBtnClicked = 0;
            this.showEdit = 0;
        },
        showEditBox(comment) {
            this.showEdit = 1;
            this.commentID = comment._id;
        },
        hideEditBox(e) {
            this.showEdit = e;
            // this.commentID = comment._id;
        }
    },
    mounted() {
        this.$store.commit('comments/getComments', this.$parent.$props.puzzle_id);
    }
};
</script>

<style>
    .scroll-bg {
        margin-left: 3%;
        margin-top: 20px;
        margin-bottom: 0px;
        width: 100%;
        border-radius: 15px;
        background-color: #ccd5ae;
        padding-bottom: 3%;
    }

    .scroll-div {
        margin: auto;
        width: 95%;
        height: 305px;
        background: #e9edc9;
        overflow: hidden;
        overflow-y: scroll;
        border-radius: 15px;
    }

    .comment__flex {
        float: left;
        width: 100%;
        background-color: #e9edc9;
        border-bottom: 2px solid #3a533a;
        padding: 10px;
        color: #3a533a;
        color: #3a533a;
        font-family: BioRhyme;
    }

    .user-comment-label {
        font-size: large;
        float: left;
        font-weight: bold;
        color: #3a533a;
    }

    .comment-content {
        margin:auto;
        padding-top: 30px;
    }

    .see-reply-btn {
        margin: auto;
        margin-top: 5px;
        padding: 6px;
        border-radius: 20px;
        border: none;
        transition: 300ms smooth;
        background-color: #e9edc9;
        color: #3a533a;
    }

    .see-reply-btn:hover {
        background-color: #ccd5ae;
    }

    .delete-btn {
        margin: auto;
        margin-top: 5px;
        padding: 6px;
        border-radius: 20px;
        border: none;
        transition: 300ms;
        background-color: #e9edc9;
        color: #3a533a;
    }

    .delete-btn:hover {
        background-color: #ccd5ae;
    }

    .replies {
        width: 100%;
    }

    .replies__flex {
        display: flex;
        flex: column;
        width: 100%;
        background-color: #e9edc9;
        margin-left: 25px;
        margin-top: 20px;
    }
    
    .bi-reply-fill{
        color: #3a533a;
    }

    .reply-message-content {
       padding-left: 20px;
    }

    .replyButton {
        margin: auto;
        margin-top: 5px;
        padding: 6px;
        border-radius: 20px;
        border: none;
        transition: 300ms;
        color: #3a533a;
        background-color: #e9edc9;
    }

    .replyButton:hover {
        background-color: #ccd5ae;
    }

    .editButton {
        margin: auto;
        margin-top: 5px;
        padding: 6px;
        border-radius: 20px;
        border: none;
        transition: 300ms;
        color: #3a533a;
        background-color: #e9edc9;

    }

    .editButton:hover {
        background-color: #ccd5ae;
    }

    .hide-replies-btn {
        margin: auto;
        margin-top: 5px;
        padding: 6px;
        border-radius: 20px;
        border: none;
        transition: 300ms;
        background-color: #e9edc9;
        color: #3a533a;
    }

    .hide-replies-btn:hover {
        background-color:#ccd5ae;
    }

    .delete-reply-btn {
        margin-left: 20px;
        margin-bottom: 18px;
        border-radius: 20px;
        border: none;
        transition: 300ms;
        background-color: #e9edc9;
        color: #3a533a;
    }

    .delete-reply-btn:hover {
        background-color: #ccd5ae;
    }
</style>