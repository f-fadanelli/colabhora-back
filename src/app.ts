
import express from "express"
import router from "./api/routes/routes"
import cors from "cors"

function createApp(){
    const app = express()

    app.use(express.json())
    app.use("/api/v1", router)

    const corsOptions={
        origin: '*'
    }

    app.use(cors(corsOptions))

    return app
}

export default createApp