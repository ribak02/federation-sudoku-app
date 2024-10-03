<template>
    <NavBar />
    <h1>{{ message }}</h1>
    <link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
</template>
<script>
import axios from "axios";
import router from "@/router";
import { useCookies } from "vue3-cookies";
import NavBar from "@/components/NavBar.vue";

const { cookies } = useCookies();

export default {
    name: "ReDirect",
    components: {
        NavBar
    },
    data() {
        return {
            message: "Fetching user access token...",
            token_success_message:
                "Token fetched successfully. Fetching user details...",
            user_success_message:
                "User details fetched successfully. Redirecting to home page...",
        };
    },
    mounted() {
        axios
            .post(
                "/fedapi/get_access_token",
                new URLSearchParams({
                    server_id: this.$route.params.server_id,
                    code: this.$route.query.code,
                    state: this.$route.query.state,
                })
            )
            .then((res) => {
                if (res.data.success) {
                    this.message = this.token_success_message;
                    const token = res.data.token;
                    axios
                        .post(
                            "/fedapi/get_user_details",
                            new URLSearchParams({
                                server_id: this.$route.params.server_id,
                            })
                        )
                        .then((res) => {
                            if (res.data.is_logged_in) {
                                this.message = this.user_success_message;
                                cookies.set("user", res.data);
                                this.$store.dispatch("login", { username: res.data.username, token: token });
                                router.push("/home");
                            } else {
                                this.message = res.data.error_message;
                            }
                        });
                } else {
                    this.message = res.data.error_message;
                }
            });
    },
};
</script>
