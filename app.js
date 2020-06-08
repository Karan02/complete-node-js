const path = require('path');
const getDb = require("./util/database").getDb
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const errorController = require('./controllers/error');
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
// cross site request forgery
const csrf = require("csurf")
const flash = require("connect-flash")

const User = require("./models/user")
const app = express();
const store = new MongoDBStore({
  uri:"mongodb://127.0.0.1:27017/localhost",
  collection:"sessions"
})
const csurfProtection = csrf()
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require("./routes/auth")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//resave not saving on every request, makes it faster
app.use(session({secret:"my secret",resave:false,saveUninitialized:false,store:store}))
app.use(csurfProtection)


app.use(flash())

app.use((req,res,next)=>{
  //locals provided by express, local variable that are passed in views
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})
// this middleware used because we can have access to all cool methods mongoose have on model
app.use((req,res,next)=>{
  if(!req.session.user._id){
    return next()
  }
  // outside here we can just throw error
  // throw new Error("sync dummy")
  if(req.session.user){
  User.findById(req.session.user._id)
    .then(user => {
      // req.session.isLoggedIn = true;
      // req.user = user;
      if(!user){
        next()
      }
        req.user = user
      next()
    })
    .catch(err => {
      // we cannot throw directly error from here as it will not be catched by our expresss error middleware
      next(new Error(err))
    });}
    else{

       
      next()
    }
})


// this code runs many times
// app.use((req, res, next) => { 
//   User.findById("5ed7cc1b7b4c2702d867b8f4")
//     .then(user => {
//       // console.log("user",user)
//       req.user = user
//       next()
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500",errorController.get500)
app.use(errorController.get404);


//special express middleware which handles error(unhandled errors thats why its in last)
app.use((error,req,res,next)=>{
  // res.status(error.httpStatusCode).render(...)
  res.redirect("/500")
})

mongoose.connect("mongodb://localhost:27017/localhost").then((result)=>{


app.listen(3000)
  console.log("Listening on port 3000");

}).catch((err)=>{
  console.log(err)
})