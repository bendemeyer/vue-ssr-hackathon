import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

import fastify from 'fastify'
import fastifyStatic from '@fastify/static';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = fastify({logger: true})
const port = 3000;
const isProd = process.env.NODE_ENV === 'production';
let vite = undefined;

const templateProd = isProd ? fs.readFileSync(path.resolve(__dirname, 'dist/browser/index.html'), 'utf-8') : '';
const manifest = isProd ? JSON.parse(fs.readFileSync(path.resolve(__dirname, 'dist/browser/ssr-manifest.json'), 'utf-8')) : {};

function renderPreloadLinks(modules) {
  let links = ''
  const seen = new Set()
  modules.forEach((id) => {
    const files = manifest[id]
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file)
          const filename = path.basename(file)
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile)
              seen.add(depFile)
            }
          }
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

function renderPreloadLink(file) {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  } else if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  } else if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  } else if (file.endsWith('.gif')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
  } else if (file.endsWith('.png')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`
  } else {
    // TODO
    return ''
  }
}

app.get('/favicon.ico', async (request, reply) => {
  reply.status(404);
  return '';
});

if (isProd) {
  app.register(fastifyStatic, {
    root: path.join(__dirname, 'dist/browser/assets'),
    prefix: '/assets/',
    decorateReply: false,
  });
} else {
  vite = await (await import('vite')).createServer({
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });

  await app.register(await import('@fastify/middie'));
  app.use(vite.middlewares);
}

app.get('*', async (request, reply) => {
  let template, render;

  if (isProd) {
    template = templateProd;
    render = (await import('./dist/server/app-server.js')).render;
  } else {
    template = await vite.transformIndexHtml(request.url, fs.readFileSync(path.resolve(__dirname, 'src/index.html'), 'utf-8'));
    render = (await vite.ssrLoadModule('app-server.js')).render;
  }

  const { html: appHtml, meta, piniaState, modules } = await render(request.url);

  const html = template
    .replace('<!--app-->', appHtml)
    .replace('<!--meta.head-->', meta.headTags)
    .replace('<!--piniaState-->', JSON.stringify(JSON.stringify(piniaState)))
    .replace('<!--preloadLinks-->', renderPreloadLinks(modules));

  reply
    .code(200)
    .type("text/html")

  return html;
});

app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/static/',
})

app.listen({ port });
