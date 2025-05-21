import { Router } from "express"
import users from "../routes/users"
import categories from "./categories"
import skills from './skills'
import cities from './cities'
import states from './states'
import status from './status'
import services from "./services"

const router = Router()

users(router)
categories(router)
skills(router)
cities(router)
states(router)
status(router)
services(router)


export default router