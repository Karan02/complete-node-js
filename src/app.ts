// we installed @types/node so work with typescript lint
import express from "express"
import todosRoutes from "./routes/todos"
import bodyParser from "body-parser"
const app = express()
app.use(bodyParser.json())
app.use(todosRoutes)
// we installed @types/express
app.listen(3000)

// types package for converting node libraries from typescript to javascript