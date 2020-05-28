const Product = require("../models/product")
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
  }

  exports.postAddProduct = (req,res,next)=>{

        const product = new Product(req.body.title,req.body.imageUrl,req.body.description,req.body.price)
        product.save()
        res.redirect('/');
       
  }

  exports.getProduct = (req,res,next) => {

    Product.fetchAll((products) =>{
        console.log("products",products)
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/',
            // hasProducts: products.length > 0,
            // activeShop: true,
            // productCSS: true
    })
    
    });
  }