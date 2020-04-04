import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import anotherStore from './another-store';

createApp(App).use(store).mount('#app');

createApp(App).use(anotherStore).mount('#app');
