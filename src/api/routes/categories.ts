
import { Router } from "express"
import { getCategories, patchCategoryById, postCategory } from "../controllers/categories"
import { validate } from "../../library/middlewares/validation"
import { getCategorySchema, patchCategorySchema, postCategorySchema } from "../../library/schemas/categories"
import { authenticateToken } from "../../library/middlewares/authentication"

export default function (router: Router) {
    
    router.get("/category", validate(getCategorySchema, 'query'), authenticateToken('default'), getCategories)

    router.post("/category", validate(postCategorySchema, 'body'), authenticateToken('admin'), postCategory)

    router.patch("/category", validate(patchCategorySchema, 'body'), authenticateToken('admin'), patchCategoryById)
}
