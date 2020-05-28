const products = []
const fs = require("fs")
const path = require("path")
const p = path.join(path.dirname(process.mainModule.filename),"data","products.json")

const getProductsFromFile = (cb) => {
    
    fs.readFile(p,(err,content)=>{
        if(err){
         cb([])
        }else{
        cb(JSON.parse(content))
    }})

}
module.exports = class Product {
    constructor(title,imageUrl,description,price){
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = price
    }
      
    save(){
        getProductsFromFile(products =>{
            // use arrow function here otherwise this keyword wont work as it will refer to this function
            products.push(this)
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                console.log(err)
            })
        })
       
    }

    // static keyword is to refer to intial class and not instantiated object
    static fetchAll(cb){
       getProductsFromFile(cb)
    }
}