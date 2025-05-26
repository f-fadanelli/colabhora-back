
import { types } from "pg"
import { Server } from "./app"

types.setTypeParser(1114, val => val); 

const port = process.env.PORT

const server = new Server()
const app = server.getApp()

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})