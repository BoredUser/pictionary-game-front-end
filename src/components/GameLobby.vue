<template>
	<div
		class="container"
		:style="{ backgroundImage: `url(${backgroundImageUrl})` }"
	>
		<div class="main-content">
			<div class="users-wrapper">
				<h3>Joined Users</h3>

				<ul class="users-list">
					<li class="user"><p class="game-name">Game Name</p></li>
					<li class="user"><p class="game-name">Game Name</p></li>
					<li class="user"><p class="game-name">Game Name</p></li>
					<li class="user"><p class="game-name">Game Name</p></li>
					<li class="user"><p class="game-name">Game Name</p></li>
					<li class="user"><p class="game-name">Game Name</p></li>
				</ul>

				<button class="start-btn">Start Game</button>
			</div>
		</div>
	</div>
</template>

<script>
	import backgroundImageUrl from "@/assets/img/textura.png";

	export default {
		name: "GameLobby",
		data() {
			return {
				backgroundImageUrl,
			};
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

	.users-list {
		margin-top: 30px;
		list-style: none;
		padding: 0;	
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.users-list .user{
		width: 80%;
		border: 4px rgba(29, 29, 27, 0.15) solid;
		border-bottom: none;
		color: #fff;
        font-weight: 700;
	}

	.users-list .user:last-child{
		padding-bottom: 4px;
		border-bottom:4px rgba(29, 29, 27, 0.15) solid;
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