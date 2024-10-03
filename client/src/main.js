import { createApp } from "vue";
import vueCookies from "vue-cookies";
import App from "./App.vue";
import { store } from "./store";
import router from "./router";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import StarRating from 'vue-star-rating'

axios.defaults.withCredentials = true;

const app = createApp(App);
app.use(store);
app.use(router);
router.app = app;
app.use(vueCookies);
app.component('StarRatings', StarRating)
app.config.globalProperties.$store = store;
app.mount("#app");
