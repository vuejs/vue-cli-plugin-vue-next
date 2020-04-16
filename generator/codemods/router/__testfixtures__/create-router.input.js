import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

new VueRouter({
  routes
});

export default router;
