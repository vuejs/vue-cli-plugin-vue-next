import { createApp, h } from 'vue';
import App from './App.vue';

createApp({
  myOption: 'hello!',
  render: () => h(App),
}).mount('#app');
