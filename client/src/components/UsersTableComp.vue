<template>
    <div class="container">
        <data-table class = "form-label" :title='title' :columns='columns' :rows='users' :exactSearch='true'>
            <template v-slot:thead-tr>
                <th class = "form-label" style = "color: black;">
                    Actions
                </th>
            </template>
            <template #tbody-tr="data">
                <td class="action_column">
                    <div class="row">
                        <div class="col-4">
                            <button class='btn btn-info rounded-pill form-label' style="width:7em; background-color: #f6e2ac; border-color: #f6e2ac;" @click="view(data)">
                                View
                            </button>
                        </div>
                        <div class=" col-4">
                            <button class='btn btn-success rounded-pill form-label'  style="width:7em; background-color: #ccd5ae; border-color: #ccd5ae;" @click="promote(data)">
                                Promote
                            </button>
                        </div>
                        <div class="col-4">
                            <button class='btn btn-danger rounded-pill form-label'  style="width:7em; background-color: #e67065; border-color: #e67065;" @click="demote(data)">
                                Demote
                            </button>
                        </div>
                    </div>
                </td>
            </template>
        </data-table>
    </div>
</template>
<script>
import axios from "axios";
import router from "@/router";
import DataTable from "vue-customizable-datatable";
import Swal from "sweetalert2";

const status_badge = {
    true: '<span class="badge rounded-pill form-label" style="background-color: #ccd5ae; border-color: #ccd5ae; ">Online</span>',
    false: '<span class="badge rounded-pill form-label" style="background-color: #cfcfcc; border-color: #cfcfcc; ">Offline</span>'
}

const role_badge = {
    ADMIN: '<span class="a badge rounded-pill" style="background-color: #cf2d73d5; border-color: #cf2d73; ">Admin</span>',
    SETTER: '<span class="b badge rounded-pill" style="background-color: #6056d6; border-color: #6056d6; ">Setter</span>',
    SOLVER: '<span class="c badge rounded-pill" style="background-color: #d69ede; border-color: #d69ede; ">Solver</span>',
    GUEST: '<span class="d badge rounded-pill" style="background-color: #ccd5ae; border-color: #ccd5ae; ">Guest</span>'
}

export default {
    name: "UsersTableComp",
    props: ['only_pending'],
    data() {
        return {
            title: null,
            users: [{
                number: null,
                username: null,
                email: null,
                status: null,
                role: null
            }],
            columns: [
                {
                    label: 'Number',
                    field: 'number',
                    numeric: true,
                    html: false,
                },
                {
                    label: 'Username',
                    field: 'username',
                    numeric: false,
                    html: false,
                },
                {
                    label: 'Email',
                    field: 'email',
                    numeric: false,
                    html: false,
                },
                {
                    label: 'Status',
                    field: 'status',
                    numeric: false,
                    html: true,
                },
                {
                    label: 'Role',
                    field: 'role',
                    numeric: false,
                    html: true,
                },
            ],
        };
    },
    methods: {
        view(data) {
            const username = data.row.username;
            router.push({
                name: "Profile",
                params: { username: username },
            });
        },
        promote(data) {
            const username = data.row.username;

            axios
                .post("/api/promote_user", {
                    username: username
                })
                .then((res) => {
                    if (res.data.success) {
                        Swal.fire({
                            title: "Promoted " + username + "!",
                            confirmButtonText: 'Ok',
                            confirmButtonColor: 'grey',
                            icon: 'success'}).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            })
                    }
                    else {
                        Swal.fire({
                            title:"Error",
                            text: res.data.error_message,
                            icon:'error',
                            });
                    }
                })
        },
        demote(data) {
            const username = data.row.username;

            axios
                .post("/api/demote_user", {
                    username: username
                })
                .then((res) => {
                    if (res.data.success) {
                        Swal.fire({
                            title: "Demoted " + username + "!",
                            confirmButtonText: 'Ok',
                            confirmButtonColor: 'grey',
                            icon: 'success'}).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            })
                    }
                    else {
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
        if (this.only_pending) {
            this.title = "PENDING REQUESTS"
        } else {
            this.title = "ALL USERS";
        }
        axios
            .post("/api/all_users", {
                only_pending: this.only_pending
            })
            .then((res) => {
                if (res.data.success) {
                    for (const index in res.data.data) {
                        var entry = res.data.data[index]
                        var status = status_badge[entry.logged_in];
                        var role = role_badge[entry.role_name];
                        this.users.push({
                            number: (Number(index) + 1),
                            username: entry.username,
                            email: entry.email,
                            status: status,
                            role: role
                        })
                    }
                    this.users.shift()
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
    components: {
        DataTable
    }
};
</script>
<style>
@import 'bootstrap';
@import 'datatables.net-bs5';

.form-label{
    font-family: BioRhyme; 
    color: #3a533a; 
    font-weight: bolder
}

.user_table {
    background: #FEFAE0;
}

.c {
    background: #fd7a63;
    background-color: #97ae4a;
}

.action_column {
    min-width: 18em !important;
}

.role_column {
    margin: 0;
    max-width: 4em
}
</style>