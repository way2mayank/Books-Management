const express = require('express');
const app = express()
const mongoose = require('mongoose')
const route = require("./routes/route.js")


app.use(express.json())

mongoose.connect("mongodb+srv://jay420:gRLzeLdOa6ENyasF@cluster0.dnkg3q6.mongodb.net/group58Dtabase")
.then(() => console.log("mongoDB is connected.."))
.catch((err) => console.log(err))

app.use('/',route)

app.use(function(req,res){
    return res.status(400).send({status:false,message:"path not found or wrong url"})
})

app.listen(process.env.PORT || 3000 , function(){
    console.log("express is running on PORT ", (process.env.PORT || 3000))
})