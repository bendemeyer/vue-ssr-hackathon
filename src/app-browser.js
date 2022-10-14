import { createApp } from 'vue';
import appComponent from './root.vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(appComponent);

app.use(router);
app.mount('#app');
