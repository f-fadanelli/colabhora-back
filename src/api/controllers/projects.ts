import { Request, Response } from "express"
import HttpResponseModel from "../../library/models/http-response"
import { getProjectService, postProjectService } from "../services/projects"

export const getProjects = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getProjectService(req.validated?.query)

    res.status(response.statusCode).json(response.body)
}

export const postProject = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await postProjectService(req.validated?.body)

    res.status(response.statusCode).json(response.body)
}
