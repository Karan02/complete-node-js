const getDb = require("../util/database").getDb
// const Sequelize = require('sequelize');
const mongodb =require("mongodb")
// const sequelize = require('../util/database');
class Product {
  constructor(title,price,description,imageUrl,id,userId){
    this.title = title
    this.price = price
    this._id = id
    this.description = description
    this.imageUrl = imageUrl,
    this.userId = userId
  }
  save(){
    const db = getDb()
    let dbOp
    if(this._id){
      dbOp = db.collection("products").updateOne({_id:new mongodb.ObjectID(this._id)},{$set:this})
    }else{
      dbOp = db.collection("products").insertOne(this)
    }
    return dbOp.then(result => console.log(result)).catch(err=>{
      console.log(err)
    })
  }
  static fetchAll(){
    const db = getDb()
    return db.collection("products").find().toArray().then(products=>{
      return products
    }).catch(err=>console.log(err))
  }
  static findById(prodId){
    const db = getDb()
    return db.collection("products").find({_id:new mongodb.ObjectID(prodId)}).next().then(product => {
      return product
      console.log("")}).catch(err => console.log(err))
  }
  static deleteById(prodId){
    const db = getDb()
    return db.collection("products").deleteOne({_id: new mongodb.ObjectID(prodId)}).then(()=> console.log("deleted")).catch(err => console.log(err))
  }
}
// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

module.exports = Product;
