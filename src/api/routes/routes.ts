import { Router } from "express"
import users from "../routes/users"
import categories from "./categories"

const router = Router()

users(router)
categories(router)

export default router