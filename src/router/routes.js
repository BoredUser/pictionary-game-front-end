import VueRouter from "vue-router";
import GameHome from "@/components/GameHome.vue";
import GameRooms from "@/components/GameRooms.vue";
import GameLobby from "@/components/GameLobby.vue";
import GameCanvas from "@/components/GameCanvas.vue";


const router = new VueRouter({
	mode: "history",
	routes: [
		{
			name: "home",
			path: "/",
			component: GameHome,
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
			component: GameRooms,
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
			component: GameLobby,
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
			component: GameCanvas,
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
		}
	],
});


export default router;
