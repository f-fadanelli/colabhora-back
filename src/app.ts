import express, { Application, Request, NextFunction } from "express"
import router from "./api/routes/routes"

export class Server {
    public app: Application

    constructor() {
        this.app = express()
        this.middlewares()
        this.routes()
    }

    private middlewares(): void {
        // Limites de payload
        this.app.use(express.json({ limit: '500mb' }))
        this.app.use(express.urlencoded({
            limit: '500mb',
            extended: true,
            parameterLimit: 500000
        }))

        // Middleware CORS customizado
        this.app.use((req: Request, res: any, next: NextFunction) => {
            const origin = req.get('Origin') || '*'
            res.header('Access-Control-Allow-Origin', origin)
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS')
            res.header('Access-Control-Allow-Headers',
                '*, access-control-allow-headers, x-authorization-method, accept-language, authentication, referer, cache-control, Access, Content-type, Authorization, Accept, Origin, X-Requested-With, x-api-key, x-ms-access-token, access-control-allow-origin')
            res.header('Access-Control-Allow-Credentials', 'true')

            if (req.method === 'OPTIONS') {
                return res.sendStatus(204)
            }

            next()
        })
    }

    private routes(): void {
        this.app.use("/api/v1", router)
    }

    public getApp(): Application {
        return this.app
    }
}
