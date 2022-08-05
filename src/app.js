import express from 'express';
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.type('html').send('Hello Worldie!😀')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
