
import { Router } from "express"
import { validate } from "../../library/middlewares/validation"
import { getStateSchema } from "../../library/schemas/states"
import { getStates } from "../controllers/states"

export default function (router: Router) {
    
    router.get("/state", validate(getStateSchema, 'query'), getStates)

}
