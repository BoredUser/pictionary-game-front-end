<template>
	<div
		class="container"
		:style="{ backgroundImage: `url(${backgroundImageUrl})` }"
	>
		<div class="main-content">
			<div class="private-game-wrapper">
				<div class="gametabs">
					<div class="tabs">
						<input
							type="radio"
							name="tabs"
							id="tabone"
							checked="checked"
						/>
						<label for="tabone">Public Games</label>
						<div class="tab">
							<div class="tab-content">
								<ul
									class="games-list"
									v-if="publicGames.length > 0"
								>
									<li
										v-for="game in publicGames"
										:key="game.gameName"
									>
										<p class="game-name">
											{{ game.gameName }}
										</p>
										<button
											@click="joinRoom(game.key)"
											class="start-btn"
										>
											JOIN
										</button>
									</li>
								</ul>
							</div>
						</div>
						<input type="radio" name="tabs" id="tabtwo" />
						<label for="tabtwo">Private Game</label>
						<div class="tab">
							<div class="tab-content">
								<div class="form-group">
									<p>Game Id</p>
									<input type="text" v-model="gameId" />
								</div>
								<button
									@click="joinPrivateRoom"
									class="start-btn"
								>
									JOIN
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="create-game-wrapper">
				<div class="create-game-form">
					<h3>Create Game</h3>
					<div class="form-group">
						<p>Game Name</p>
						<input
							placeholder="GameName"
							type="text"
							v-model="gameName"
						/>
					</div>
					<div class="form-group">
						<p>Time per Round</p>
						<input
							placeholder="In Seconds"
							type="number"
							v-model.number="gameTime"
						/>
					</div>
					<div class="form-group">
						<p>Number of Rounds</p>
						<input type="number" v-model.number="gameRounds" />
					</div>
					<div class="form-group">
						<label>Private Game</label>
						<input
							class="checkbox"
							type="checkbox"
							v-model="createPrivateGame"
						/>
					</div>

					<button @click="createGame" class="start-btn">
						Create
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import backgroundImageUrl from "@/assets/img/textura.png";
	import { events } from "../utils/constants";
	import { GET_NAME, GET_SOCKET_CUTOM_ID } from "../store/getter.type";
	export default {
		name: "GameRooms",
		data() {
			return {
				backgroundImageUrl,
				gameId: "",
				gameTime: "",
				gameRounds: "",
				gamePassword: "",
				createPrivateGame: false,
				gameName: "",
				publicGames: () => [],
			};
		},
		computed: {
			...mapGetters({
				usernName: GET_NAME,
				customSocketId: GET_SOCKET_CUTOM_ID,
			}),
		},
		mounted() {
			this.listenToSocketEvents();
			this.$socket.emit(events.GET_ROOMS, {
				id: this.$socket.id,
			});
		},
		methods: {
			createGame() {
				if (
					this.gameName !== "" &&
					this.gameRounds > 0 &&
					this.gameTime > 30
				) {
					if (
						this.gameTime > 30
					) {
						this.$socket.emit(events.CREATE_ROOM, {
							rounds: this.gameRounds,
							time: this.gameTime,
							id: this.customSocketId,
							name: this.usernName,
							type: this.createPrivateGame,
							gameName: this.gameName,
						});
					} else {
						this.$toasted.error(
							"Game time should be greater than 30 seconds",
							{
								theme: "bubble",
								position: "top-center",
								duration: 2000,
								className: "toaster-class",
							}
						);
					}
				} else {
					this.$toasted.error("Invalid Details", {
						theme: "bubble",
						position: "top-center",
						duration: 2000,
						className: "toaster-class",
					});
				}
			},
			joinPrivateRoom() {
				if (this.gameId !== "") {
					this.$socket.emit(events.JOIN_PRIVATE_ROOM, {
						Id: this.gameId,
					});
				} else {
					this.$toasted.error("Invalid GameId", {
						theme: "bubble",
						position: "top-center",
						duration: 2000,
						className: "toaster-class",
					});
				}
			},
			joinRoom(roomId) {
				this.$socket.emit(events.JOIN_ROOM, {
					id: roomId,
					player: {
						id: this.customSocketId,
						name: this.usernName,
					},
				});
				this.$router.push({ path: `/room/${roomId}` });
			},
			listenToSocketEvents() {
				this.$socket.on(events.CREATED_ROOM, (data) => {
					if (data !== "undefined") {
						const gameId = data.gameID;
						this.$router.push({ path: `/room/${gameId}` });
					}
				});
				this.$socket.on(events.GET_ROOMS, (data) => {
					console.log("rooms");
					if (data !== "undefined") {
						this.publicGames = data.games;
						console.log(this.publicGames);
					}
				});
				this.$socket.on(events.JOIN_PRIVATE_ROOM, (data) => {
					console.log("Private Room", data);
					if (data.isAvailable) {
						this.joinRoom(this.gameId);
					} else {
						this.$toasted.error("Invalid GameId", {
							theme: "bubble",
							position: "top-center",
							duration: 2000,
							className: "toaster-class",
						});
					}
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
	.private-game-wrapper {
		flex-basis: 100%;
	}

	.create-game-wrapper {
		flex-basis: 100%;
	}

	.gametabs {
		margin: 20px;
		height: 100%;
		border-radius: 12px;
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
	}

	.tabs > label {
		font-size: 0.7em;
		font-weight: 900;
		order: 1;
		display: block;
		padding: 1rem 1rem;
		margin-right: 0.3rem;
		cursor: pointer;
		border-radius: 10px 10px 0 0;
		color: rgba(255, 255, 255, 0.7);
		background-color: rgba(80, 24, 81, 0.25);
		text-transform: uppercase;
	}

	.tabs .tab {
		order: 2;
		flex-grow: 1;
		width: 100%;
		height: 450px;
		display: none;
		background-color: rgba(80, 24, 81, 0.25);
		margin-top: 5px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.tabs input[type="radio"]:checked + label[for="tabtwo"] + .tab {
		border-top-left-radius: 5px;
	}

	.tabs input[type="radio"] {
		display: none;
	}

	.tabs input[type="radio"] + label {
		margin-bottom: -2px;
		z-index: 1;
	}

	.tabs input[type="radio"]:checked + label {
		color: #5cffb6;
		text-shadow: rgb(23, 5, 87) 3px 0px 0px,
			rgb(23, 5, 87) 2.83487px 0.981584px 0px,
			rgb(23, 5, 87) 2.35766px 1.85511px 0px,
			rgb(23, 5, 87) 1.62091px 2.52441px 0px,
			rgb(23, 5, 87) 0.705713px 2.91581px 0px,
			rgb(23, 5, 87) -0.287171px 2.98622px 0px,
			rgb(23, 5, 87) -1.24844px 2.72789px 0px,
			rgb(23, 5, 87) -2.07227px 2.16926px 0px,
			rgb(23, 5, 87) -2.66798px 1.37182px 0px,
			rgb(23, 5, 87) -2.96998px 0.42336px 0px,
			rgb(23, 5, 87) -2.94502px -0.571704px 0px,
			rgb(23, 5, 87) -2.59586px -1.50383px 0px,
			rgb(23, 5, 87) -1.96093px -2.27041px 0px,
			rgb(23, 5, 87) -1.11013px -2.78704px 0px,
			rgb(23, 5, 87) -0.137119px -2.99686px 0px,
			rgb(23, 5, 87) 0.850987px -2.87677px 0px,
			rgb(23, 5, 87) 1.74541px -2.43999px 0px,
			rgb(23, 5, 87) 2.44769px -1.73459px 0px,
			rgb(23, 5, 87) 2.88051px -0.838247px 0px;
	}

	.tabs input[type="radio"]:checked + label + .tab {
		display: flex;
	}
	.tab .tab-content {
		width: 100%;
		text-align: center;
		overflow: scroll;
	}
	.form-group {
		margin: 20px 0;
	}

	.form-group p,
	label {
		text-transform: uppercase;
		color: #fff;
		font-weight: 700;
		margin-bottom: 10px;
	}

	.form-group input {
		align-self: center;
		outline: none;
		background-color: rgba(255, 255, 255, 0.3);
		border: 2px solid rgba(255, 255, 255, 0.7);
		border-radius: 7px;
		font-size: 1.2em;
		color: rgba(255, 255, 255, 0.8);
		padding: 8px 12px;
		width: 200px;
	}

	.form-group .checkbox {
		margin: 0 10px;
		width: auto;
	}

	.tab input::placeholder {
		border-color: rgb(255, 255, 255);
		color: rgb(255, 255, 255, 0.3);
	}

	.tabs input:focus {
		background-color: rgba(255, 255, 255, 0.1);
		border-color: rgb(255, 255, 255);
		color: rgb(255, 255, 255);
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

	.create-game-form {
		margin: 20px;
		height: 100%;
		border: 4px rgba(29, 29, 27, 0.15) solid;
		border-radius: 12px;
		overflow: scroll;
	}

	.games-list {
		list-style: none;
		padding: 0;
	}

	.games-list .game-name {
		display: inline;
		margin: 10px 20px;
		color: #fff;
		font-weight: 700;
	}

	.games-list .game-name::after {
		content: " :";
	}

	@media (min-width: 768px) {
		.tabs > label {
			padding: 1rem 2rem;
			font-size: 0.8em;
		}

		.private-game-wrapper {
			flex-basis: 60%;
			height: 500px;
		}

		.create-game-wrapper {
			flex-basis: 40%;
			height: 500px;
		}
		.form-group input {
			width: 300px;
		}
	}

	@media (min-width: 992px) {
		.tabs > label {
			padding: 1rem 3rem;
			font-size: 1em;
		}
	}
</style>