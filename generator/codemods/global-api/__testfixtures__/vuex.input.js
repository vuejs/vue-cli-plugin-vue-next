import Vue from 'vue';
import App from './App.vue';
import store from './store';
import anotherStore from './another-store';

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');

new Vue({
  store: anotherStore,
  render: h => h(App),
}).$mount('#app');
