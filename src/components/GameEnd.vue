<template>
	<div
		class="container"
		:style="{ backgroundImage: `url(${backgroundImageUrl})` }"
	>
		<div class="main-content">
			<div class="users-wrapper">
				<h3>Scores</h3>
				<h3 class="rank">1/10</h3>
				<ul class="users-list">
					<li
						v-for="(player, index) in players"
						:key="index"
						class="user"
					>
						<p>{{ player }}</p>
					</li>
				</ul>

				<button v-if="isAdmin" @click="startGame" class="start-btn">
					Start Game
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import backgroundImageUrl from "@/assets/img/textura.png";
	import { events } from "../utils/constants";
	import { GET_SCORE, GET_SOCKET_CUTOM_ID, GET_NAME } from "../store/getter.type";
	export default {
		name: "GameEnd",
		data() {
			return {
				backgroundImageUrl,
				isAdmin: false,
				roomId: null,
			};
		},
		computed: {
			...mapGetters({
				getScore: GET_SCORE,
				customSocketId: GET_SOCKET_CUTOM_ID,
				usernName: GET_NAME,
			}),
			players() {
				let scores = [];
				if (this.getScore[this.roomId] !== "undefined") {
					for (const player in this.getScore[this.roomId]["scores"]) {
						if (
							player === this.customSocketId &&
							this.getScore[this.roomId]["scores"][player]["name"] ===
								this.userName
						) {
							scores.push({
								name: this.getScore[this.roomId]["scores"][player][
									"name"
								],
								score: this.getScore[this.roomId]["scores"][player][
									"score"
								],
								isUser: true,
							});
						} else {
							scores.push(
								this.getScore[this.roomId]["scores"][player]
							);
						}
					}
				}
				return scores;
			},
		},
		mounted() {
			this.roomId = this.$route.params.id;
			this.socketConnection();
			this.listenToSocketEvents();
			console.log(this.getScore);
			console.log(this.players);
		},
		methods: {
			startGame() {
				this.setGame({
					roomId: this.roomId,
				});
				if (this.isAdmin) {
					this.$socket.emit(events.START_GAME);
					this.$socket.emit(events.GET_PLAYERS);
				}
				this.$router.push({ path: `/room/${this.roomId}/canvas` });
			},
			socketConnection() {
				this.$socket.on("connect", () => {
					console.log(this.$socket.id);
					this.$socket.emit(events.SET_CUSTOM_CLIENT_ID, {
						id: this.$socket.id,
						customId: this.customSocketId,
					});
					this.$socket.emit(events.GET_ROOM_PLAYERS, { id: this.roomId });
				});
			},
			listenToSocketEvents() {
				this.$socket.on(events.START_GAME, () => {
					this.startGame();
				});
			},
		},
	};
</script>

<style scoped>
	.container {
		height: 100vh;
		width: 100vw;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-flex-direction: row;
		-ms-flex-direction: row;
		flex-direction: row;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
	.main-content {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		height: 90vh;
		width: 90vw;
		overflow: scroll;
		border: 4px rgba(29, 29, 27, 0.15) solid;
		box-shadow: inset 0px 2px 0px 0px rgba(255, 255, 255, 0.15),
			0px 3px 0px 0px rgba(255, 255, 255, 0.15);
		border-radius: 12px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.users-wrapper {
		flex-basis: 100%;
		margin: 20px;
		padding: 10px 0;
		background-color: rgba(80, 24, 81, 0.25);
	}

	.rank {
		color: #fff;
	}

	.users-list {
		margin-top: 30px;
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.users-list .user {
		width: 80%;
		border: 4px rgba(29, 29, 27, 0.15) solid;
		border-bottom: none;
		color: #fff;
		font-weight: 700;
	}

	.users-list .user:last-child {
		padding-bottom: 4px;
		border-bottom: 4px rgba(29, 29, 27, 0.15) solid;
	}

	.start-btn {
		display: inline-block;
		background-color: #fff;
		margin: 10px auto;
		box-shadow: 0px 6px 0px 0px #301a6b;
		border-radius: 7px;
		padding: 8px 12px;
		color: #301a6b;
		font-weight: 700;
		text-transform: uppercase;
	}

	.start-btn:hover {
		cursor: pointer;
	}

	.start-btn:active {
		transform: translateY(5px);
	}

	@media (min-width: 768px) {
	}

	@media (min-width: 992px) {
	}
</style>