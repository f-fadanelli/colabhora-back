import { Request, Response } from "express"
import HttpResponseModel from "../../library/models/http-response"
import { getCategoryService, patchCategoryByIdService, postCategoryService } from "../services/categories"

export const getCategories = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getCategoryService(req.validated?.query)

    res.status(response.statusCode).json(response.body)
}

export const postCategory = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await postCategoryService(req.validated?.body)

    res.status(response.statusCode).json(response.body)
}

export const patchCategoryById  = async (req: Request, res: Response)=>{

    const response:HttpResponseModel = await patchCategoryByIdService(req.validated?.body)

    res.status(response.statusCode).json(response.body)
}