const express = require('express');
const app = express()
const mongoose = require('mongoose')
const route = require("./routes/route.js")


app.use(express.json())

mongoose.connect("mongodb+srv://richardwork:2YLjcp0favzUASR9@cluster3.bli4t.mongodb.net/group58Database?retryWrites=true&w=majority")
.then(() => console.log("mongoDB is connected.."))
.catch((err) => console.log(err))

app.use('/',route)

app.listen(process.env.PORT || 3000 , function(){
    console.log("express is running on ", (process.env.PORT || 3000))
})