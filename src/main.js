import Vue from 'vue'
import App from './App.vue'

import './init.js'
import "normalize.css/normalize.css";

import router from '@/router/routes.js'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
