const expect = require("chai").expect
const sinon = require("sinon")
const User = require("../models/user")
const AuthController = require("../controllers/auth")
const mongoose = require("mongoose")
describe("Auth controller",function(done){
   // before runs once, before all test cases
    before(function(done){
    mongoose.connect("mongodb://127.0.0.1:27017/test-messages").then(result =>{
        const user = new User({
            email:"test@test.com",
            password:"asdasd",
            name:"test",
            posts:[],
            _id:"5c0f66b979af55031b34728a"
        })
        return user.save()
     }).then(()=>{
         done()
     })
   })
    it("should throw error with code 500 if accessing db fails",function(done){
    sinon.stub(User,"findOne")
    User.findOne.throws()
    const req = {
        body:{
            email:"test@test.com",
            password:"sdfdfs"
        }
    }
    AuthController.login(req,{},()=>{}).then(result =>{
        expect(result).to.be.an("error")
        expect(result).to.have.property("statusCode",500)
        done()
    })

    expect(AuthController.login)
    User.findOne.restore()
   })

   it("should send a response with a valid status for existin user",function(done){
      
            const req = {
                userId:"5c0f66b979af55031b34728a"
            }
            const res = {
                statusCode:500,
                userStatus:null,
                status:function(code){
                    this.statusCode = code
                //status returns this response object and json function can be called on this
                    return this
                },
                json:function(data){
                    this.userStatus = data.status
                }
            }
            AuthController.getUserStatus(req,res,()=>{}).then(()=>{
                expect(res.statusCode).to.be.equal(200)
                expect(res.userStatus).to.be.equal("I am new")
                done()  
        })
   })
    //other hooks
   beforeEach(function(){

   })
   afterEach(function(){

   })

   //done is for async code
   after(function(done){
    User.deleteMany({}).then(()=>{
        mongoose.disconnect().then(()=>{
            done()
        })
    })
   })
})