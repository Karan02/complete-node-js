const {validationResult} = require("express-validator/check")
const Post = require("../models/post")
exports.getPosts = (req,res,next) => {
    Post.find().then(posts=>{
        res.status(200).json({message:"Fetched posts successfully",posts:posts})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
    res.status(200).json({
        posts:[{title:"first post",content:"Content",imageUrl:"images/image1.png",creator:{
            name:"karan"
        },
    createdAt:new Date()}]
    })
}

exports.createPost = (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error("Validation failed,entered data is incorrect")
        error.statusCode = 422
        throw error
    }
    const title = req.body.title
    const content = req.body.content
    const post = new Post({
        title:title,
        content:content,
        imageUrl:"images/image1.png",
        creator:{name:"Karan"}
    })
    post.save().then(result=>{
        res.status(201).json({
            message:"Post created Successfully",
            post:result})
    }).catch(err=>{
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