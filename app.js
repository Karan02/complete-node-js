const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require("express-handlebars")
const app = express();
const errorController = require("./controllers/error")
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
 
// app.engine(
//     'hbs',
//     expressHbs({
//       layoutsDir: 'views/layouts/',
//       defaultLayout: 'main-layout',
//       extname: 'hbs'
//     })
//   );
app.set("view engine","ejs")
app.set("views","views")
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000,()=>console.log("listening on 3000"));
