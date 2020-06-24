// const fs = require("fs").promises
// const text = "Testing and stored in file"
// fs.writeFile("node-message.txt",text).then((()=>{
//     console.log("wrote file")
// }))

const http = require("http")
const server = http.createServer((req,res)=>{
    res.end("hello world from node")
})

server.listen(3000)