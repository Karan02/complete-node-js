// const Sequelize = require('sequelize').Sequelize;

// const sequelize = new Sequelize('node-database', 'root', 'admin', {
//   dialect: 'mysql',
//   host: 'localhost'
// });

// module.exports = sequelize;
let _db 
const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient
const mongoConnect = (callback) => {
  MongoClient.connect("mongodb://127.0.0.1:27017/localhost").then(result =>{
    console.log("connected")
    _db = result.db()
    callback(result)
  }
  ).catch(err=>{console.log(err)
  throw err
  })
}
const getDb = () => {
  if(_db){
    return _db
  }
  throw " No database found"
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb