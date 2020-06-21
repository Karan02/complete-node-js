// we defined type module in package.json
import fs from "fs"  
import express from "express"
import { resHandler } from "./response-handler.js"
const app = express();

app.get('/', resHandler);

app.listen(3000);
