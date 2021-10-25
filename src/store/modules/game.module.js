import { GET_GAME } from '../getter.type'
import { SET_GAME } from '../mutation.type'


const getDefaultState = () => {
	return {
			data: null
	};
};

const getters = {
	[GET_GAME](state) {
			return state.data;
	}
};


const mutations = {
	[SET_GAME](state, data ) {
			state.data = data;
	}
};


export function createGameStore() {
	return {
			state: getDefaultState(),
			mutations,
			getters
	};
}
