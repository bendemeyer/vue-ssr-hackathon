const fastify = require('fastify');
const uuid = require('uuid-js');

const db = { // persistence? never heard of her!
  todos: [],
};

const app = fastify({ logger: true });

// START MIDDLEWARE PLAYGROUND
app.addHook('onRequest', (request, reply, done) => {
  console.log('mw 1 pre');
  done();
  console.log('mw 1 post');
})
app.route({
  method: 'GET',
  url: '/',
  onRequest: (request, reply, done) => {
    console.log('mw 2 pre');
    done();
    console.log('mw 2 post');
  },
  handler: (request, reply) => {
    console.log('endpoint');
    reply.type('application/json').send({foo: 'bar'});
  },
});
app.addHook('onRequest', (request, reply, done) => {
  console.log('mw 3 pre');
  done();
  console.log('mw 3 post');
});
app.get('/foo', (request, reply) => {
  console.log('endpoint foo');
  reply.type('application/json').send({foo: 'bar'});
});
app.post('/', (request, reply) => {
  console.log('endpoint post');
  reply.type('application/json').send({foo: 'bar'});
});
app.addHook('onRequest', (request, reply, done) => {
  console.log('mw 4 pre');
  done();
  console.log('mw 4 post');
})
// END MIDDLEWARE PLAYGROUND

app.get('/todo', async () => {
  // TODO pagination? try not to have to much to do
  return { todos: db.todos };
});

app.post('/todo', async (request, reply) => {
  try {
    // TODO validation? just don't send bad data yo

    const item = {
      id: uuid.create(4).toString(),
      name: request.body.name,
      title: request.body.title,
    };

    db.todos.push(item);

    reply.status(201);
    return { ok: true, item }
  } catch (e) {
    reply.status(422);
    return { ok: false, error: 'unknown' };
  }
});

app.post('/todo/:id', async (request, reply) => {
  for (const item of db.todos) {
    if (item.id === request.params.id) {
      item.name = request.body.name;
      item.title = request.body.title;

      reply.status(200);
      return { ok: true };
    }
  }

  reply.status(404);
  return { ok: false };
});

app.delete('/todo/:id', async (request, reply) => {
  // TODO 404 if item doesn't exist?
  db.todos = db.todos.filter(({ id }) => id !== request.params.id);
  reply.status(204);
  return { ok: true };
});

app.listen({ port: 9999 });
