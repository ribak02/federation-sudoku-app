<template>
    <div class="send-edit-box">
        <input class="edit__field" type="text" v-model="newComment" @keypress="submitComment($event)" id="edit_field_id" />
        <button class="submit_edit_comment" @click="submitComment($event)"><i class="bi bi-check-lg"></i></button>
    </div>
</template>

<script>
export default {
    name: 'EditComment',
    props: {
        userComment: Object,
        puzzleid: String,
        showEdit: Number
    },
    data() {
        return {
            newComment: '',
            showEditValue: this.showEdit,
        };
    },
    methods: {
        submitComment(event) {
            if (event.type === "keypress" && event.key === 'Enter') {
                if (this.newComment != '') {
                    this.$store.commit('comments/edit', { puzzle_id: this.puzzleid, commentToEdit: this.userComment, editMessage: this.newComment });
                }
                this.showEditValue = 0;
                this.$emit("hideEdit", this.showEditValue);
            } else if (event.type === "click") {
                if (this.newComment != '') {
                    this.$store.commit('comments/edit', { puzzle_id: this.puzzleid, commentToEdit: this.userComment, editMessage: this.newComment });
                }
                this.showEditValue = 0;
                this.$emit("hideEdit", this.showEditValue);
            }
        }
    },
    mounted() {
        document.getElementById("edit_field_id").value = this.userComment.message;
    }
}
</script>
<style>
.send-edit-box {
    margin-top: 20px;
    margin-left: 3%;
    display: flex;
    flex: row;
    justify-content: center;
    padding-bottom: 10px;
}

.edit__field {
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

.edit__field:focus {
    border: none;
    border-bottom: 2px solid currentColor;
}

.submit_edit_comment {
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

.submit_edit_comment:hover {
    background-color: white;
}
</style>