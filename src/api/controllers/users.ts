import { Request, Response } from "express"
import { getUserService, getUserSkillsService, patchUserByIdService, postUserService, validateUserLoginService } from "../services/users"
import HttpResponseModel from "../../library/models/http-response"
import { validateUserSchema } from "../../library/schemas/users"
import { validate } from "../../library/middlewares/validation"

export const getUsers = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getUserService(req.validated?.query)

    res.status(response.statusCode).json(response.body)
}

export const getUserSkills = async (req: Request, res: Response)=>{
    
    //@ts-ignore
    const response:HttpResponseModel = await getUserSkillsService(req.validated?.query)
    
    res.status(response.statusCode).json(response.body)
}

export const postUserLogin = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await validateUserLoginService(req.validated?.body)

    res.status(response.statusCode).json(response.body)
}

export const postUser = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await postUserService(req.validated?.body)

    res.status(response.statusCode).json(response.body)
}

export const patchUserById  = async (req: Request, res: Response)=>{

    const response:HttpResponseModel = await patchUserByIdService(req.validated?.body)

    res.status(response.statusCode).json(response.body)
}