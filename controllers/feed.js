const {validationResult} = require("express-validator/check")

exports.getPosts = (req,res,next) => {
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
        return res.status(422).json({message:"Validation failed,entered data is incorrect",
        errors:errors.array()})
    }
    const title = req.body.title
    const content = req.body.content
    res.status(201).json({
        message:"Post created Successfully",
        post: {_id:new Date().toISOString(),title:title,content:content,creator:{name:"Karan"},createdAt:new Date()}
    })
}