<template>
	<div class="canvas-container">
		<canvas
			class="canvas"
			width="560"
			height="360"
			ref="canvas"
			@mousemove="draw"
			@mousedown="beginDrawing"
			@touchstart="beginDrawing"
			@touchmouve="draw"
			@touchend="stopDrawing"
			@mouseup="stopDrawing"
			@mouseleave="cancelDrawing"
		/>
		<button @click="clearCanvas">Clear</button>
		<input type="text" v-model="word" />
		<button @click="answer">Send</button>
		<div class="brush-size-slider">
			<input type="range" min="1" max="30" v-model="brushSize" />
		</div>
	</div>
</template>

<script>
	export default {
		name: "Canvas",

		data() {
			return {
				socket: null,
				x: 0,
				y: 0,
				canvasWidth: 0,
				canvasHeight: 0,
				isDrawing: false,
				connection: "connecting",
				word: "",
				brushSize: 10,
			};
		},
		methods: {
			drawLine(x1, y1, x2, y2) {
				let ctx = this.$refs.canvas.getContext("2d");
				ctx.beginPath();
				ctx.strokeStyle = "black";
				ctx.lineWidth = 7;
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
					this.socket.emit("drawing", {
						room: "TEST",
						data: this.$refs.canvas.toDataURL("image/png"),
						action: "draw",
					});
				}
			},
			cancelDrawing() {
				this.isDrawing = false;
				this.socket.emit("drawing", {
					room: "TEST",
					data: this.$refs.canvas.toDataURL("image/png"),
					action: "draw",
				});
			},
			drawUpdate(url) {
				let image = new Image();
				let ctx = this.$refs.canvas.getContext("2d");
				image.onload = () => {
					ctx.drawImage(image, 0, 0);
				};
				image.src = url;
			},
			handleResize() {
				let state = this.$refs.canvas.toDataURL("image/png");
				this.canvasWidth = window.innerWidth;
				this.canvasHeight = window.innerHeight - 25;
				this.drawUpdate(state);
			},
			setConnected() {
				this.connection = "connected";
				console.log("connected");
			},
			clearCanvas() {
				this.isDrawing = false;
				let ctx = this.$refs.canvas.getContext("2d");
				ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
				this.socket.emit("drawing", {
					room: "TEST",
					data: null,
					action: "clear",
				});
			},
			clearCanvasRemote() {
				this.isDrawing = false;
				let ctx = this.$refs.canvas.getContext("2d");
				ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			},
			answer() {
				console.log(this.word.length);
				if (this.word.length > 0) {
					this.socket.emit("checkAnswer", {
						room: "TEST",
						data: this.word,
						userId: "User1",
					});
				}
			},
		},
		mounted() {
			const io = require("socket.io-client");
			this.socket = io("http://localhost:3000");
			this.socket.emit("join-room", "TEST");
			this.socket.on("drawing", this.drawUpdate);
			this.socket.on("joined", this.setConnected);
			this.socket.on("clear", this.clearCanvasRemote);
			this.handleResize();
			window.addEventListener("resize", this.handleResize);
		},
	};
</script>

<style scoped>
	.canvas-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.canvas-container > * {
		margin: 10px 0;
	}

	.canvas {
		border: 1px solid grey;
	}
</style>