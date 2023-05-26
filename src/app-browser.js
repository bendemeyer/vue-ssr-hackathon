import Vue from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';
import appComponent from './root.vue';
import VueRouter from 'vue-router';
import routes from './routes';
// import { createHead, HeadVuePlugin } from '@vueuse/head';

const router = new VueRouter({
  mode: 'history',
  routes,
});

Vue.use(VueRouter);
Vue.use(PiniaVuePlugin);
// Vue.use(HeadVuePlugin);

// const head = createHead();

const pinia = createPinia();
pinia.state.value = window.piniaState;

const app = new Vue({
  pinia,
  // head,
  router,
  render: h => h(appComponent),
})

app.$mount('#app');

