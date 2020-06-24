import {Application} from "https://deno.land/x/oak/mod.ts"
import todosRoutes from "./routes/todos.ts"
const app = new Application()

app.use(async (ctx,next) =>{
    console.log("middleware")
    // ctx will send response directly before waiting for async routes so we 
    //tell them explictly wait for async processes to finish
    await next()
})
app.use(todosRoutes.routes())
app.use(todosRoutes.allowedMethods())
await app.listen({port:3000})