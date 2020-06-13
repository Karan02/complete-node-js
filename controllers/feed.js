const {validationResult} = require("express-validator/check")
const fs = require("fs")
const path = require("path")
const Post = require("../models/post")
const post = require("../models/post")
const { remove } = require("../models/post")
const User = require("../models/user")
exports.getPosts = async (req,res,next) => {
    // imageUrl = req.file.path.replace("\\","/");
    const currentPage = req.query.page || 1
    const perPage = 2
     try{
    const totalItems = await Post.find().countDocuments()
    const posts = await Post.find().skip((currentPage-1)*perPage).limit(perPage)
    res.status(200).json({message:"Fetched posts successfully",posts:posts,totalItems:totalItems})
     }catch(err){
         if(!err.statusCode){
             err.statusCode = 500
         }
         next(err)
     }
}

exports.postStatus = async (req,res,next) => {
    try{
    let user = await User.findById(req.userId)
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
          }
          console.log("req.body.status",req.body.status)
        user.status = req.body.status
         user.save()  
    
     
        res.status(201).json({message:"Status updated"})
    }
      catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}
exports.getStatus =async (req,res,next) => {
   let user = await User.findById(req.userId)
   try{    
   if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
          }
        res.json({status:user.status})  
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}
exports.createPost =async (req,res,next) => {
   
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
    
    const imageUrl = req.file.path.replace("\\" ,"/");
    const title = req.body.title
    const content = req.body.content
    let creator
    try{
    const post = new Post({
        title:title,
        content:content,
        imageUrl:imageUrl,
        creator:req.userId
    })
    //saving post
    let result =await post.save()
    let user =await User.findById(req.userId) 
    creator = user
        //saving user with respected posts in it(for aggregation purpose)
        //mongoose will handle extracting id from "post"
    await user.posts.push(post)
    await user.save()
    res.status(201).json({
            message:"Post created Successfully",
            post:post,
            creator:{_id:creator._id,name:creator.name}})
    
    }catch(err){
        console.log("error",err)
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
    
}
exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }
    try{
    let post = Post.findById(postId)
       
        if (!post) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error("Not Authorized")
            error.statusCode = 403
            throw error
        }
        if (imageUrl !== post.imageUrl) {
          clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        let result = await post.save();
       
      
        res.status(200).json({ message: 'Post updated!', post: result });
    }
      catch(err){
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
  };

exports.getPost = async (req,res,next) =>{
    const postId = req.params.postId
    try{
    let post = Post.findById(postId) 
    if(!post){
            const error = new Error("Could not find post")
            error.statusCode = 404
            // throwing error will send it to catch block
            throw error
    }
    res.status(200).json({message:"Post Fetched",post:post})
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}

exports.deletePost =async (req,res,next) => {
    const postId = req.params.postId
    let post = Post.findById(postId)
    try{
    if(!post){
            const error = new Error("Could not find post")
            error.statusCode = 404
            // throwing error will send it to catch block
            throw error
    }
    if(post.creator.toString() !== req.userId){
            const error = new Error("Not Authorized")
            error.statusCode = 403
            throw error
    }
        //check logged in user
    clearImage(post.imageUrl)
    let result = Post.findByIdAndRemove(postId)
     
    let user = User.findById(req.userId)
        
          
    //pull is a mongoose function
    user.posts.pull(postId)
    await user.save() 
            
    res.status(200).json({message:"Post Deleted"})}
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500
    }
    next(err)
    }
}

const clearImage = filePath =>{
    filePath = path.join(__dirname,"..",filePath)
   console.log(filePath)
    fs.unlink(filePath,err=>console.log("error",err))
} 