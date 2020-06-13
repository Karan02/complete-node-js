const {validationResult} = require("express-validator/check")
const fs = require("fs")
const path = require("path")
const Post = require("../models/post")
const post = require("../models/post")
const { remove } = require("../models/post")
const User = require("../models/user")
exports.getPosts = (req,res,next) => {
    // imageUrl = req.file.path.replace("\\","/");
    const currentPage = req.query.page || 1
    const perPage = 2
    let totalItems
    Post.find().countDocuments().then(count=>{
        totalItems = count
        return Post.find().skip((currentPage-1)*perPage).limit(perPage)
    }).then(posts=>{
        console.log("posts",posts)
        res.status(200).json({message:"Fetched posts successfully",posts:posts,totalItems:totalItems})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
   
   
}

exports.postStatus = (req,res,next) => {
    
    User.findById(req.userId).then(user => {
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
          }
          console.log("req.body.status",req.body.status)
        user.status = req.body.status
        return user.save()  
    }).then(result=>{
        res.status(201).json({message:"Status updated"})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}
exports.getStatus = (req,res,next) => {
    User.findById(req.userId).then(user => {
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
          }
        res.json({status:user.status})  
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}
exports.createPost = (req,res,next) => {
   
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
    const post = new Post({
        title:title,
        content:content,
        imageUrl:imageUrl,
        creator:req.userId
    })
    //saving post
    post.save().then(result=>{
        return User.findById(req.userId)
    }).then( user =>{   
        creator = user
        //saving user with respected posts in it(for aggregation purpose)
        //mongoose will handle extracting id from "post"
        user.posts.push(post)
        return user.save()
        
    }).then(result=>{
        res.status(201).json({
            message:"Post created Successfully",
            post:post,
            creator:{_id:creator._id,name:creator.name}})
    }).catch(err=>{
        console.log("error",err)
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
    
}
exports.updatePost = (req, res, next) => {
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
    Post.findById(postId)
      .then(post => {
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
        return post.save();
      })
      .then(result => {
        res.status(200).json({ message: 'Post updated!', post: result });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

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

exports.deletePost = (req,res,next) => {
    const postId = req.params.postId
    Post.findById(postId).then(post=>{
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
        return Post.findByIdAndRemove(postId)
    }).then(result=>{
        User.findById(req.userId)
        
        }).then(user =>{
            //pull is a mongoose function
            user.posts.pull(postId)
            return user.save() })
            .then( result =>{
        res.status(200).json({message:"Post Deleted"})
    }).catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}

const clearImage = filePath =>{
    filePath = path.join(__dirname,"..",filePath)
   console.log(filePath)
    fs.unlink(filePath,err=>console.log("error",err))
} 