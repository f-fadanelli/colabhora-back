import { Router } from "express"
import users from "../routes/users"
import categories from "./categories"
import skills from './skills'

const router = Router()

users(router)
categories(router)
skills(router)


export default router