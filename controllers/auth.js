const bcrypt = require('bcryptjs');
const nodemailer=  require("nodemailer")
const User = require('../models/user');
 
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:"krnptl1234@gmail.com",
    pass: "goog2goog"
  },
  secure: false,//true
  port: 25,//465
  tls: {
    rejectUnauthorized: false
  }
})
exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else{
    message=null
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else{
    message=null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
        req.flash('error', 'Invalid email or password.');

          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        //  after using flash, it removes message from flash
        req.flash('error', 'Email exist already');

        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
      })
        .then(()=>{
          
           
        
          const mailOptions = {
            from: "krnptl1234@gmail.com",
            to: "0002karan@gmail.com",
            subject: 'Welcome to complete node js course',
            html: `
              <body>
                <p> Hello karan </p>
                <br/>
                <p>Thank you for signin up to node js course. Kindly use given credentials for loggin in.</p>
                <br/>
                <p>Email Id: krnptl1234@gmail.com </p>
                <p>Password: not now </p>
                <br/>
                <br/>
                <p>Thank You!</p>
                <p>Nutrition Team</p>
              </body>
            `
          }
          
          transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
              console.log('error occured',err);
              return;
            }
        })
    res.redirect('/login');

      })
    .catch(err => {
      console.log(err);
    })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
