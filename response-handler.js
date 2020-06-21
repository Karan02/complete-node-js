// we defined type module in package.json
import path,{join,dirname} from "path"
import fs  from "fs/promises"
import { fileURLToPath } from "url"
//here import.meta.url gives path to response-handler.js
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const resHandler = (req,res,next) =>{
    // fs.readFile("my-page.html","utf-8").then((err,data)=>{
    //     res.send(data)
    // }).catch(err=>{console.log(err)})

    
    // with this ecma syntax there is no more globals so __dirname wont work 
    res.sendFile(path.join(__dirname,"my-page.html"))
}

// export default resHandler