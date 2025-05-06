
import { Router } from "express"
import { getUsers, getUserSkills, patchUserById, postUser, postUserLogin } from "../controllers/users"
import { getSkillsByUserSchema, getUserSchema, patchUserSchema, postUserSchema, validateUserSchema } from "../../library/schemas/users"
import { validate } from "../../library/utils/validation"
import { authenticateToken } from "../../library/utils/authentication"

export default function (router: Router) {
    
    router.post("/user/validate", validate(validateUserSchema, 'body'), postUserLogin),
    
    router.get("/user", validate(getUserSchema, 'query'), authenticateToken('default'), getUsers),

    router.get("/user/skills", validate(getSkillsByUserSchema, 'query'), authenticateToken('default'), getUserSkills),

    router.post("/user", validate(postUserSchema, 'body'), postUser)

    router.patch("/user", validate(patchUserSchema, 'body'), authenticateToken('default'), patchUserById)

}