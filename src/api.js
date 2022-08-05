const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid-js');

const db = { // persistence? never heard of her!
  todos: [],
};

const app = express();

app.use(bodyParser.json());


app.get('/todo', (req, res) => {
  // TODO pagination? try not to have to much to do
  res.json({ todos: db.todos });
});

app.post('/todo', (req, res) => {
  try {
    // TODO validation? just don't send bad data yo

    const item = {
      id: uuid.create(4).toString(),
      name: req.body.name,
      title: req.body.title,
    };

    db.todos.push(item);

    res.status(201).json({ ok: true, item });
  } catch (e) {
    res.status(422).json({ ok: false, error: 'unknown' });
  }
});

app.post('/todo/:id', (req, res) => {
  for (const item of db.items) {
    if (item.id === req.params.id) {
      item.name = req.body.name;
      item.title = req.body.title;

      res.status(200).json({ ok: true });
      return;
    }
  }

  res.status(404).json({ ok: false });
});

app.delete('/todo/:id', (req, res) => {
  // TODO 404 if item doesn't exist?
  db.items = db.items.filter(({ id }) => id !== req.params.id);
  res.status(204).json({ ok: true });
});

app.listen(9999);
