import createApp from "./app"
import { types } from "pg"

const app = createApp()

const port = process.env.PORT

types.setTypeParser(1114, val => val); 

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})