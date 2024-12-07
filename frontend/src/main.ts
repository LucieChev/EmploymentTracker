import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './router/routes';
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import './style.css';




const router = createRouter({
  history: createWebHistory(),
  routes, 
});

const app = createApp(App);
app.use(router);
app.use(Vue3Toastify, {
  autoClose: 3000, 
  position: "bottom-right", 
});app.mount('#app');
