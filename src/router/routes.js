import VueRouter from "vue-router";
import store from "@/store";
import { GET_NAME } from "../store/getter.type";
// import GameHome from "@/components/GameHome.vue";
// import GameRooms from "@/components/GameRooms.vue";
// import GameLobby from "@/components/GameLobby.vue";
// import GameCanvas from "@/components/GameCanvas.vue";
// import GameEnd from "@/components/GameEnd.vue";
// import Canvas from "@/components/Canvas.vue";

const router = new VueRouter({
	mode: "history",
	routes: [
		{
			name: "Canvas",
			path: "/test",
			component: () => import(/* webpackChunkName: "Home" */ '@/components/Canvas.vue'),
			//component: Canvas,
			meta: {
				title: "Pictionary Game",
				metaTags: [
					{
						name: "Pictionary Game",
						content: "The Best drawing and guessing game",
					},
					{
						property: "og:description",
						content: "The Best drawing and guessing game",
					},
				],
			},
		},
		{
			name: "Home",
			path: "/",
			component: () => import(/* webpackChunkName: "Home" */ '@/components/GameHome.vue'),
			//component: GameHome,
			meta: {
				title: "Pictionary Game",
				metaTags: [
					{
						name: "Pictionary Game",
						content: "The Best drawing and guessing game",
					},
					{
						property: "og:description",
						content: "The Best drawing and guessing game",
					},
				],
			},
		},
		{
			name: "Rooms",
			path: "/rooms",
			component: () => import(/* webpackChunkName: "Home" */ '@/components/GameRooms.vue'),
			//component: GameRooms,
			meta: {
				title: "Pictionary Game | Room",
				metaTags: [
					{
						name: "Pictionary Game",
						content: "The Best drawing and guessing game",
					},
					{
						property: "og:description",
						content: "The Best drawing and guessing game",
					},
				],
			},
		},
		{
			name: "Room",
			path: "/room/:id",
			component: () => import(/* webpackChunkName: "Home" */ '@/components/GameLobby.vue'),
			//component: GameLobby,
			meta: {
				title: "Pictionary Game | Lobby",
				metaTags: [
					{
						name: "Pictionary Game",
						content: "The Best drawing and guessing game",
					},
					{
						property: "og:description",
						content: "The Best drawing and guessing game",
					},
				],
			},
		},
		{
			name: "Canvas",
			path: "/room/:id/canvas",
			component: () => import(/* webpackChunkName: "Home" */ '@/components/GameCanvas.vue'),
			//component: GameCanvas,
			meta: {
				title: "Pictionary Game | Lobby",
				metaTags: [
					{
						name: "Pictionary Game",
						content: "The Best drawing and guessing game",
					},
					{
						property: "og:description",
						content: "The Best drawing and guessing game",
					},
				],
			},
		},
		{
			name: "GameEnd",
			path: "/room/:id/gameend",
			component: () => import(/* webpackChunkName: "Home" */ '@/components/GameEnd.vue'),
			//component: GameEnd,
			meta: {
				title: "Pictionary Game | End",
				metaTags: [
					{
						name: "Pictionary Game",
						content: "The Best drawing and guessing game",
					},
					{
						property: "og:description",
						content: "The Best drawing and guessing game",
					},
				],
			},
		}
	],
});

router.beforeEach((to, from, next) => {
	const userName = store.getters[GET_NAME];
	if (to.name !== "Home" && userName === null) {
		next({ name: "Home" });
	} else {
		const nearestWithTitle = to.matched
			.slice()
			.reverse()
			.find((r) => r.meta && r.meta.title);

		// Find the nearest route element with meta tags.
		const nearestWithMeta = to.matched
			.slice()
			.reverse()
			.find((r) => r.meta && r.meta.metaTags);

		const previousNearestWithMeta = from.matched
			.slice()
			.reverse()
			.find((r) => r.meta && r.meta.metaTags);

		// If a route with a title was found, set the document (page) title to that value.
		if (nearestWithTitle) {
			document.title = nearestWithTitle.meta.title;
		} else if (previousNearestWithMeta) {
			document.title = previousNearestWithMeta.meta.title;
		}

		// Remove any stale meta tags from the document using the key attribute we set below.
		Array.from(
			document.querySelectorAll("[data-vue-router-controlled]")
		).map((el) => el.parentNode.removeChild(el));

		// Skip rendering meta tags if there are none.
		if (!nearestWithMeta) return next();

		// Turn the meta tag definitions into actual elements in the head.
		nearestWithMeta.meta.metaTags
			.map((tagDef) => {
				const tag = document.createElement("meta");

				Object.keys(tagDef).forEach((key) => {
					tag.setAttribute(key, tagDef[key]);
				});

				// We use this to track which meta tags we create so we don't interfere with other ones.
				tag.setAttribute("data-vue-router-controlled", "");

				return tag;
			})
			// Add the meta tags to the document head.
			.forEach((tag) => document.head.appendChild(tag));

		next();
	}
});

export default router;
