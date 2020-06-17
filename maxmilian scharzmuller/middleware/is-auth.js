const jwt = require("jsonwebtoken")
module.exports = (req,res,next) => {
     
    const authHeader = req.get("Authorization")
    if(!authHeader){
        // const error = new Error("Not Authenticated")
        // error.statusCode =  401
        // throw error
        req.isAuth = false
        return next()
    }
    const token = authHeader.split(" ")[1]
    let decodedToken
    try{
        decodedToken = jwt.verify(token,"somesupersecretsecret")
        // console.log(decodedToken,"token")
    }catch(err){
        // console.log("err",err)
        req.isAuth = false
        return next()
        // err.statusCode = 500
    }
    if(!decodedToken){
        // console.log("err",err)

        req.isAuth = false
        return next()
        // const error = new Error("Not authenticated")
        // error.statusCode = 401
        // throw error
    }
    req.userId = decodedToken.userId
    req.isAuth = true
    next()
}