import { Request, Response } from "express"
import HttpResponseModel from "../../library/models/http-response"
import { getSkillService, patchSkillByIdService, postSkillService } from "../services/skills"

export const getSkills = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getSkillService(req.query)

    res.status(response.statusCode).json(response.body)
}

export const postSkill = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await postSkillService(req.body)

    res.status(response.statusCode).json(response.body)
}

export const patchSkillById  = async (req: Request, res: Response)=>{

    const response:HttpResponseModel = await patchSkillByIdService(req.body)

    res.status(response.statusCode).json(response.body)
}