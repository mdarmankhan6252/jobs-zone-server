const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ewhtdrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const usersCollection = client.db("jobsZoneDB").collection("users");
    const jobsCollection = client.db("jobsZoneDB").collection("jobs");
    const blogsCollection = client.db("jobsZoneDB").collection("blogs");

    // user related api

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.get("/user", async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      const email = req.query.email;
      const query = { email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return;
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/user/:id", async (req, res) => {
      const id = req.params.id;
      const role = req.body.role;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role,
        },
      };
      const result = await usersCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    //jobs related api

    app.get("/allJobs", async (req, res) => {
      const result = await jobsCollection.find().toArray();
      res.send(result);
    });

    app.get("/latestJobs", async (req, res) => {
      const result = await jobsCollection
        .find()
        .sort({ _id: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    app.get("/jobs", async (req, res) => {
      const page = parseInt(req.query.page) || 0;
      const limit = 6;
      const result = await jobsCollection
        .find()
        .skip(page * limit)
        .limit(limit)
        .toArray();
      res.send(result);
    });

    app.get("/jobsDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    });

    app.post("/job", async (req, res) => {
      const job = req.body;
      const result = await jobsCollection.insertOne(job);
      res.send(result);
    });

    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.deleteOne(query);
      res.send(result);
    });

    //blogs related api

    app.post("/post-blog", async (req, res) => {
      const blog = req.body;
      console.log(blog);
      const result = await blogsCollection.insertOne(blog);
      res.send(result);
    });

    //api for all blogs

    app.get("/blogs", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    });

    //api for recent blogs
    app.get("/recent-blogs", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      const recentBlogs = result.reverse().slice(0, 2);
      res.send(recentBlogs);
    });

    // api for single blog

    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogsCollection.findOne(query);
      res.send(result);
    });

    //api for delete a blog

    app.delete("/delete-blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogsCollection.deleteOne(query);
      res.send(result);
    });

    // applied related api.

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My server has been running...");
});

app.listen(port, () => {
  console.log("My server has been running.. on port : ", port);
});
