import { GET_GAME, GET_NAME, GET_SOCKET_CUTOM_ID, GET_SCORE } from "../getter.type";
import { SET_GAME, SET_NAME, SET_SOCKET_CUTOM_ID, SET_SCORE } from "../mutation.type";

const getDefaultState = () => {
	return {
		data: null,
		name: null,
		socketCustomId: null,
		score: null
	};
};

const getters = {
	[GET_GAME](state) {
		return state.data;
	},
	[GET_NAME](state) {
		return state.name;
	},
	[GET_SOCKET_CUTOM_ID](state) {
		return state.socketCustomId;
	},
	[GET_SCORE](state) {
		return state.score;
	}
};

const mutations = {
	[SET_GAME](state, data) {
		state.data = data;
	},
	[SET_NAME](state, data) {
		state.name = data;
	},
	[SET_SOCKET_CUTOM_ID](state, data) {
		state.socketCustomId = data;
	},
	[SET_SCORE](state, data) {
		state.score = data;
	}
};

export function createGameStore() {
	return {
		state: getDefaultState(),
		mutations,
		getters,
	};
}
