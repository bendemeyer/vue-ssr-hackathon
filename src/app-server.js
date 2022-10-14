import express  from 'express';
import fastify from 'fastify'

import path  from 'path';
import cookieParser from 'cookie-parser';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import vueApp from './app.vue';

import lodash from 'lodash'
import fs from 'fs'

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

app.get('/', async (request, reply) => {
    const vueSSRApp = createSSRApp(vueApp);
    const applicationHtml = await renderToString(vueSSRApp);

    const params = {
        'param': request.query.param,
        'subject': request.query.subject,
        'app': applicationHtml,
    }
    
    const templateRoot = path.join(__dirname,'../../html')
    const fname = path.join(templateRoot, 'index.html') 
    const htmlData = fs.readFileSync(fname)

    const compiled = lodash.template(htmlData)
    const toRender = compiled(params)

    reply
        .code(200)
        .type("text/html")

    return toRender
})

oldapp.get('/', async (req, res) => {
  const vueSSRApp = createSSRApp(vueApp);
  const applicationHtml = await renderToString(vueSSRApp);
  console.log(applicationHtml);
  const params = {
    'param': req.query.param,
    'subject': req.query.subject,
    'app': applicationHtml,
  }
  const templateRoot = path.join(__dirname,'../../html')
  const fname = path.join(templateRoot, 'index.html') 
  const htmlData = fs.readFileSync(fname)

  const compiled = lodash.template(htmlData)
  const toRender = compiled(params)
  res.type('html').send(toRender)
});

oldapp.use((req, res, next) => {
  if (!req.cookies.hackday) {
    res.cookie('hackday', 'express');
  }
  next()
});

oldapp.use('/', express.static(path.join(__dirname, '../../public')));

oldapp.use('/', express.static(path.join(__dirname, '../browser')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
