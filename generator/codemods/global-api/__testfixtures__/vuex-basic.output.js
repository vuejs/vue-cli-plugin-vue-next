import { createApp } from 'vue';
import Vuex from 'vuex';

import App from './App.vue';
import store from './store';

const app = createApp(App)
app.use(store)
app.mount('#app');
