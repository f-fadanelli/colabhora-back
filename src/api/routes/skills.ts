
import { Router } from "express"
import { validate } from "../../library/middlewares/validation"
import { getSkills, patchSkillById, postSkill } from "../controllers/skills"
import { getSkillSchema, patchSkillSchema, postSkillSchema } from "../../library/schemas/skills"
import { authenticateToken } from "../../library/middlewares/authentication"

export default function (router: Router) {
    
    router.get("/skill", validate(getSkillSchema, 'query'), authenticateToken('default'), getSkills)

    router.post("/skill", validate(postSkillSchema, 'body'), authenticateToken('admin'), postSkill)

    router.patch("/skill", validate(patchSkillSchema, 'body'), authenticateToken('admin'), patchSkillById)
}
