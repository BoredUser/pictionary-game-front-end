<template>
	<div
		class="container"
		:style="{ backgroundImage: `url(${backgroundImageUrl})` }"
	>
		<div class="main-content">
			<div class="users-wrapper">
				<h3>Scores</h3>
				<h3 class="rank">{{ userIndex }}/{{players.length}}</h3>
				<ul class="users-list">
					<li
						v-for="(player, index) in players"
						:key="index"
						class="user"
					>
						<p
							:class="{
								isUser: player.isUser,
								isFirst: index + 1 === 1,
							}"
						>
							{{ index + 1 }} - {{ player.name }} :
							{{ player.score }}
						</p>
					</li>
				</ul>

				<button @click="toRooms" class="start-btn">Go Home</button>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import backgroundImageUrl from "@/assets/img/textura.png";
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
				userName: GET_NAME,
			}),
			players() {
				let scores = [];
				if (this.getScore[this.roomId]) {
					for (const player in this.getScore[this.roomId]) {
						if (
							player === this.customSocketId &&
							this.getScore[this.roomId][player]["name"] ==
								this.userName
						) {
							scores.push({
								name: this.getScore[this.roomId][player]["name"],
								score: this.getScore[this.roomId][player]["score"],
								isUser: true,
							});
						} else {
							scores.push(this.getScore[this.roomId][player]);
						}
					}
				}
				scores.sort(function (a, b) {
					return b.score - a.score;
				});
				scores;

				console.log("sorted", scores);
				return scores;
			},
			userIndex() {
				const index = this.players.map((o) => o.isUser).indexOf(true);
				return index + 1;
			},
		},
		mounted() {
			this.roomId = this.$route.params.id;
			console.log(this.getScore);
			console.log(this.players);
		},
		methods: {
			toRooms() {
				this.$router.push({ name: "Rooms" });
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

	.isUser {
		color: orange;
	}

	.isFirst {
		color: #5cffb6;
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