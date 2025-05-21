import { Request, Response } from "express"
import HttpResponseModel from "../../library/models/http-response"
import { getServiceCategoriesService, getServiceProviderUsersService, getServiceService, getServiceSkillsService, patchServiceProvidersService, postServiceService } from "../services/services"

export const getServices = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getServiceService(req.validated?.query)

    res.status(response.statusCode).json(response.body)
}

export const getServiceSkills = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getServiceSkillsService(req.validated?.query)
    
    res.status(response.statusCode).json(response.body)
}

export const getServiceCategories = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getServiceCategoriesService(req.validated?.query)
    
    res.status(response.statusCode).json(response.body)
}

export const getServiceProviderUsers = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getServiceProviderUsersService(req.validated?.query)
    
    res.status(response.statusCode).json(response.body)
}

export const postService = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await postServiceService(req.validated?.body)

    res.status(response.statusCode).json(response.body)
}

export const patchServiceProviders = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await patchServiceProvidersService(req.validated?.body)

    res.status(response.statusCode).json(response.body)
}
