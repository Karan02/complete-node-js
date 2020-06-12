const {validationResult} = require("express-validator/check")
const Post = require("../models/post")
exports.getPosts = (req,res,next) => {
    // imageUrl = req.file.path.replace("\\","/");
    Post.find().then(posts=>{
        res.status(200).json({message:"Fetched posts successfully",posts:posts})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
   
}

exports.createPost = (req,res,next) => {
    console.log("path",req.file.path)
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error("Validation failed,entered data is incorrect")
        error.statusCode = 422
        throw error
    }
    if(!req.file){
       const error = new Error("No Image provided")
       error.statusCode = 422
       throw error 
    }
    console.log("comes here")
    const imageUrl = req.file.path.replace("\\" ,"/");
    const title = req.body.title
    const content = req.body.content
    const post = new Post({
        title:title,
        content:content,
        imageUrl:imageUrl,
        creator:{name:"Karan"}
    })
    post.save().then(result=>{
        res.status(201).json({
            message:"Post created Successfully",
            post:result})
    }).catch(err=>{
        console.log("error",err)
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
    
}

exports.getPost = (req,res,next) =>{
    const postId = req.params.postId
    Post.findById(postId).then(post=>{
        if(!post){
            const error = new Error("Could not find post")
            error.statusCode = 404
            // throwing error will send it to catch block
            throw error
        }
        res.status(200).json({message:"Post Fetched",post:post})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}