<template>
	<div
		class="container"
		:style="{ backgroundImage: `url(${backgroundImageUrl})` }"
	>
		<div class="main-content">
			<div class="login-wrapper">
				<div class="logintabs">
					<div class="tabs">
						<input
							type="radio"
							name="tabs"
							id="tabone"
							checked="checked"
						/>
						<label for="tabone">ANONYMOUS</label>
						<div class="tab">
							<div class="tab-content">
								<p>Choose a Nickname</p>
								<input
									type="text"
									placeholder="CoolNickname"
									v-model="nickName"
								/>
								<button
									@click="anonymousLogin"
									class="start-btn"
								>
									LOGIN
								</button>
							</div>
						</div>

						<input type="radio" name="tabs" id="tabtwo" />
						<label for="tabtwo">LOGIN</label>
						<div class="tab">
							<div class="tab-content">
								<div class="form-group">
									<p>Email</p>
									<input
										type="userName"
										v-model="userEmail"
									/>
								</div>
								<div class="form-group">
									<p>Password</p>
									<input type="password" v-model="password" />
								</div>
								<button @click="login" class="start-btn">
									LOGIN
								</button>
							</div>
						</div>

						<input type="radio" name="tabs" id="tabthree" />
						<label for="tabthree">REGISTER</label>
						<div class="tab">
							<div class="tab-content">
								<div class="register-form">
									<div class="form-group">
										<p>UserName</p>
										<input
											type="userName"
											placeholder="CoolNickname"
											v-model="registerUserName"
										/>
									</div>
									<div class="form-group">
										<p>Email</p>
										<input
											type="email"
											v-model="registerUserEmail"
										/>
									</div>
									<div class="form-group">
										<p>Password</p>
										<input
											type="password"
											v-model="registerPassword"
										/>
									</div>
									<div class="form-group">
										<p>Confirm Password</p>
										<input
											type="password"
											v-model="registerConfirmPassword"
										/>
									</div>
									<button
										@click="validatAndRegisterUser"
										class="start-btn"
									>
										Register
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="instructions-wrapper">
				<div class="instructions">
					<h3>How to play?</h3>
					<ul class="instructions-dots">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { nanoid } from "nanoid";
	import backgroundImageUrl from "@/assets/img/textura.png";
	import { mapMutations } from "vuex";
	import { registerUser, userLogin } from "@/services/userManagementServices.js";
	import { SET_NAME, SET_SOCKET_CUTOM_ID } from "../store/mutation.type";
	export default {
		name: "GameHome",
		data() {
			return {
				backgroundImageUrl,
				nickName: "",
				userEmail: "",
				password: "",
				registerUserName: "",
				registerPassword: "",
				registerConfirmPassword: "",
				registerUserEmail: "",
				/* eslint-disable */
				emailReg:
					/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
				passwordReg: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])/,
				/* eslint-enable */
			};
		},
		mounted() {},
		methods: {
			...mapMutations({
				setName: SET_NAME,
				setCustomSocketId: SET_SOCKET_CUTOM_ID,
			}),
			async registerUser() {
				try {
					const data = await registerUser(
						this.registerUserName,
						this.registerUserEmail,
						this.registerPassword
					);
					console.log(data);
				} catch (err) {
					//TODO: Alert
					console.log("Error while registration");
				}
			},
			async login() {
				if (this.userEmail !== "") {
					if (this.password !== "") {
						try {
							const data = await userLogin(
								this.userEmail,
								this.password
							);
							console.log(data);
							this.setCustomSocketId(nanoid(10));
							this.setName(data.userName);
							this.$router.push({ name: "Rooms" });
						} catch (err) {
							//TODO: Alert
							console.log("Invalid Password");
						}
					} else {
						//TODO: Alert
						console.log("Invalid Password");
					}
				} else {
					//TODO: Alert
					console.log("Invalid Email");
				}
			},
			validatAndRegisterUser() {
				if (this.registerUserName !== "") {
					if (
						this.registerUserEmail != "" &&
						this.emailReg.test(this.registerUserEmail)
					) {
						if (
							this.registerPassword != null &&
							this.passwordReg.test(this.registerPassword)
						) {
							if (
								this.registerPassword ===
								this.registerConfirmPassword
							) {
								this.registerUser();
							} else {
								//TODO: Alert
								console.log("Passwords dont match");
							}
						} else {
							//TODO: Alert
							console.log("Invalid Password");
						}
					} else {
						//TODO: Alert
						console.log("Invalid Email");
					}
				} else {
					//TODO: Alert
					this.$toasted.show("Invalid Username");
					console.log("Invalid Username");
				}
			},
			anonymousLogin() {
				if (this.nickName !== "") {
					this.setCustomSocketId(localStorage.getItem("customId"));
					this.setName(this.nickName);
					this.$router.push({ name: "Rooms" });
				} else {
					this.$toasted.error("Invalid Username");
				}
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

	.login-wrapper {
		flex-basis: 100%;
		height: 450px;
	}

	.instructions-wrapper {
		flex-basis: 100%;
		height: 450px;
	}

	.logintabs {
		margin: 20px;
		height: 100%;
		border-radius: 12px;
	}

	.instructions {
		margin: 20px;
		height: 100%;
		border: 4px rgba(29, 29, 27, 0.15) solid;
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
		height: 400px;
		display: none;
		background-color: rgba(80, 24, 81, 0.25);
		margin-top: 5px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 0 12px 12px 12px;
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
		padding: 20px 0;
		overflow: scroll;
	}
	.tab .tab-content .form-group {
		margin-bottom: 20px;
	}
	.tab .tab-content p {
		text-transform: uppercase;
		color: #fff;
		font-weight: 700;
		margin-bottom: 10px;
	}

	.tab input {
		align-self: center;
		outline: none;
		background-color: rgba(255, 255, 255, 0.3);
		border: 2px solid rgba(255, 255, 255, 0.7);
		border-radius: 7px;
		font-size: 1.2em;
		color: rgba(255, 255, 255, 0.8);
		padding: 8px 12px;
		width: 300px;
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
		display: block;
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
		.tabs > label {
			padding: 1rem 2rem;
			font-size: 0.8em;
		}
		.login-wrapper {
			flex-basis: 60%;
			height: 450px;
		}

		.instructions-wrapper {
			flex-basis: 40%;
			height: 450px;
		}
	}

	@media (min-width: 992px) {
		.tabs > label {
			padding: 1rem 3rem;
			font-size: 1em;
		}
	}
</style>