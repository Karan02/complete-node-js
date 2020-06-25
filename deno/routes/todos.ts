import { Router } from 'https://deno.land/x/oak/mod.ts';
import {getDb} from "../helpers/db_client.ts"
import { ObjectId } from "https://deno.land/x/mongo@v0.8.0/mod.ts";

const router = new Router();

interface Todo {
  //? is for optional
  id?: string;
  text: string;
}

 

router.get('/todos',async (ctx) => {
  const todos =await getDb().collection("todos").find(); //{_id:Object,text:"..."}
  const transformedTodos = todos.map((todo:{_id:ObjectId,text:string}) => {
    return { id:todo._id.$oid , text: todo.text}
  })
  ctx.response.body = { todos: transformedTodos };
});

router.post('/todos', async (ctx) => {
  const data = await ctx.request.body();
  const newTodo: Todo = {
    
    text: data.value.text,
  };

  const id = await getDb().collection("todos").insertOne(newTodo)
  //oid converts to string
  newTodo.id = id.$oid
   

  ctx.response.body = { message: 'Created todo!', todo: newTodo };
});

router.put('/todos/:todoId', async (ctx) => {
  //tid never be undefined ,always be string so add ! to todoId
  const tid = ctx.params.todoId!;
  const data = await ctx.request.body();
  await getDb().collection("todos").updateOne({_id:ObjectId(tid)},{$set:{text:data.value.text}})
  ctx.response.body = { message: 'Updated todo' };
});

router.delete('/todos/:todoId',async (ctx) => {
  //tid never be undefined ,always be string so add ! to todoId
  const tid = ctx.params.todoId!;
  await getDb().collection("todos").deleteOne({_id:ObjectId(tid)})
  ctx.response.body = { message: 'Deleted todo' };
});

export default router;
