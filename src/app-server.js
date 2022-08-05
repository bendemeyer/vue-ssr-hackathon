import express  from 'express';
import path  from 'path';
import cookieParser from 'cookie-parser';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import vueApp from './app.vue';

const lodash = require('lodash')
const fs = require ('fs')

const app = express();
const port = 3000;


app.use(cookieParser());


app.get('/', async (req, res) => {
  const vueSSRApp = createSSRApp(app);
  const applicationHtml = await renderToString(vueSSRApp);
  console.log(applicationHtml);
  const params = {
    'param': req.query.param,
    'subject': req.query.subject
  }
  const templateRoot = path.join(__dirname,'../../html')
  const fname = path.join(templateRoot, 'index.html') 
  const htmlData = fs.readFileSync(fname)

  const compiled = lodash.template(htmlData)
  const toRender = compiled(params)
  res.type('html').send(toRender)
});

app.use((req, res, next) => {
  if (!req.cookies.hackday) {
    res.cookie('hackday', 'express');
  }
  next()
});

app.use('/', express.static(path.join(__dirname, '../../public')));

app.use('/', express.static(path.join(__dirname, '../browser')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
