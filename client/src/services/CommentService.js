import axios from "axios";

export async function getCommentsForPuzzle(puzzle_id) {
    const res = await axios.get("/api/get_comments/" + puzzle_id);
    return res.data;
}

export async function makeComment(puzzle_id, comment, parent) {
    const response = await axios.post("/api/submit_comment",{
        user_id: comment.user_id,
        puzzle_id: puzzle_id,
        comment_message: comment.message,
        comment_is_parent: comment.isParent,
        comment_date: new Date().toLocaleString(),
        comment_parent: parent,
        comment_edited: comment.edited,
    });
    return response.data.commentid;
}

export async function updateComment(puzzle_id, comment) {
    await axios.post("/api/update_comment",{
        user_id: comment.user_id,
        puzzle_id: puzzle_id,
        comment_message: comment.message,
        comment_date: new Date().toLocaleString(),
        comment_edited: true,
        comment_id: comment._id,
    }).then((response) => console.log(response))
        .catch((err) => console.log(err));
}