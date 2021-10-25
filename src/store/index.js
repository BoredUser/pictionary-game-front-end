import Vue from "vue";
import Vuex from "vuex";
import { createGameStore } from './modules/game.module'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    game: createGameStore()
  },
});
