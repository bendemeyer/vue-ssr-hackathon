import express  from 'express';
import fastify from 'fastify'
import fastifyStatic from '@fastify/static';
import { createHead, HeadVuePlugin, renderHeadToString } from '@vueuse/head';

import path  from 'path';
import Vue, { provide } from 'vue';
import VueRouter from 'vue-router';
import root from './root.vue';
import routes from './routes';

import lodash from 'lodash'
import fs from 'fs'
import { createPinia, PiniaVuePlugin } from 'pinia';
import { createRenderer } from 'vue-server-renderer';

const oldapp=express()
const app = fastify({logger: true})
const port = 3000;

//app.use(cookieParser());

const opts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          param: { type: 'string' },
          subject: { type: 'string' },
          app: { type: 'string' }
        }
      }
    }
  }
}

app.get('/*', async (request, reply) => {
  Vue.use(VueRouter);
  Vue.use(PiniaVuePlugin);
  Vue.use(HeadVuePlugin);

  const head = createHead();

  const renderer = createRenderer();
  const pinia = createPinia();
  const router = new VueRouter({
    mode: 'abstract',
    routes,
  });
  await router.push(request.url);

  const vueSSRApp = new Vue({
    router,
    pinia,
    head,
    render: h => h(root),
  });
  const applicationHtml = await renderer.renderToString(vueSSRApp);

  const params = {
    'param': request.query.param,
    'subject': request.query.subject,
    'app': applicationHtml,
    'piniaState': JSON.stringify(JSON.stringify(pinia.state.value)),
    'meta': await renderHeadToString(head),
  }

  const templateRoot = path.join(__dirname, '../../html')
  const fname = path.join(templateRoot, 'index.html')
  const htmlData = fs.readFileSync(fname)

  const compiled = lodash.template(htmlData)
  const toRender = compiled(params)

  reply
    .code(200)
    .type("text/html")

  return toRender
});

oldapp.use((req, res, next) => {
  if (!req.cookies.hackday) {
    res.cookie('hackday', 'express');
  }
  next()
});

oldapp.use('/', express.static(path.join(__dirname, '../../public')));

oldapp.use('/', express.static(path.join(__dirname, '../browser')));


app.register(fastifyStatic, {
  root: path.join(__dirname, '../../public'),
  prefix: '/static/',
})
app.register(fastifyStatic, {
  root: path.join(__dirname, '../browser'),
  prefix: '/dist/',
  decorateReply: false,
})

app.listen({ port });
