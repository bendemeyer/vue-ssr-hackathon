import express  from 'express';
import fastify from 'fastify'
import fastifyStatic from '@fastify/static';
// import { createHead, renderHeadToString } from '@vueuse/head';
//import ssrManifest from '../dist/browser/ssr-manifest.json';

import fs from 'fs';
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
const ssrManifest = JSON.parse(fs.readFileSync('../dist/browser/ssr-manifest.json'))

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
  // Vue.use(HeadVuePlugin);

  // const head = createHead();

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
    // head,
    render: h => h(root),
  });
  const chunks = new Set(ssrManifest.initialChunks);
  const registeredComponents = new Set();
  const applicationHtml = await renderer.renderToString(vueSSRApp, {
    _registeredComponents: registeredComponents,
  });

  [...registeredComponents].forEach((component) => {
    chunks.add(ssrManifest.componentChunkMap[component][0]);
  });

  const filesToLoad = [];

  [...chunks].forEach((chunk) => {
    filesToLoad.push(...ssrManifest.chunkFilesMap[chunk]);
  });

  let preloads = '';
  let styles = '';
  let scripts = '';

  filesToLoad.forEach((file) => {
      if (/\.js$/.test(file)) {
        preloads += `<link rel="preload" href="${ssrManifest.publicPath}${file}" as="script">`;
        scripts += `<script type="text/javascript" src="${ssrManifest.publicPath}${file}" defer></script>`;
      } else if (/\.css$/.test(file)) {
        // not sure if this preload is necessary since both of these go in the head
        preloads += `<link rel="preload" href="${ssrManifest.publicPath}${file}" as="style">`;
        styles += `<link rel="stylesheet" href="${ssrManifest.publicPath}${file}">`;
      } else if (/\.(jpe?g|png|svg|gif)$/.test(file)) {
        preloads += `<link rel="preload" href="${ssrManifest.publicPath}${file}" as="image">`;
      } else if (/\.(woff2?)$/.test(file)) {
        preloads += `<link rel="preload" href="${ssrManifest.publicPath}${file}" as="font" crossorigin>`;
      }
    });


  console.log('hi components', registeredComponents);

  const params = {
    'param': request.query.param,
    'subject': request.query.subject,
    'app': applicationHtml,
    'piniaState': JSON.stringify(JSON.stringify(pinia.state.value)),
    // 'meta': await renderHeadToString(head),
    'meta': {},
    'preloads': preloads,
    'scripts': scripts,
    'styles': styles,
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









// app renders
// → which components were used (context._registeredComponents)
//   → which chunks do those components live in (manifest.componentChunkMap)
//   + which chunk is the entrypoint in (manifest.initialChunks)
//     → which files need to be loaded for those chunks (manifest.chunkFilesMap)



