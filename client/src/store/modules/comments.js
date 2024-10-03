import { makeComment, updateComment, getCommentsForPuzzle } from "../../services/CommentService"; 
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export default {
    namespaced: true,
    state() {
        return {
            commentData: [],
        }
    },
    mutations: {
        getComments(state, puzzle_id){
            getCommentsForPuzzle(puzzle_id).then((data) => {

                let dummy_comments = [];
                let parentMap = {};
                for (let i=0; i<data.length;i++){
                    if (data[i].isParent){
                        let parent_obj = {
                            _id: data[i].comment_id,
                            isParent: data[i].isParent,
                            message: data[i].comment,
                            user_id: data[i].account_id,
                            date: data[i].time_stamp,
                            showReply: false,
                            parent: data[i].parent_id,
                            edited: data[i].edited,
                            user: data[i].username,
                            isMine: data[i].username == cookies.get('user').username,
                            replies: [],
                            deleted: data[i].message == '[deleted]',
                        };
                        parentMap[parent_obj._id] = dummy_comments.length;
                        dummy_comments.push(parent_obj);
                    }
                }

                for (let i=0; i<data.length;i++){
                    if (data[i].isParent == 0 && data[i].parent_id){
                        let child_obj = {
                            _id: data[i].comment_id,
                            isParent: data[i].isParent,
                            message: data[i].comment,
                            user_id: data[i].account_id,
                            date: data[i].time_stamp,
                            showReply: false,
                            parent: data[i].parent_id,
                            edited: data[i].edited,
                            user: data[i].username,
                            isMine: data[i].username == cookies.get('user').username,
                            deleted: data[i].message == '[deleted]',
                        };
                        dummy_comments[parentMap[data[i].parent_id]].replies.push(child_obj);
                    }
                }
                state.commentData = dummy_comments;
            });
            return [];
        },
        seeReplies(state, comment){
            if (comment.isParent){
                comment.showReply = true;
            }
        },
        post(state, {puzzle_id, isParent, parent, message}) {
            let newComment = {
                user: cookies.get('user').username,
                user_id: cookies.get('user').user_id,
                message: message,
                parent: parent,
                edited: false,
                isParent: isParent,
                isMine: true,
            }
            let res = makeComment(puzzle_id, newComment,newComment.parent);
            res.then((commentid) => {
                newComment._id = commentid;
            })

            if (isParent && newComment.replies) {
                state.commentData.unshift(newComment);
            } else if (isParent) {
                newComment.replies = [];
                newComment.showReply = false;
                state.commentData.unshift(newComment);
            } else {
                for (let i=0; i < state.commentData.length; i++){
                    if (state.commentData[i]._id == newComment.parent){
                        state.commentData[i].replies.push(newComment);
                    }
                }
            }
        },
        
        delete(state, {puzzle_id, commentToDelete}) {
            commentToDelete.deleted = true; //will just show as '[deleted]'
            commentToDelete.message = '[deleted]';
            updateComment(puzzle_id, commentToDelete);
        },

        edit(state, {puzzle_id, commentToEdit, editMessage}) {
            commentToEdit.message = editMessage;
            updateComment(puzzle_id, commentToEdit);
        }
    },
}