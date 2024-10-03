<template>
    <div class="row">
        <div class="col-4"></div>
        <div class="col-4 login">
            <form class="card p-3" v-on:submit.prevent="onSubmit" style="background-color: #fefae0">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input style = "font-family: BioRhyme;" type="text" class="form-control" v-model="username" id="username" placeholder="Username" />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" style="font-family: BioRhyme;" class="form-control" v-model="password" id="password" placeholder="Password" />
                </div>
                <button class="btn" style="background-color: #e9cd85; font-family: BioRhyme; color: #3a533a; font-weight: bolder" @click="login">
                    Login
                </button>
            </form>
            <div class="container p-2">
                <p style="font-family: BioRhyme; color: #3a533a; font-weight: bolder">
                    New to Waffle?
                    <router-link to="/register">
                        <a id="registerButton"> Register here </a>
                    </router-link>
                </p>
            </div>
            <div class="accordion accordion-flush" id="federatedServers">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingOne">
                        <button class="accordion-button collapsed text-secondary" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne"
                            style="background-color: white; font-family: BioRhyme; color: #3a533a; font-weight: bolder">
                            Or log in with our federated servers
                        </button>
                    </h2>
                    <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne"
                        data-bs-parent="#federatedServers">
                        <div class="accordion-body">
                            <div class="row">
                                <div v-for="server_id in onlineServers" :key="server_id"
                                    class="col-12 col-lg-4 col-md-4 col-sm-4 p-2">
                                    <button class="btn" style="background-color: #e3f2fd; font-family: BioRhyme; color: #3a533a; font-weight: bolder"
                                        @click="login_external(server_id)">
                                        Server {{ server_id }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4"></div>
    </div>
</template>
<script>
import axios from "axios";
import router from "@/router";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import Swal from "sweetalert2";


export default {
    name: "LoginComp",
    data() {
        return {
            username: "",
            user_id: "",
            password: "",
            server_id: 12,
            onlineServers: [10, 11, 13, 14, 15, 16, 17, 18, 19],
        };
    },
    methods: {
        login() {
            axios
                .post("/api/login", { // sends api call to backend
                    username: this.username,
                    password: this.password,
                    user_id: this.user_id,
                    server_id: this.server_id,
                })
                .then((res) => {
                    if (res.data.is_logged_in) {
                        
                        // Login alert
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            })
                        Toast.fire({
                        icon: 'success',
                        title: 'Signed in successfully'
                        })

                        cookies.set("user", res.data); // updates cookies
                        this.$store.dispatch("login", { username: this.username, user_id: this.user_id, token: res.data.jwt, role: res.data.account_role }); // updates store
                        router.push("/home"); // updates page
                    } else {
                        Swal.fire({
                            title:"Error",
                            text: res.data.error_message,
                            icon:'error',
                            });
                    }
                });
        },
        login_external(server_id) {
            axios
                .post("/api/login_external", {
                    server_id: server_id,
                })
                .then((res) => {
                    if (res.data.redirect_uri) {
                        window.location.href = res.data.redirect_uri;
                    } else {
                        Swal.fire({
                            title:"Error",
                            text: res.data.error_message,
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
