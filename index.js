const express = require("express");
const app = express();
const cors = require("cors");
const objectId = require("mongodb").objectId;
require("dotenv").config();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.muk27.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const runApp = async () => {
  try{
    await client.connect();

    // create database and data-tables
    const database = client.db('my-time-line');
    const postsCollections = database.collection('posts');

    // post 
    app.post('/post', async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await postsCollections.insertOne(data);
      res.json(result);
    });

    // get posts
    app.get("/posts", async (req, res)=> {
      const result = await postsCollections.find({}).sort({_id:-1}).toArray();
      res.json(result);
    });

  } finally{

  };
}
runApp().catch(console.dir);

app.get('/', (req, res) => {
  res.send("This server is running!")
})

app.listen(port, ()=> {
  console.log("Time Line is running!");
})

