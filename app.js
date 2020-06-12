const path = require("path")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const feedRoutes = require("./routes/feed")
// app.use(bodyParser.urlencoded()) //x-www-forn-urlencoded <form>
app.use(bodyParser.json()) //application json

//serving static files
app.use("/images",express.static(path.join(__dirname,"images")))
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Methods","OPTIONS,GET,POST,PUT,PATCH,DELETE")
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization")
    next()
})
app.use("/feed",feedRoutes)
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
app.use((err,req,res,next)=>{
    console.log(err)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({message:message})
})
mongoose.connect("mongodb://127.0.0.1:27017/messages",config)
.then((result)=>{
    console.log("Listening on 8080")
    app.listen(8080)
}).catch(err=> console.log(err))


