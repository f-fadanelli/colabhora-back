
import { Router } from "express"
import { validate } from "../../library/middlewares/validation"
import { authenticateToken } from "../../library/middlewares/authentication"
import { getProjectSchema, postProjectSchema } from "../../library/schemas/projects"
import { getProjects, postProject } from "../controllers/projects"

export default function (router: Router) {
    
    router.get("/project", validate(getProjectSchema, 'query'), authenticateToken('default'), getProjects)

    router.post("/project", validate(postProjectSchema, 'body'), authenticateToken('default'), postProject)
}
