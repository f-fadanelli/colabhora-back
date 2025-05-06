import { Request, Response } from "express"
import { getUserService, getUserSkillsService, patchUserByIdService, postUserService, validateUserLoginService } from "../services/users"
import HttpResponseModel from "../../library/models/http-response"

export const getUsers = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getUserService(req.query)

    res.status(response.statusCode).json(response.body)
}

export const getUserSkills = async (req: Request, res: Response)=>{
    
    //@ts-ignore
    const response:HttpResponseModel = await getUserSkillsService(req.query)
    
    res.status(response.statusCode).json(response.body)
}

export const postUserLogin = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await validateUserLoginService(req.body)

    res.status(response.statusCode).json(response.body)
}

export const postUser = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await postUserService(req.body)

    res.status(response.statusCode).json(response.body)
}

export const patchUserById  = async (req: Request, res: Response)=>{

    const response:HttpResponseModel = await patchUserByIdService(req.body)

    res.status(response.statusCode).json(response.body)
}