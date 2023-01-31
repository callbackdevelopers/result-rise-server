const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3100;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const uri = `mongodb+srv://result-rise-db-user:8atFxiIp8yCahDc6@result-rise-db.g6bidmr.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

// middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const mongodb = () => {
    try {
        client.connect()
        console.log('database connected');
    }
    catch (error) { console.log(error.message); }
}
mongodb()
//collections
const db = client.db("result-rise");
const usersCollection = db.collection("users");
const studentResult = db.collection("studentResultData")

//get all users
app.get("/users", async (req, res) => {
    const sort = { _id: -1 };
    const query = {};
    const users = await usersCollection.find(query).sort(sort).toArray();
    res.send(users);
});
//get a user 
app.get("/users/:email", async (req, res) => {
    const { email } = req.params;
    // console.log(email);
    const query = { email: email };
    const user = await usersCollection.findOne(query)
    res.send(user);
});

// post a user
app.post("/users", async (req, res) => {
    const user = req.body
    // console.log(user);
    const result = await usersCollection.insertOne(user);
    res.send(result);
});

// get all student :
app.get('/students', async (req, res) => {
    const sort = { _id: -1 };
    const query = { roll: "student" };
    const students = await usersCollection.find(query).sort(sort).toArray();
    res.send(students);
})


app.get("/", (req, res) => {
    res.send("ResultRise Server is running");
});

app.listen(port, () => {
    console.log("Listening to port", port);
});
