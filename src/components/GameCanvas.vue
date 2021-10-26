<template>
	<div
		class="container"
		:style="{ backgroundImage: `url(${backgroundImageUrl})` }"
	>
		<div class="main-content">
			<div class="choose-words-container" v-if="words.length > 0">
				<p>Choose a word</p>
				<div class="button-container">
					<button
						v-for="(word, index) in words"
						:key="index"
						@click="chooseWord(word)"
					>
						{{ word }}
					</button>
				</div>
			</div>
			<div class="choose-words-container" v-else-if="playerChoosing">
				<h1>{{ playerChoosing.name }} is choosing a word</h1>
			</div>
			<div class="canvas-wrapper">
				<div class="canvas">
					<h3 v-if="isChooser">
						Drawing: <span class="draw-word">{{ word }}</span>
					</h3>
					<h3 v-else>
						{{ currentDrawer }} is Drawing:
						<span class="draw-word">{{ word }}</span>
					</h3>
					<div class="canvas-controls-container">
						<div class="colors-palette" v-if="isChooser">
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
								v-if="isChooser"
							></i>
							<i
								class="fas fa-pencil-alt control-icon"
								@click="eraserActive = false"
								v-if="isChooser"
							></i>
							<i
								class="fas fa-backward control-icon"
								@click="clearCanvas"
								v-if="isChooser"
							></i>
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
				<div class="time-container">
					<h3>Remaining Time</h3>
					<p class="time">
						<span class="min">{{ remainingMinutes }}</span
						>:
						<span class="sec">{{ remainingSeconds }}</span>
					</p>
				</div>
				<div class="messages">
					<h3>Messages</h3>
					<ul class="sent-messages">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
					</ul>
					<div class="send-message">
						<div class="form-group" v-if="!isChooser">
							<input
								type="text"
								placeholder=""
								v-model="message"
							/>
							<button class="send-btn">Send</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import backgroundImageUrl from "@/assets/img/textura.png";
	import { mapGetters } from "vuex";
	import { GET_GAME } from "../store/getter.type";
	import { events } from "../utils/constants";
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
				message: null,
				// Data from clone
				word: "Test",
				remainingTime: 0,
				timeInterval: 40000,
				words: [],
				playerChoosing: null,
				disableCanvas: false,
				hints: [],
				timer: null,
				isChooser: false,
				gameEnded: false,
				currentDrawer: "",
			};
		},
		computed: {
			...mapGetters({
				game: GET_GAME,
			}),
			remainingMinutes() {
				return Math.floor(this.remainingTime / 60000);
			},
			remainingSeconds() {
				return this.remainingTime / 1000 - this.remainingMinutes * 60;
			},
		},
		mounted() {
			if (!this.game) {
				this.$router.push("/");
				return;
			}
			this.handleSocketEvents();
			this.handleResize();
			window.addEventListener("resize", this.handleResize);
		},
		methods: {
			countdown() {
				if (this.remainingTime <= 0) {
					clearInterval(this.timer);
					// doSomething();
				} else {
					this.remainingTime = this.remainingTime - 1000;
					// elem.innerHTML = timeLeft + " seconds remaining";
					for (let i = 0; i < this.hints.length; i++) {
						if (
							this.remainingTime / 1000 >=
								this.hints[i].displayTime &&
							!this.isChooser
						) {
							this.word = this.hints[i].hint;
							break;
						}
					}
				}
			},
			startTimer() {
				clearInterval(this.timer);
				this.timer = setInterval(this.countdown, 1000);
			},
			chooseWord(word) {
				this.$socket.emit(events.CHOOSE_WORD, { word });
				this.word = word;
				this.words = [];
			},
			handleSocketEvents() {
				this.$socket.on(events.DRAWING, (data) => {
					console.log("DRAWING");
					this.drawUpdate(data);
				});
				this.$socket.on(events.CLEAR_CANVAS, (data) => {
					console.log(data, "CLEAR_CANVAS");
					this.clearCanvasRemote();
				});
				this.$socket.on(events.CHOOSING_WORD, (data) => {
					this.isChooser = false;
					// console.log(data)
					this.words = [];
					this.playerChoosing = data;
					this.currentDrawer = data.name;
				});

				this.$socket.on(events.CHOOSE_WORD, (data) => {
					this.isChooser = true;
					this.playerChoosing = null;
					this.words = data;
				});

				this.$socket.on(events.START_TIMER, (data) => {
					console.log(data, "START_TIMER");
					this.timeInterval = data.time;
					this.remainingTime = data.time;
					this.startTimer();
				});

				this.$socket.on(events.HIDE_WORD, (data) => {
					console.log(data, "HIDE_WORD");
					this.word = data.word;
				});

				this.$socket.on(events.HINTS, (data) => {
					console.log(data, "HINTS");
					this.words = [];
					this.playerChoosing = null;
					this.hints = data;
				});

				this.$socket.on(events.END_GAME, () => {
					console.log("END_GAME");
					this.gameEnded = true;
				});
			},

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
				if (this.isChooser) {
					this.isDrawing = true;
				}
			},
			stopDrawing(e) {
				if (this.isDrawing) {
					this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
					this.isDrawing = false;
					this.image = this.$refs.paintBoard.toDataURL("image/png");
					this.$socket.emit(
						events.DRAWING,
						this.$refs.paintBoard.toDataURL("image/png")
					);
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
				if (this.isChooser){
					this.$socket.emit(events.CLEAR_CANVAS);
				}
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
	.choose-words-container {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(128, 128, 128, 0.8);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: white;
	}

	.choose-words-container button {
		padding: 20px 40px;
	}

	.canvas-wrapper {
		flex-basis: 100%;
		flex-grow: 1;
	}

	.messages-wrapper {
		flex-basis: 100%;
		flex-grow: 1;
		display: flex;
		flex-flow: column;
	}

	.canvas {
		margin: 20px;
		border-radius: 12px;
		border: 4px rgba(29, 29, 27, 0.15) solid;
	}

	.messages {
		margin: 20px;
		border-radius: 12px;
		border: 4px rgba(29, 29, 27, 0.15) solid;
		flex-grow: 1;
		flex-shrink: 1;
		flex-basis: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.draw-word {
		color: #fff;
	}

	.canvas-controls-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.colors-palette {
		order: 2;
		flex-basis: 100%;
		border-radius: 12px;
		border: 4px rgba(29, 29, 27, 0.15) solid;
		background-color: rgba(80, 24, 81, 0.25);
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		margin: 20px 0;
	}

	.board {
		order: 1;
		flex-basis: 70%;
		border-radius: 12px;
		border: 4px rgba(29, 29, 27, 0.15) solid;
		margin: 20px 0;
		min-height: 300px;
		min-width: 300px;
	}

	.controls {
		order: 3;
		flex-basis: 100%;
		border-radius: 12px;
		border: 4px rgba(29, 29, 27, 0.15) solid;
		background-color: rgba(80, 24, 81, 0.25);
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 20px 0;
	}

	.controls * {
		margin: 10px 0;
	}

	.canvas-board {
		border-radius: 12px;
		background-color: #fff;
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
		flex-basis: 15%;
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
		flex-basis: 100%;
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
		font-size: 2em;
		color: #fff;
		margin: auto;
		cursor: pointer;
	}

	.form-group input {
		border-radius: 7px;
		padding: 8px 10px;
		margin-right: 10px;
	}

	.time {
		font-size: 1.1rem;
		font-weight: 900;
		text-transform: uppercase;
		border-radius: 10px 10px 0 0;
		color: #fff;
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

	.time * {
		margin: 0 10px;
	}

	.send-btn {
		background-color: #fff;
		margin: 10px auto;
		border-radius: 7px;
		padding: 8px 12px;
		color: #301a6b;
		font-weight: 700;
		text-transform: uppercase;
	}

	.send-btn:hover {
		cursor: pointer;
	}

	.send-btn:active {
		transform: translateY(5px);
	}

	.sent-messages {
		height: 300px;
		overflow: scroll;
		border-radius: 12px;
		border: 4px rgba(29, 29, 27, 0.15) solid;
		margin: 10px;
	}

	@media (min-width: 768px) {
		.canvas-wrapper {
			flex-basis: 70%;
		}

		.messages-wrapper {
			flex-basis: 30%;
		}

		.colors-palette {
			order: 1;
			flex-basis: 13%;
		}

		.board {
			order: 2;
			flex-basis: 70%;
			min-height: 400px;
		}

		.controls {
			flex-basis: 13%;
			flex-direction: column;
		}

		.palette-container .color {
			flex-basis: 30%;
		}

		.palette-container .selected-color {
			display: block;
		}
	}

	@media (min-width: 992px) {
	}
</style>