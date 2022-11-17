const express = require("express");
const app = express();
const cors = require("cors");
const objectId = require("mongodb").ObjectId;
require("dotenv").config();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.muk27.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const runApp = async () => {
  try{
    await client.connect();

    // create database and data-tables
    const database = client.db('my-time-line');
    const postsCollections = database.collection('posts');
    const memberCollections = database.collection('members');
    const mybooksCollections = database.collection('mybooks');

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

    // update
    app.put("/edit/:id", async (req, res) => {
      const query = {_id : ObjectId(req.params.id)}
      const data = {$set : req.body};

      const result = await postsCollections.updateOne(query, data);
      res.json(result)
    })

    // delete
    app.delete("/delete/:id", async(req, res) => {
      const query = {_id : ObjectId(req.params.id)};
      const result = await postsCollections.deleteOne(query);
      res.json(result)
    });

    // member save
    app.post('/member', async(req, res) => {
      const result = await memberCollections.insertOne(req.body);
      res.json(result);
    });

    // load members
    app.get('/member/:email', async (req, res)=>{
      const query = {email:req.params.email};
      const result = await memberCollections.findOne(query);
      res.json(result);
    });

    // get single one
    app.get("/timeline/:id", async (req, res) => {
      const query = {_id : ObjectId(req.params.id)};
      const result = await postsCollections.findOne(query);
      res.json(result)
    });

    // post books
    app.post('/books', async (req, res) => {
      const result = await mybooksCollections.insertOne(req.body);
      res.json(result);
    })
    // load books
    app.get('/books', async (req, res) => {
      const result = await mybooksCollections.find({}).toArray();
      res.json(result);
    })
    // find book by id
    app.get('/books/:id', async (req, res) => {
      const query = {_id : ObjectId(req.params.id)}
      const result = await mybooksCollections.findOne(query);
      res.json(result)
    })
    // edit books
    app.put('/books/:id', async (req, res) => {
      const query = {_id : ObjectId(req.params.id)}
      const data = {$set : req.body};

      const result = await mybooksCollections.updateOne(query, data);
      res.json(result)
    })



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

