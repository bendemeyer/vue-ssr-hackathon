import { createApp } from 'vue';
import { createPinia } from 'pinia';
import appComponent from './root.vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useCommonStore } from './stores/commonStore';
import setupHead from './head';
import { VueHeadMixin } from '@unhead/vue';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia()
pinia.state.value = window.piniaState
const app = createApp(appComponent);
const head = setupHead();

app.use(head);
app.use(router);
app.use(pinia);
app.mixin(VueHeadMixin);

app.mount('#app');

