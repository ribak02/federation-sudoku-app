<template>
    <nav class="navbar navbar-expand-lg navbar-light p-3 sticky-top" style="background-color: #ccd5ae" height="90">
        <a class="navbar-brand" href="/home">
            <img src="../assets/logo.png" width="70" height="70" class="d-inline-block align-top" alt="" />
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
            aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse  fs-4" id="navbarText" v-if="isLoggedIn()">
            <ul class="navbar-nav mr-auto">
                <button class="button rounded-pill nav-item active m-1">
                    <router-link to="/home" class="nav-item nav-link active">Home
                    </router-link>
                </button>
                <button class="button rounded-pill nav-item m-1">
                    <router-link to="/federationpuzzles" class="nav-item nav-link active">Federation Puzzles
                    </router-link>
                </button>
                <button class="button rounded-pill nav-item m-1" v-if="isSetter()">
                    <router-link to="/createpuzzle" class="nav-item nav-link active">Create Puzzle
                    </router-link>
                </button>
                <button class="button rounded-pill nav-item m-1" v-if="isAdmin()">
                    <router-link to="/admin" class="nav-item nav-link active">Admin
                    </router-link>
                </button>
                <button class="button rounded-pill nav-item m-1">
                    <router-link to="/help" class="nav-item nav-link active">Help
                    </router-link>
                </button>
            </ul>
        </div>
        <span>
            <div v-if="isLoggedIn()">
                <!-- <a class="nav-item nav-link active" @click="logout">Logout</a> -->
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle border-secondary rounded-pill button fs-4" href="#"
                            id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-person-circle large"></i>
                            {{ getUsername() }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end bg-cream" aria-labelledby="navbarDropdown">
                            <li>
                                <a class="dropdown-item brown-hover" @click="profile(getUsername())">Profile</a>
                            </li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item brown-hover" @click="logout">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </span>
    </nav>
</template>
<link href='https://fonts.googleapis.com/css?family=BioRhyme' rel='stylesheet'>
<script>
import axios from "axios";
import router from "@/router";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import Swal from "sweetalert2";

export default {
    name: "NavBar",
    methods: {
        isLoggedIn() {
            return this.$store.getters.isLoggedIn;
        },
        isAdmin() {
            return this.$store.getters.getRole == 1;
        },
        isSetter() {
            return this.$store.getters.getRole <= 2;
        },
        getUsername() {
            return this.$store.getters.getUser;
        },
        profile(username) {
            router.push({
                name: "Profile",
                params: { username: username },
            });
        },
        logout() {
            axios
                .post("/api/logout", {
                    username: this.$store.getters.getUser,
                })
                .then((res) => {
                    cookies.remove("user");
                    if (res.data.success == true) {
                        this.$store.dispatch("logout");
                        // Logout alert
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                        })
                        Toast.fire({
                            icon: 'success',
                            title: 'Signed out successfully'
                        })
                    }

                    router.push("/");
                });
        },
    },
};
</script>
<style>
.bg-cream {
    background-color: #e9edc9 !important;
    color: #3a533a;
    justify-content: center;
    font-family: BioRhyme;
    font-weight: bolder;
    border: none;

}

.brown-hover:hover {
    background-color: #e9edc9 !important;
    color: #3a533a;
    justify-content: center;
    font-family: BioRhyme;
    font-weight: bolder;
    border: none;
}

.button {
    background-color: #e9edc9;
    border-radius: 8px;
    justify-content: center;
    font-family: BioRhyme;
    font-weight: bolder;
    border: none;
}

.dropdown-toggle {
    color: #3a533a;
    justify-content: center;
    font-family: BioRhyme;
    font-weight: bolder;
}

.nav-link {
    color: #3a533a !important;
}

#home {
    display: inline-block;
    padding-bottom: 0;
    position: relative;
}

#home::after {
    content: "";
    position: absolute;
    left: 8px;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: black;
    transition: 0.3s;
}

#home:hover {
    /* font-weight:500; */
}

#home:hover::after {
    width: 80%;
}

#federation {
    display: inline-block;
    padding-bottom: 0;
    position: relative;
}

#federation::after {
    content: "";
    position: absolute;
    left: 8px;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: black;
    transition: 0.3s;
}

#federation:hover {
    /* font-weight:500; */
}

#federation:hover::after {
    width: 92.5%;
}

#create {
    display: inline-block;
    padding-bottom: 0;
    position: relative;
}

#create::after {
    content: "";
    position: absolute;
    left: 8px;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: black;
    transition: 0.3s;
}

#create:hover::after {
    width: 90%;
}

#admin {
    display: inline-block;
    padding-bottom: 0;
    position: relative;
}

#admin::after {
    content: "";
    position: absolute;
    left: 8px;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: black;
    transition: 0.3s;
}

#admin:hover::after {
    width: 80%;
}
</style>