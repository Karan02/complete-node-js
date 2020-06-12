const path = require("path")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const feedRoutes = require("./routes/feed")
const multer = require("multer")
const { uuid } = require('uuidv4')
// app.use(bodyParser.urlencoded()) //x-www-forn-urlencoded <form>
app.use(bodyParser.json()) //application json
const fileStorage= multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"images")
    },
    filename:(req,file,cb) => {
        cb(null, uuid());
    }

})
const fileFilter = (req,file,cb) => {
    if(file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
    ){
      cb(null,true)  
    }else{
        cb(null,false)
    }
}
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single("image"))
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
    console.log("sdfkljsdflksj",err)
    const status = err.statusCode || 500
    const message = err.message
    res.status(status).json({message:message})
})
mongoose.connect("mongodb://127.0.0.1:27017/messages",config)
.then((result)=>{
    console.log("Listening on 8080")
    app.listen(8080)
}).catch(err=> console.log(err))


