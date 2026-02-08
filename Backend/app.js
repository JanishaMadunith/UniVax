//ra4mOFFVNUAgBbSs
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use("/",(req, res, next)=>{
    res.send("It Is working")
})

mongoose.connect("mongodb+srv://tharusha:ra4mOFFVNUAgBbSs@cluster0.xeknc.mongodb.net/")
.then(()=>console.log("Connected to MogoDB"))
.then(() => {
    app.listen(5001);
})
.catch((err)=>console.log((err)));