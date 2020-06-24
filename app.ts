// const text = "Testing and stored in file"
// const encoder = new TextEncoder()
// const data = encoder.encode(text)
// Deno.writeFile("message.txt",data).then(()=>{
//     console.log("wrote to file")
// })



// import { serve } from "https://deno.land/std/http/server.ts";
// const server = serve({port:3000});
// for await (const req of server){
//     req.respond({body:"Hello\n"});
// }


import {Application} from "https://deno.land/x/oak/mod.ts"
const app = new Application()

app.use((ctx,next) =>{
    ctx.response.body = "Hello"
})

await app.listen({port:8000})