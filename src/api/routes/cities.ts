
import { Router } from "express"
import { validate } from "../../library/middlewares/validation"
import { authenticateToken } from "../../library/middlewares/authentication"
import { getCitySchema } from "../../library/schemas/cities"
import { getCities } from "../controllers/cities"

export default function (router: Router) {
    
    router.get("/city", validate(getCitySchema, 'query'), authenticateToken('default'), getCities)

}
