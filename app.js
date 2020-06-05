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
// const mongoConnect = require("./util/database").mongoConnect
// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');
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
  if(req.session.user){
  User.findById(req.session.user._id)
    .then(user => {
      // req.session.isLoggedIn = true;
      // req.user = user;
      console.log("ulaa",user)
        req.user = user
      next()
    })
    .catch(err => console.log(err));}
    else{

      console.log("in else")
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


app.use(errorController.get404);

// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// //has many is for one to many relations
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// //belongs to many is used for many to many relations
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });
// // below code runs only once
// sequelize
//   // .sync({ force: true })
//   .sync()
//   .then(result => {
//     return User.findByPk(1);
//     // console.log(result);
//   })
//   .then(user => {
//     if (!user) {
//       return User.create({ name: 'Max', email: 'test@test.com' });
//     }
//     return user;
//   })
//   .then(user => {
//     // console.log(user);
//     return user.createCart();
//   })
//   .then(cart => {
//     app.listen(3000);
//   })
//   .catch(err => {
//     console.log(err);
//   });
// mongoConnect(() => {
   
//   app.listen(3000);
//   console.log("Listening on port 3000");
// })
mongoose.connect("mongodb://localhost:27017/localhost").then((result)=>{
// User.findOne().then(user=>{
// if(!user){
//   const user =  User.create({
//     name:"Max",
//     email:"ken@gmail.com",
//     cart:{
//       items:[]
//     }
//   })
// }
// })  

app.listen(3000)
  console.log("Listening on port 3000");

}).catch((err)=>{
  console.log(err)
})