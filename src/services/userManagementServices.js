import axios from "axios";
import AppConfig from "@/config";

const { apiBaseUrl } = AppConfig;

const userLogin = async (email, password) => {
	const response = await axios.post(`${apiBaseUrl}/auth/login`, {
		email: email,
		password: password,
	});
	return response.data;
};

const registerUser = async (name, email, password) => {
	const response = await axios.post(`${apiBaseUrl}/auth/register`, {
		userName: name,
		email: email,
		password: password,
	});
	return response.data;
};

export { userLogin, registerUser };
