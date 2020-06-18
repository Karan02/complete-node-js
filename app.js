// first install dotenv package then create a .env file and add all config
//optional to this is nodemon.json, if start script starts with nodemon then nodemon.json is automatically used as env
const dotenv=require('dotenv');
const https = require("https")
const path = require('path');
const fs = require("fs")
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require("helmet");
const compression= require("compression")
const errorController = require('./controllers/error');
const User = require('./models/user');
const morgan = require("morgan")
const MONGODB_URI =
  `${process.env.MONGO_URI}`;


const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();
const privateKey = fs.readFileSync("server.key")
const certificate = fs.readFileSync("server.cert")
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
    
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     console.log("file",req.body)
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/png' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/jpeg'
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
//will write log data to access.log
const accessLogStream = fs.createWriteStream(
  path.join(__dirname,"access.log"),
  {flags:"a"}
)
app.use(helmet())
app.use(compression())
//morgan is http request logger
app.use(morgan("combined",{stream:accessLogStream}))
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(
//   multer({ storage: fileStorage }).any()
// );
app.use(multer({dest:'./images/',}).single("image"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session ? req.session.isLoggedIn:false
  });
});

const config = {
  useUnifiedTopology: true ,
  useNewUrlParser: true
}
mongoose
  .connect(MONGODB_URI,{...config})
  .then(result => {
    // https.createServer({key:privateKey,cert:certificate},app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000)
  })
  .catch(err => {
    console.log(err);
  });
