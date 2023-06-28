import express  from 'express';
import fastify from 'fastify'
import fastifyStatic from '@fastify/static';
import { createHead, renderHeadToString } from '@vueuse/head';

import path  from 'path';
import cookieParser from 'cookie-parser';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createMemoryHistory, createRouter } from 'vue-router';
import root from './root.vue';
import routes from './routes';

import lodash from 'lodash'
import fs from 'fs'
import { createPinia } from 'pinia';

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
  const pinia = createPinia();
  const head = createHead();

  const vueSSRApp = createSSRApp(root);
  vueSSRApp.use(head);
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  });
  await router.push(request.url);
  vueSSRApp.use(router);
  vueSSRApp.use(pinia);
  const applicationHtml = await renderToString(vueSSRApp);

  const params = {
    'param': request.query.param,
    'subject': request.query.subject,
    'app': applicationHtml,
    'piniaState': JSON.stringify(JSON.stringify(pinia.state.value)),
    'meta': renderHeadToString(head),
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

app.listen({ host: '0.0.0.0', port });
