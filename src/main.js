import Vue from "vue";
import App from "./App.vue";
import { events } from "@/utils/constants";
import "./init.js";
import "normalize.css/normalize.css";
import { nanoid } from "nanoid";
import router from "@/router/routes.js";

import store from "./store";
import { io } from "socket.io-client";
import Toasted from 'vue-toasted';
//http://localhost:3001
//https://fa-pictionary-app.herokuapp.com
const socket = io("https://fa-pictionary-app.herokuapp.com", {
	transports: ["websocket"],
});

socket.on("connect", () => {
	console.log(socket.id);
	if (!localStorage.getItem("customId")) {
		const cutomId = nanoid(10);
		localStorage.setItem("customId", cutomId);
		socket.emit(events.SET_CUSTOM_CLIENT_ID, {
			id: socket.id,
			customId: cutomId,
		});
	} else {
		socket.emit(events.SET_CUSTOM_CLIENT_ID, {
			id: socket.id,
			customId: localStorage.getItem("customId"),
		});
	}
});

 
Vue.use(Toasted)
 
Vue.prototype.$socket = socket;

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
