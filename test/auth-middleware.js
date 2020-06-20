const expect = require("chai").expect
const sinon = require("sinon")
const authMiddleware = require("../middleware/is-auth")
const jwt = require("jsonwebtoken")
describe("Auth middleware",function(){
    it("should throw authorisation error if not authorized",function(){
        const req = {
            get: function(){
                return null
            }
        } 
       expect(authMiddleware.bind(this,req,{},()=>{})).to.throw("Not Authenticated")
     })
     
     it("should throw error if authorisation header is only one string",function(){
         const req = {
             get: function(headerName){
                 return "xyz"
             }
         }
         expect(authMiddleware.bind(this,req,{},()=>{})).to.throw()
     })

     it("should yield userId after decoding token",function(){
        const req = {
             get: function(headerName){
                 return "Bearer dsfsdfsfffds"
             }
            }

        sinon.stub(jwt,"verify")
        // overrride jwt.verify method inside authMiddleware    
        jwt.verify.returns({userId:"abc"})
        authMiddleware(req,{},()=>{})
        expect(req).to.have.property("userId")
        // to restore jwt as defined original in code, so that we can use original jwt.verify in next test
        expect(req).to.have.property("userId","abc")
        // check verify method is called in code
        expect(jwt.verify.called).to.be.true
        jwt.verify.restore()
     })
})
