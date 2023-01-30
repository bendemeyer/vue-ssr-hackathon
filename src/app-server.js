import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createMemoryHistory, createRouter } from 'vue-router';
import root from './root.vue';
import routes from './routes';

import { createPinia } from 'pinia';
import { renderSSRHead } from '@unhead/ssr';
import setupHead from './head';
import { VueHeadMixin } from '@unhead/vue';

export async function render(url) {
  const pinia = createPinia();
  const head = setupHead();

  const vueSSRApp = createSSRApp(root);
  vueSSRApp.use(head);
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  });
  vueSSRApp.use(router);
  vueSSRApp.use(pinia);
  vueSSRApp.mixin(VueHeadMixin);

  await router.push(url);
  await router.isReady();

  const ctx = {};
  const applicationHtml = await renderToString(vueSSRApp, ctx);

  return {
    html: applicationHtml,
    modules: ctx.modules,
    piniaState: pinia.state.value,
    meta: await renderSSRHead(head),
  }
}
