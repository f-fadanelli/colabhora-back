import { Request, Response } from "express"
import { getUserService } from "../services/users"
import HttpResponseModel from "../../library/models/http-response"

export const getUsers = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getUserService()

    res.status(response.statusCode).json(response.body)
}

