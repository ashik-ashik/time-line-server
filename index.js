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

    // load single members
    app.get('/member/:email', async (req, res)=>{
      const query = {email:req.params.email};
      const result = await memberCollections.findOne(query);
      res.json(result);
    });
    // load single members
    app.get('/members', async (req, res)=>{
      const result = await memberCollections.find({}).toArray();
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
    });

    // delete book
    app.delete('/book/:id', async (req, res)=>{
      const query = {_id : ObjectId(req.params.id)};
      const result = await mybooksCollections.deleteOne(query);
      res.json(result)
    });

    // database generate for password
    const platformCollec = database.collection('platform');
    const passwordCollec = database.collection('passwords');
    // post platform
    app.post('/platform', async (req, res)=>{
      const result = await platformCollec.insertOne(req.body);
      res.json(result)
    });

    // load platform
    app.get('/platform', async (req, res)=>{
      const query = {member:req.query.id};
      const result = await platformCollec.find(query).toArray();
      res.json(result);
    });

    // post passwords and accounts
    app.post('/password', async(req, res)=>{
      const result = await passwordCollec.insertOne(req.body);
      res.json(result);
    });
    // load password
    app.get('/password', async(req, res)=>{
      const query = req.query;
      const result = await passwordCollec.find(query).toArray();
      res.json(result)
    });
    // delete platform with all passwords
    app.delete('/delete-platform', async (req, res)=> {
      const {id, platform} = req.query;
      const platformPasswordDelete = await passwordCollec.deleteMany({platform: platform});
      await platformCollec.deleteOne({_id : ObjectId(id)});
      res.json(platformPasswordDelete)
    });
    // delete single password
    app.delete('/delete-password/:id', async(req, res)=>{
      const result = await passwordCollec.deleteOne({_id : ObjectId(req.params.id)});
      res.json(result);
    });
    // delete all passwords
    app.delete('/delete-passwords/:platform', async(req, res)=>{
      const result = await passwordCollec.deleteMany({platform : req.params.platform});
      res.json(result);
    })


    // 
    // 
    // R320 collections and apis
    const r320MemberCollection = database.collection('r320member');
    const r320CostsCollection = database.collection('r320Costs');
    const r320PayCollection = database.collection('r320Pay');

    // post members
    app.post('/r320-member', async(req,res)=>{
      const result = await r320MemberCollection.insertOne(req.body);
      res.json(result);
    });
    // load members
    app.get('/r320-members', async(req, res)=> {
      const result = await r320MemberCollection.find({}).toArray();
      res.json(result);
    })

    // post new cost
    app.post('/r320-cost', async (req, res)=>{
      const result = await r320CostsCollection.insertOne(req.body);
      res.json(result);
    });
    // consts load
    app.get('/r320-costs', async(req, res)=> {
      const result = await r320CostsCollection.find({}).sort({_id:-1}).toArray();
      res.json(result)
    });

    // post new pay
    app.post('/r320-pay', async(req, res)=>{
      const result = await r320PayCollection.insertOne(req.body);
      res.json(result);
    });
    // load pays
    app.get('/r320-pays', async (req, res)=>{
      const result = await r320PayCollection.find({}).sort({_id:-1}).toArray();
      res.json(result);
    });
    // load single pay
    app.get('/r320-pay/:id', async(req, res) => {
      const query = {_id : ObjectId(req.params.id)};
      const result = await r320PayCollection.findOne(query);
      res.json(result);
    });
    // update pay
    app.put('/r320-pay/:id', async(req, res)=>{
      const query = {_id : ObjectId(req.params.id)};
      const update = {$set : req.body};
      const result = await r320PayCollection.updateOne(query, update);
      res.json(result);
    })
    // load single cost
    app.get('/r320-cost/:id', async(req, res) => {
      const query = {_id : ObjectId(req.params.id)};
      const result = await r320CostsCollection.findOne(query);
      res.json(result);
    });
    // update pay
    app.put('/r320-cost/:id', async(req, res)=>{
      const query = {_id : ObjectId(req.params.id)};
      const update = {$set : req.body};
      const result = await r320CostsCollection.updateOne(query, update);
      res.json(result);
    });

    // delete multi cost action api
    app.delete('/delete-cost', async(req, res)=>{
      const ids = req.query.ids.split(',');
      const query = ids.map(id => ObjectId(id));
      const result = await r320CostsCollection.deleteMany({_id : {$in : query}});
      res.json(result);
    });
    // delete multi cost action api
    app.delete('/delete-pay', async(req, res)=>{
      const ids = req.query.ids.split(',');
      const query = ids.map(id => ObjectId(id));
      const result = await r320PayCollection.deleteMany({_id : {$in : query}});
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

