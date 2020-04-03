import Vue from 'vue';
import App from './App.vue';

new Vue({
  myOption: 'hello!',
  render: h => h(App),
}).$mount('#app');
