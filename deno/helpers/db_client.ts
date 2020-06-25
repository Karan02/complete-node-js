import { MongoClient,Database } from "https://deno.land/x/mongo@v0.8.0/mod.ts";
let db:Database
export function connect(){
    const client = new MongoClient();
client.connectWithUri("mongodb://karan:karan@cluster0-shard-00-00-tt6mn.mongodb.net:27017,cluster0-shard-00-01-tt6mn.mongodb.net:27017,cluster0-shard-00-02-tt6mn.mongodb.net:27017/todo-app?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority");
db = client.database("todo-app")
}
export function getDb(){
    return db
}

