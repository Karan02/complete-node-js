const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const feedRoutes = require("./routes/feed")
// app.use(bodyParser.urlencoded()) //x-www-forn-urlencoded <form>
app.use(bodyParser.json()) //application json
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Methods","OPTIONS,GET,POST,PUT,PATCH,DELETE")
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization")
    next()
})
app.use("/feed",feedRoutes)
mongoose.connect("mongodb://")
app.listen(8080)

