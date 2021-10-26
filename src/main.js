import Vue from 'vue'
import App from './App.vue'

import './init.js'
import "normalize.css/normalize.css";

import router from '@/router/routes.js'

import store from "./store";
import { io } from "socket.io-client";
const socket = io("https://fa-pictionary-app.herokuapp.com", { transports : ['websocket'] });

Vue.prototype.$socket = socket;


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
