import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import vuexstore from './store';

Vue.use(Vuex)

new Vue({
  store: vuexstore,
  render: h => h(App),
}).$mount('#app');
