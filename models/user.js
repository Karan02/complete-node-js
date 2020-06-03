// const Sequelize = require('sequelize');
const getDb = require("../util/database").getDb
const mongodb =require("mongodb")
const ObjectId = mongodb.ObjectId
// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email: Sequelize.STRING
// });

class User {
  constructor(username,email,cart,id){
    this.name = username
    this.email = email
    this.cart = cart
    this._id= id
  }
  save(){
    const db = getDb()
    return  db.collection("users").insertOne(this)
  }
  addToCart(product){
    const cartProductIndex = this.cart.items.findIndex(cp =>{
      return cp.productId.toString() === product._id.toString();

    })
    let newQuantity = 1
    const updatesCartItems = [...this.cart.items]

    if(cartProductIndex >= 0){
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatesCartItems[cartProductIndex].quantity = newQuantity
    }else{
      updatesCartItems.push({productId: new ObjectId(product._id),quantity: newQuantity})
    }
    updatesCartItems
    const updatedCart = {items:updatesCartItems}
    const db = getDb()
    return db.collection("users").updateOne({_id:new ObjectId(this._id)},{$set:{cart:updatedCart}})

  }
  static findById(userId){
    const db = getDb()
    return db.collection("users").findOne({_id: new mongodb.ObjectId(userId)}) 
  }
  static findAll(){
    console.log("here")
    const db = getDb()
    return db.collection("users").find({}).toArray().then(user => user).catch(err => console.log(err))
  }
  deleteItemFromCart (productId) {
    const updatedCartItems = this.cart.items.filter(item =>{
      return item.productId.toString() !== productId.toString()
    });
    const db = getDb()
    return db.collection("users").updateOne({_id:new ObjectId(this._id)},{$set:{cart:{items: updatedCartItems}}})
    
  };
  addOrder(){
    const db = getDb()
    return this.getCart().then(products =>{
      const order = {
        items: products,
        user: {
          _id: new ObjectId(this._id),
          name:this.name,
          // email:this.email
        }
      }
    return db.collection("orders").insertOne(order).then(result =>{

    }).then(()=>{
   
      this.cart = { items:[]}
    return db.collection("users").updateOne(
      {_id:new ObjectId(this._id)},
    {$set:{cart:{items: []}}})
    })})

  }
  getOrders(){
    const db = getDb()
    return db.collection("orders").find({"user._id":new ObjectId(this._id)}).toArray()
  }
  getCart(){
    const db= getDb()
    const productIds = this.cart.items.map(i => {
      return i.productId
    })
    return db.collection("products").find({_id:{$in:productIds}}).toArray().then(products => {
      return products.map(p => {
  
        return {
          ...p,quantity:this.cart.items.find(i => {

            return i.productId.toString() === p._id.toString()
          }).quantity
        }
      })
    })
  }
}

module.exports = User;
