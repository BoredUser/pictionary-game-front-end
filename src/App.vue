<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: "App"
	};
</script>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap");

	* {
		box-sizing: border-box;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	*::-webkit-scrollbar {
		display: none;
	}

	#app {
		font-family: "Nunito", sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;

		height: 100vh;
		width: 100vw;

		background: linear-gradient(
			200deg,
			rgba(92, 30, 166, 1) 0%,
			rgba(200, 67, 94, 1) 100%
		);
		background-image: linear-gradient(
			200deg,
			rgb(92, 30, 166) 0%,
			rgb(200, 67, 94) 100%
		);
		background-position-x: initial;
		background-position-y: initial;
		background-size: initial;
		background-attachment: initial;
		background-origin: initial;
		background-clip: initial;
		background-color: initial;
	}



  h3{
    font-size: 1.1rem;
    font-weight: 900;
    text-transform: uppercase;
    border-radius: 10px 10px 0 0;
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
</style>
