<template>
	<div
		class="container"
		:style="{ backgroundImage: `url(${backgroundImageUrl})` }"
	>
		<div class="main-content">
			<div class="canvas-wrapper">
				<div class="canvas">
					<h3>Drawing: <span class="draw-word">Word</span></h3>
					<div class="canvas-controls-container">
						<div class="colors-palette">
							<div class="palette-container">
								<div
									class="color"
									v-for="color in colorsPalette"
									:key="color"
									:style="{ backgroundColor: color }"
									@click="selectedColor = color"
								></div>
								<div
									class="selected-color"
									:style="{ backgroundColor: selectedColor }"
								></div>
								<div class="brush-size-slider">
									<label for="brush-size">Brush Size</label>
									<input
										name="brush-size"
										type="range"
										min="1"
										max="50"
										v-model="brushSize"
									/>
									<p>{{ brushSize }} px</p>
								</div>
							</div>
						</div>
						<div class="board" ref="canvasParent">
							<canvas
								class="canvas-board"
								ref="paintBoard"
								:width="canvasWidth"
								:height="canvasHeight"
								@mousemove="draw"
								@mousedown="beginDrawing"
								@mouseup="stopDrawing"
								@mouseleave="cancelDrawing"
							/>
						</div>
						<div class="controls">
							<i
								class="fas fa-eraser control-icon"
								@click="eraserActive = true"
							></i>
							<i
								class="fas fa-pencil-alt control-icon"
								@click="eraserActive = false"
							></i>
							<i class="fas fa-backward control-icon" @click="clearCanvas"></i>
							<a
								class="control-icon"
								:href="image"
								download="image.png"
								><i class="fas fa-download"></i
							></a>
						</div>
					</div>
				</div>
			</div>
			<div class="messages-wrapper">
				<div class="messages"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import backgroundImageUrl from "@/assets/img/textura.png";

	export default {
		name: "GameCanvas",
		data() {
			return {
				backgroundImageUrl,
				colorsPalette: [
					"black",
					"silver",
					"gray",
					"maroon",
					"red",
					"crimson",
					"purple",
					"deeppink",
					"fuchsia",
					"green",
					"lime",
					"olive",
					"yellow",
					"orange",
					"navy",
					"blue",
					"teal",
					"aqua",
				],
				selectedColor: "black",
				brushSize: 10,
				x: 0,
				y: 0,
				canvasWidth: 0,
				canvasHeight: 0,
				isDrawing: false,
				eraserActive: false,
				image: null,
			};
		},
		methods: {
			drawLine(x1, y1, x2, y2) {
				let ctx = this.$refs.paintBoard.getContext("2d");
				if (this.eraserActive) {
					ctx.globalCompositeOperation = "destination-out";
				} else {
					ctx.globalCompositeOperation = "source-over";
				}
				ctx.beginPath();
				ctx.strokeStyle = this.selectedColor;
				ctx.lineWidth = this.brushSize;
				ctx.lineCap = "round";
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();
				ctx.closePath();
			},
			draw(e) {
				if (this.isDrawing) {
					this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
					this.x = e.offsetX;
					this.y = e.offsetY;
				}
			},
			beginDrawing(e) {
				this.x = e.offsetX;
				this.y = e.offsetY;
				this.isDrawing = true;
			},
			stopDrawing(e) {
				if (this.isDrawing) {
					this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
					this.isDrawing = false;
					this.image = this.$refs.paintBoard.toDataURL("image/png");
				}
			},
			cancelDrawing() {
				this.isDrawing = false;
			},
			drawUpdate(url) {
				let image = new Image();
				let ctx = this.$refs.paintBoard.getContext("2d");
				image.onload = () => {
					ctx.drawImage(image, 0, 0);
				};
				image.src = url;
			},
			setConnected() {
				this.connection = "connected";
				console.log("connected");
			},
			clearCanvas() {
				this.isDrawing = false;
				let ctx = this.$refs.paintBoard.getContext("2d");
				ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
				this.image = this.$refs.paintBoard.toDataURL("image/png");
			},
			clearCanvasRemote() {
				this.isDrawing = false;
				let ctx = this.$refs.paintBoard.getContext("2d");
				ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			},
			handleResize() {
				let state = this.$refs.paintBoard.toDataURL("image/png");
				this.canvasWidth = this.$refs.canvasParent.clientWidth;
				this.canvasHeight = this.$refs.canvasParent.clientHeight;
				this.drawUpdate(state);
			},
		},
		mounted() {
			this.handleResize();
			window.addEventListener("resize", this.handleResize);
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

	.canvas-wrapper {
		flex-basis: 100%;
		height: 550px;
	}

	.messages-wrapper {
		flex-basis: 100%;
		height: 550px;
	}

	.canvas {
		margin: 20px;
		height: 100%;
		border-radius: 12px;
		border: 4px rgba(29, 29, 27, 0.15) solid;
	}

	.messages {
		margin: 20px;
		height: 100%;
		border-radius: 12px;
		border: 4px rgba(29, 29, 27, 0.15) solid;
	}

	.draw-word {
		color: #fff;
	}

	.canvas-controls-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		height: 450px;
	}

	.colors-palette {
		flex-basis: 13%;
		border-radius: 12px;
		border: 4px rgba(29, 29, 27, 0.15) solid;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
	}

	.board {
		flex-basis: 70%;
		border-radius: 12px;
		border: 4px rgba(29, 29, 27, 0.15) solid;
	}

	.controls {
		flex-basis: 13%;
		border-radius: 12px;
		border: 4px rgba(29, 29, 27, 0.15) solid;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
	}

	.canvas-board {
		border-radius: 12px;
		background-color: #fff;
	}

	.colors-palette {
		background-color: rgba(80, 24, 81, 0.25);
	}

	.palette-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 90%;
		margin: auto;
	}

	.palette-container .color {
		flex-basis: 30%;
		height: 25px;
		border-radius: 2px;
		border: 2px #000 solid;
		margin: 5px 0;
	}

	.palette-container .selected-color {
		flex-basis: 100%;
		height: 40px;
		border-radius: 2px;
		border: 2px #000 solid;
		margin: 10px 0;
		display: none;
	}

	.palette-container .brush-size-slider {
		margin: 20px 0;
		color: #fff;
	}

	.palette-container .brush-size-slider * {
		padding: 0;
		margin: 5px 0;
	}

	.palette-container .brush-size-slider input {
		width: 100%;
	}

	.control-icon {
		flex-basis: 100%;
		font-size: 2em;
		color: #fff;
		margin: auto;
		cursor: pointer;
	}

	@media (min-width: 768px) {
		.canvas-wrapper {
			flex-basis: 70%;
		}

		.messages-wrapper {
			flex-basis: 30%;
		}

		.palette-container .selected-color {
			display: block;
		}
	}

	@media (min-width: 992px) {
	}
</style>