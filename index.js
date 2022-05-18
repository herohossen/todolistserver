const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
// came with mongodb API
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
//app.use(cors())
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@inventory-management-p1.mpnfu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const todoCollection = client.db('todoApp').collection('todo');

    // all todos
    app.get('/todo', async (req, res) => {
      const query = {};
      const cursor = todoCollection.find(query);
      const todos = await cursor.toArray();
      res.send(todos);
    });

    // post todos data
    app.post('/todo', async (req, res) => {
      const newTodo = req.body;
      // console.log('adding new todos', newTodo);
      const result = await todoCollection.insertOne(newTodo);
      res.send(result);
    });

    //Delete a Todo data
    app.delete('/todo/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      // console.log(id, query);
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // if you want to close database
    // client.close()
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});