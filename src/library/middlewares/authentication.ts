import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import { forbidden, unauthorized } from '../utils/http-response'
import { DecodedToken } from '../types/decoded-token'

const JWT_SECRET = process.env.JWT_SECRET || 'meu_secret'

export function authenticateToken(role: string): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        let response

        if (!token) {
            response = await unauthorized()
            res.status(response.statusCode).json(response.body)
            return
        }

        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                response = await forbidden()
                res.status(response.statusCode).json(response.body)
                return
            }

            const user = decoded as DecodedToken

            if(role==='admin' && user?.flg_tipo_usuario!=='AD'){
                response = await forbidden()
                res.status(response.statusCode).json(response.body)
                return
            }

            req.user = user
            next()
        });
    };
}
