
import { Router } from "express"
import { validate } from "../../library/middlewares/validation"
import { authenticateToken } from "../../library/middlewares/authentication"
import { getStatusSchema } from "../../library/schemas/status"
import { getStatus } from "../controllers/status"

export default function (router: Router) {
    
    router.get("/status", validate(getStatusSchema, 'query'), authenticateToken('default'), getStatus)

}
