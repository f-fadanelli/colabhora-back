
import { Router } from "express"
import { getUsers } from "../controllers/users"

export default function (router: Router) {
    router.get("/users", getUsers)
}