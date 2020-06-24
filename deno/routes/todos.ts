import {Application,Router} from "https://deno.land/x/oak/mod.ts"

const router = new Router()
interface Todo {
    id:string
    text:string
}
let todos:Todo[] = []
router.get("/todos",(ctx)=>{
    ctx.response.body = {
        todos:todos
    }
})

router.post("/todos",async (ctx)=>{
    const data =await ctx.request.body()
    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: data.value.text
    }
    todos.push(newTodo)
    ctx.response.body = {
        message:"Created",
        todo:newTodo
    }
})
router.put("/todos/:todosId",async (ctx)=>{
    
    
    const data =await ctx.request.body()
    
    const tid = ctx.params.todosId 
     
   const todoIndex = todos.findIndex(todo => {
    return todo.id === tid
    })

    todos[todoIndex] = {id: (todos[todoIndex]).id,text:data.value.text}
   
    ctx.response.body = { message:"Updated" }

})
router.delete("/todos/:todoId",(ctx)=>{
    const tid = ctx.params.todoId 
    todos = todos.filter(todo => todo.id !== tid)
    ctx.response.body = { message:"deleted" }
    
})

export default router