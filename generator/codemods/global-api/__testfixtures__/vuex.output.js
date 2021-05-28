import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import anotherStore from './another-store';

const app = createApp({}).use(h => h(App));
app.mount('#app');
const app = createApp({}).use(h => h(App));
app.mount('#app');
