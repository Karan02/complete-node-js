const path = require("path")
const fs = require("fs")
const express = require("express")
const graphqlHttp = require("express-graphql")
const graphqlSchema = require("./graphql/schema")
const graphqlResolver = require("./graphql/resolvers")
const auth = require("./middleware/is-auth")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
// const feedRoutes = require("./routes/feed")
// const authRoutes = require("./routes/auth")
// const init = require("./socket")
const multer = require("multer")
const { uuid } = require('uuidv4')
const { formatError } = require("graphql")
// app.use(bodyParser.urlencoded()) //x-www-forn-urlencoded <form>
app.use(bodyParser.json()) //application json
const fileStorage= multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"images")
    },
    filename:(req,file,cb) => {
        cb(null, uuid()+file.originalname);
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
    if(req.method === "OPTIONS"){
        return res.sendStatus(200)
    }
    next()
})

// app.use("/feed",feedRoutes)
// app.use("/auth",authRoutes)
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
app.use(auth)
app.put("/post-image",(req,res,next)=>{
    
    if(!req.isAuth){
  

        throw new Error("Not Authenticated")
    }  
    if(!req.file){
   

        return res.status(200).json({message:"No file Provided"})
    }
    if(req.body.oldPath){
     

        clearImage(req.body.oldPath)
    }
     

    return res.status(201).json({message:"File stored",filePath:req.file.path})
})

app.use("/graphql",graphqlHttp({
    schema:graphqlSchema,
    rootValue:graphqlResolver,
    graphiql: true, // allow to play with graphql api on browser
    formatError(err){
       if(!err.originalError){
           console.log("err",err)
           

           return err
       } 
       console.log("here")
       const data = err.originalError.data
       const message = err.message || "An error occurred"
       const code = err.originalError.code || 500
       return {
           message:message,
           status:code,
           data:data
       }
    }
}))
app.use((err,req,res,next)=>{
   console.log("here2")
    const status = err.statusCode || 500
    const message = err.message
    const data = err.data
    res.status(status).json({message:message,data:data})
})
mongoose.connect("mongodb://127.0.0.1:27017/messages",config)
.then((result)=>{
    console.log("Listening on 8080")
    const server = app.listen(8080)
    // const io = require("./socket").init(server)
    // io.on("connection",socket =>{
    //     console.log("Client connected")
    // })
}).catch(err=> console.log(err))

const clearImage = filePath =>{
    const filePathe = path.join(__dirname,"..",filePath)
    
      fs.unlink(filePathe,err=>console.log("error",err))
} 
