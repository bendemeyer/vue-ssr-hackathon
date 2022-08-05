import express from 'express';
import path from 'path';
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.type('html').send('Hello again Worldie!😀')
})

app.use('/static', express.static(path.join(path.dirname(import.meta.url), '../public')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
