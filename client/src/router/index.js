// import axios from "axios";
import { createRouter, createWebHistory } from "vue-router";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const store = require('../store/modules/Authentication').default
const ADMIN_ROLE = 1
const SETTER_ROLE = 2
// const SOLVER_ROLE = 3
const GUEST_ROLE = 4

const routes = [
    {
        path: "/",
        name: "StartPage",
        component: () => import("../views/StartPage.vue"),
    },
    {
        path: "/home",
        name: "HomePage",
        component: () => import("../views/HomePage.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/help",
        name: "helpPage",
        component: () => import("../views/HelpPage.vue"),
    },
    {
        path: "/login",
        name: "LoginPage",
        component: () => import("../views/LoginPage.vue"),
        meta: { isLogin: true }
    },
    {
        path: "/oauth_login",
        name: "OAuthLoginPage",
        component: () => import("../views/OAuthLoginPage.vue"),
    },
    {
        path: "/redirect/:server_id",
        name: "RedirectPage",
        component: () => import("../views/RedirectPage.vue"),
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/RegisterPage.vue"),
    },
    {
        path: "/admin",
        name: "AdminPage",
        component: () => import("../views/AdminPage.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
        path: "/forbidden",
        name: "ForbiddenPage",
        component: () => import("../views/ForbiddenPage.vue"),
    },
    {
        path: "/playpuzzle/:puzzle_id",
        name: "PlayPuzzle",
        component: () => import("../components/RenderPuzzle.vue"),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: "/playpuzzle/:puzzle_id",
        name: "PlaySkyscraper",
        component: () => import("../components/RenderSkyscraper.vue"),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: "/profile/:username",
        name: "Profile",
        component: () => import("../views/ProfilePage.vue"),
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: "/createpuzzle",
        name: "CreatePuzzle",
        component: () => import("../views/CreatePuzzlePage.vue"),
        meta: { requiresAuth: true, requiresSetter: true },
    },
    {
        path: "/federationpuzzles",
        name: "FederationPuzzles",
        component: () => import("../views/FedPuzzlesPage.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/playpuzzlefed/server/:serverid/sudoku/:sudokuid",
        name: "PlayPuzzleFed",
        component: () => import("../components/RenderPuzzleFed.vue"),
        meta: { requiresAuth: true },
        props: true,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFoundPage",
        component: () => import("../views/NotFoundPage.vue"),
    },
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior () {
        return { top: 0}
    }
});

function cookiesToStore() {
    let user = cookies.get("user");
    if (user != null) {
        store.state.isLoggedIn = user.is_logged_in;
        store.state.user = user.username;
        store.state.user_id = user.user_id;
        store.state.token = user.jwt;
        store.state.role = user.account_role;
    } else {
        store.state.isLoggedIn = false;
        store.state.user = null;
        store.state.user_id = null;
        store.state.token = null;
        store.state.role = 4;
    }
}

router.beforeEach(async (to, from, next) => {
    cookiesToStore();

    if (store.state.isLoggedIn && to.path === "/") {
        next("/home");
        return;
    }

    const role = store.state.role;
    const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
    const requiresSetter = to.matched.some((record) => record.meta.requiresSetter);
    var highestLevel = GUEST_ROLE;

    if (requiresAdmin) {
        highestLevel = Math.min(highestLevel, ADMIN_ROLE);
    }
    if (requiresSetter) {
        highestLevel = Math.min(highestLevel, SETTER_ROLE);
    }

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.state.isLoggedIn) {
            if (role <= highestLevel) {
                next();
                return;
            }
            next("/forbidden");
        } else {
            next("/login");
        }
    } else {
        next();
    }
});

export default router;
