import { Request, Response } from "express"
import HttpResponseModel from "../../library/models/http-response"
import { getStatusService } from "../services/status"

export const getStatus = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getStatusService(req.validated?.query)

    res.status(response.statusCode).json(response.body)
}
