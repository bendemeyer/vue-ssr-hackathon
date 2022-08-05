import express  from 'express';
import path  from 'path';

const app = express()
const port = 3000

app.get('/', (req, res) => {
  // res.type('html').send('Hello again Worldie!😀')
  res.render('home', { title: 'hackday' });
});

app.use('/', express.static(path.join(__dirname, '../public')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
