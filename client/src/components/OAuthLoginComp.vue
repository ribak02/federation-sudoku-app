<template>
    <div class="row">
        <div class="col-4"></div>
        <div class="col-4 login">
            <form class="card p-3" v-on:submit.prevent="onSubmit" style="background-color: #fefae0">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control form-label" v-model="username" id="username" placeholder="Username" />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control form-label" v-model="password" id="password"
                        placeholder="Password" />
                </div>
                <button class="btn" style="background-color: #e9cd85; font-family: BioRhyme; color: #3a533a; font-weight: bolder" @click="login">Login</button>
            </form>
        </div>
        <div class="col-4"></div>
    </div>

</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
    name: "LoginComp",
    data() {
        return {
            username: "",
            password: "",
        };
    },
    methods: {
        login() {
            axios
                .post("/api/oauth/login", {
                    username: this.username,
                    password: this.password,
                    redirect_uri: this.$route.query.redirect_uri,
                    client_id: this.$route.query.client_id,
                    state: this.$route.query.state,
                })
                .then((res) => {
                    if (res.data.success) {
                        window.location.href = res.data.redirect_uri;
                    } else {
                        Swal.fire({
                            title:"Error",
                            text: "Failed",
                            icon:'error',
                            });
                    }
                });
        },
        onSubmit() { },
    },
};
</script>


<style>
.form-label{
    font-family: BioRhyme; 
    color: #3a533a; 
    font-weight: bolder
}
</style>