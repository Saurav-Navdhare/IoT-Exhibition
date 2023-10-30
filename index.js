const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');


const ack = require("./routes/ack");
const nextLecture = require("./controllers/nextLec");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());


app.set('view engine', 'ejs');

// Set up static and uploads directories
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


app.use("/ack", ack)



app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/:teacherId", nextLecture );
// app.get("/:teacherId", (req, res) => {
//     res.send("Bhupendra Jogi");
// });

mongoose.connect(MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err) => { throw err; })