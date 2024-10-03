<template>
    <div v-show="!user_is_valid" id="validate_new_user">
        <h1 style = "font-family: BioRhyme; color: #3a533a; font-weight: bolder">Register</h1>
        <div class="row">
            <div class="col-4"></div>
            <div class="col-4 register">
                <form class="card p-3" v-on:submit.prevent="onSubmit" style="background-color: #fefae0">
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input style = "font-family: BioRhyme;" type="text" class="form-control" v-model="username" id="username"
                            placeholder="Username" />
                    </div>

                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input style = "font-family: BioRhyme;" type="text" class="form-control" v-model="name" id="name" placeholder="Name" />
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input style = "font-family: BioRhyme;" type="text" class="form-control" v-model="email" id="email" placeholder="Email" />
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" style ="font-family: BioRhyme;" class="form-control" v-model="password" id="password"
                            placeholder="Password" />
                    </div>
                    <button class="btn" style="background-color: #e9cd85; font-family: BioRhyme; color: #3a533a; font-weight: bolder" @click="validate_user">
                        Register
                    </button>
                </form>
            </div>
            <div class="col-4"></div>
        </div>
    </div>
    <div v-show="user_is_valid" id="verfiy_new_user">
        <h1 class="form-label">Verify</h1>
        <div class="row">
            <div class="col-4"></div>
            <div class="col-4 register">
                <form class="card p-3 form-label" v-on:submit.prevent="onSubmit" style="background-color: #fefae0">
                    <div class="container p-2">
                        <h6>Please use the following verification code to verify your account.</h6>
                        <br>
                        <h5><b>{{ $data.actual_code }}</b></h5>
                        <br>
                        <h6>We would have sent the code to your email (<small>{{ $data.email }}</small>) to verify your
                            account but cannot due to data protection rights
                            &#128516;. Guess we can use this as a sort of CAPTCHA?
                        </h6>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" v-model="input_code" id="code" />
                    </div>
                    <button class="btn" style="background-color: #e9cd85" @click="register">
                        Complete registration
                    </button>
                </form>
                <div class="card-2">
                    <div class="content d-flex justify-content-center align-items-center"> <span style="font-family: BioRhyme; font-weight: bolder;">Didn't get the
                            code or did it expire?
                            <span class="content d-flex justify-content-center align-items-center">
                                <button :disabled="sent_code" @click="get_verification_code" type="button"
                                    class="btn btn-link" style = "font-family:BioRhyme">Resend</button>
                                <div v-show="sent_code">in {{ timer_count }} seconds</div>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-4"></div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
    name: "RegisterComp",
    data() {
        return {
            username: "",
            name: "",
            email: "",
            password: "",
            user_is_valid: false,
            timer_count: 30,
            sent_code: false,
            actual_code: "",
            input_code: "",
        };
    },
    methods: {
        validate_user() {
            axios
                .post("/api/validate_new_user", {
                    username: this.username,
                    name: this.name,
                    email: this.email,
                    password: this.password,
                })
                .then((res) => {
                    if (res.data.success) {
                        this.get_verification_code();
                        this.user_is_valid = true;
                    }
                    else if (res.data.error_message === "Validation Failed") {
                        let errors = res.data.errors;
                        let error_message = "";
                        if (errors.username.length != 0) {
                            for (let i = 0; i < errors.username.length; i++) {
                                error_message += "${errors.username[i]}\n";
                            }
                        }
                        if (errors.name.length != 0) {
                            for (let i = 0; i < errors.name.length; i++) {
                                error_message += `${errors.name[i]}\n`;
                            }
                        }
                        if (errors.email.length != 0) {
                            for (let i = 0; i < errors.email.length; i++) {
                                error_message += `${errors.email[i]}\n`;
                            }
                        }
                        if (errors.password.length != 0) {
                            for (let i = 0; i < errors.password.length; i++) {
                                error_message += `${errors.password[i]}\n`;
                            }
                        }
                        Swal.fire({
                            title:"Error",
                            text: error_message,
                            icon:'error',
                            });
                    }
                    else {
                        Swal.fire({
                            title:"Error",
                            text: res.data.error_message,
                            icon:'error',
                            });
                    }
                });
        },
        get_verification_code() {
            axios
                .post("/api/get_verification_code", {
                    email: this.email,
                })
                .then((res) => {
                    if (res.data.success) {
                        this.actual_code = res.data.code;
                        this.sent_code = true;
                        this.timer_count = 30;
                    }
                    else {
                        Swal.fire({
                            title:"Error",
                            text: res.data.error_message,
                            icon:'error',
                            });
                    }
                });
        },
        register() {
            axios
                .post("/api/register", {
                    username: this.username,
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    code: this.input_code
                })
                .then((res) => {
                    if (res.data.success) {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            })
                        Toast.fire({
                        icon: 'success',
                        title: 'Registration successful!'
                        })
                        this.$router.push("/login");
                    }
                    else {
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
    watch: {// https://stackoverflow.com/questions/55773602/how-do-i-create-a-simple-10-seconds-countdown-in-vue-js
        sent_code(value) {
            if (value) {
                setTimeout(() => {
                    this.timer_count--;
                }, 1000);
            }
        },
        timer_count: {
            handler(value) {

                if (value > 0 && this.sent_code) {
                    setTimeout(() => {
                        this.timer_count--;
                    }, 1000);
                } else if (value == 0) {
                    this.sent_code = false;
                }

            },
            immediate: true // This ensures the watcher is triggered upon creation
        }
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