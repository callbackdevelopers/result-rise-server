const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@result-rise-db.g6bidmr.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        console.log("Connected correctly to server");
        const db = client.db("result-rise-db");
        const studentsCollection = db.collection("students");
        const teachersCollection = db.collection("teachers");

        //sign up with role
        // app.post("/signup", async (req, res) => {

        // });

        // get all students
        app.get("/students", async (req, res) => {
            const students = await studentsCollection.find().toArray();
            res.send(students);
        });

        //get a student
        app.get("/students/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const student = await studentsCollection.findOne(query);
            res.send(student);
        });

        // add a student
        app.post("/students", async (req, res) => {
            const student = req.body;
            const result = await studentsCollection.insertOne(student);
            res.send(result);
        });

        // update a student
        app.patch("/students/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const newData = { $set: req.body };
            const result = await studentsCollection.updateOne(query, newData);
            res.send(result);
        });

        // delete a student
        app.delete("/students/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentsCollection.deleteOne(query);
            res.send(result);
        });

        // get all teachers
        app.get("/teachers", async (req, res) => {
            const teachers = await teachersCollection.find().toArray();
            res.send(teachers);
        });

        //get a teacher
        app.get("/teachers/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const teacher = await teachersCollection.findOne(query);
            res.send(teacher);
        });

        // add a teacher
        app.post("/teachers", async (req, res) => {
            const teacher = req.body;
            const result = await teachersCollection.insertOne(teacher);
            res.send(result);
        });

        // update a teacher
        app.patch("/teachers/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const newData = { $set: req.body };
            const result = await teachersCollection.updateOne(query, newData);
            res.send(result);
        });

        //delete a teacher
        app.delete("/teachers/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await teachersCollection.deleteOne(query);
            res.send(result);
        });
    } finally {
    }
}
run().catch(console.log);

app.get("/", (req, res) => {
    res.send("ResultRise Server is running");
});

app.listen(port, () => {
    console.log("Listening to port", port);
});
