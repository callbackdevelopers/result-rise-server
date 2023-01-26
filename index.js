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
const studentsCollection = db.collection("students");
const teachersCollection = db.collection("teachers");
const usersCollection = db.collection("users");
const studentResult =db.collection("studentResultData")

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
    console.log(email);
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


// get all students
app.get("/students", async (req, res) => {
    const sort = { _id: -1 };
    const students = await studentsCollection.find().sort(sort).toArray();
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
    const student_name = req.body.student_name;
    const student_id = req.body.student_id;
    const cgpa = req.body.cgpa;
    const photo = req.body.photo;
    const student = { student_name, student_id, cgpa, photo };
    const result = await studentsCollection.insertOne(student);
    res.send(result);
});

// update a student
app.patch("/students/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const newData = { $set: req.body };
    const options = { upsert: true };
    const result = await studentsCollection.updateOne(
        query,
        newData,
        options
    );
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
    const sort = { _id: -1 };
    const teachers = await teachersCollection
        .find()
        .sort(sort)
        .toArray();
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
    const teacher_name = req.body.teacher_name;
    const teacher_id = req.body.teacher_id;
    const designation = req.body.designation;
    const photo = req.body.photo;
    const teacher = { teacher_name, teacher_id, photo, designation };
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

//get student result data
app.get("/resultdata", async (req, res) => {
     const query = {};
    const resultData = await studentResult.find(query);
    const result = await resultData.toArray()
    console.log(result);
    res.send(result);
});

app.get("/", (req, res) => {
    res.send("ResultRise Server is running");
});

app.listen(port, () => {
    console.log("Listening to port", port);
});
