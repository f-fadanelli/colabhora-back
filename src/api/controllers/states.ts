import { Request, Response } from "express"
import HttpResponseModel from "../../library/models/http-response"
import { getStateService } from "../services/states"

export const getStates = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getStateService(req.validated?.query)

    res.status(response.statusCode).json(response.body)
}
