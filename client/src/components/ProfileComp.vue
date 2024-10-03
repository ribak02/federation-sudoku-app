<template>
    <div class="padding row">
        <div class="col-2"></div>
        <div class="col-8">
            <!-- Column -->
            <div class="card">
                <div class="card-body little-profile text-center">
                    <div class="pro-img">
                        <img :src="profileData?.icon" class="img-fluid">
                        <div>
                            <span v-if="profileData?.role === 'ADMIN'" class="badge rounded-pill" style="background-color: #cf2d73d5; border-color: #cf2d73; font-family: BioRhyme">Admin</span>
                            <span v-if="profileData?.role === 'SETTER'" class="badge rounded-pill" style="background-color: #6056d6; border-color: #6056d6; font-family: BioRhyme">Setter</span>
                            <span v-if="profileData?.role === 'SOLVER'" class="badge rounded-pill" style="background-color: #d69ede; border-color: #d69ede; ; font-family: BioRhyme">Solver</span>
                            <span v-if="profileData?.role === 'GUEST'" class="badge rounded-pill" style="background-color: #ccd5ae; border-color: #ccd5ae; ; font-family: BioRhyme">Guest</span>
                        </div>
                    </div>
                    <h2 class=" form-label m-b-0">@{{ this.username }}</h2>
                    <p v-if="canSee" class=" form-label m-1">Name: {{ profileData?.name }}</p>
                    <p v-if="canSee" class="form-label">Email: {{ profileData?.email }}</p>
                    <div v-if="profileData?.role != 'ADMIN' && isUser">
                        <br>
                        <button v-if="profileData?.requested_promotion == false" class="btn form-label" @click="requestPromotion()"
                            style="background-color: #e9cd85">
                            Request Promotion
                        </button>
                        <button v-else class="btn" style="background-color: darkgreen; color: white">
                            <i class="bi bi-check2-circle form-label"></i> Requested Promotion
                        </button>
                    </div>

                    <br />
                    <hr />
                    <div class="row text-center mt-20">
                        <h2 class="form-label">Statistics</h2>
                    </div>
                    <div class="row text-center mt-20">
                        <div class="col-lg-4 col-md-4 m-t-20">
                            <h3 class="m-b-0 font-light form-label">{{ profileData?.streak }} day</h3><small class = "form-label">Streak</small>
                        </div>
                        <div class="col-lg-4 col-md-4 m-t-20">
                            <h3 class="m-b-0 font-light form-label">{{ statsData?.solved }}</h3><small class = "form-label">Solved</small>
                        </div>
                        <div class="col-lg-4 col-md-4 m-t-20">
                            <h3 class="m-b-0 font-light form-label">{{ statsData?.avg_time_str }}</h3><small class = "form-label">Average time</small>
                        </div>
                    </div>
                    <br />
                    <hr />
                    <div v-if="solved_puzzles">
                        <div class="row text-center mt-20">
                            <h2 class = "form-label">Puzzles solved</h2>
                        </div>
                        <div v-if="solved_puzzles != {}">
                            <div class="row align-items-center align-self-center">
                                <div v-for="(puzzle, id) in solved_puzzles" :key="id" class="col-4 p-2">
                                    <OnePuzzleIntro :puzzle="puzzle" />
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <br />
                            <p>None</p>
                        </div>
                    </div>
                    <br />
                    <hr />
                    <div v-if="created_puzzles">
                        <div class="row text-center mt-20">
                            <h2>Puzzles created</h2>
                        </div>
                        <div class="row align-items-center align-self-center">
                            <div v-for="(puzzle, id) in created_puzzles" :key="id" class="col-4 p-2">
                                <OnePuzzleIntro :puzzle="puzzle" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-2"></div>
    </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";

import OnePuzzleIntro from "./OnePuzzleIntro.vue";

export default {
    name: "ProfileComp",
    props: ['username'],
    data() {
        return {
            userData: null,
            isUser: null,
            canSee: null,
            profileData: null,
            statsData: null,
            solved_puzzles: null,
            created_puzzles: null,
        };
    },
    methods: {
        requestPromotion() {
            axios.post("/api/request_promotion", {
                username: this.username
            }).then((res) => {
                if (res.data.success) {
                    this.profileData.requested_promotion = true;
                } else {
                    Swal.fire({
                            title:"Error",
                            text: res.data.error_message,
                            icon:'error',
                            });
                }
            })
        }
    },
    mounted() {
        axios
            .post("/api/user_details", {
                username: this.username
            })
            .then((res) => {
                if (res.data.success) {
                    this.userData = res.data.data;
                    this.isUser = this.userData.isUser;
                    this.canSee = this.userData.canSee;
                    this.profileData = this.userData.profile;
                    this.statsData = this.userData.stats;
                    this.solved_puzzles = this.userData.solved;
                    this.created_puzzles = this.userData.created;
                }
            })
    },
    components: {
        OnePuzzleIntro
    }
};
</script>
<style>
@import 'bootstrap';
@import 'datatables.net-bs5';


.welcome-box{
        display: inline;
        background-color: #E9CD85;
        width: 75px;
        height: 75px;
        border-radius: 8px;        
        padding: 0px;
        margin: 10px;
        border:#f6e2ac ;
        border-width: 10px;
        border-style: solid;

    }


    .welcome-letter{
        font-family:BioRhyme;
        font-weight: bolder;
        color: white;
        font-size: xx-large;
        padding-top: 6px;
    }

.card-body{
    background: #FEFAE0;
    border-radius: 15px;
    border-color: #FEFAE0;
}

.user_table {
    background: #FEFAE0;
}

.c {
    background: #fd7a63;
    background-color: #97ae4a;
}

.action_column {
    min-width: 12em;
    max-width: 12em;
}

.role_column {
    margin: 0;
    max-width: 4em
}

.padding {
    padding: 3rem !important;
    margin-top: 5em
}

.card-img-top {
    height: 300px;
}

.pro-img {
    margin-top: -9em;
    margin-bottom: 20px
}

.little-profile .pro-img img {
    min-width: 18em;
    min-height: 18em;
    -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 100%
}
</style>