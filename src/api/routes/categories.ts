
import { Router } from "express"
import { getCategories } from "../controllers/categories"

export default function (router: Router) {
    router.get("/categories", getCategories)
}