const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express(); 
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: './data/',
    filename: (req, file, cb) => {
        const username = req.body.username;
        console.log(username);
        const time = new Date().toISOString().replace(/:/g, '-');
        const newFilename = `${time}.csv`;
        req.body.filename = newFilename;
        cb(null, newFilename);
    },
});

const upload = multer({ storage: storage });

const nextLecture = require("./controllers/nextLec");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;





app.set('view engine', 'ejs');

// Set up static and uploads directories
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.render('upload');
  });


app.post('/', upload.single('csvFile'), (req, res) => {
    fs.rename(path.join(__dirname, 'data', req.body.filename), path.join(__dirname, 'data', req.body.username + '.csv'), (err)=>{
        if(err) return res.send(err);
        res.send('File uploaded successfully');
    })
  });

app.get("/:teacherId", nextLecture );


app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});