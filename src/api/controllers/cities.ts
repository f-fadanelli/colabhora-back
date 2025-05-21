import { Request, Response } from "express"
import HttpResponseModel from "../../library/models/http-response"
import { getCityService } from "../services/cities"

export const getCities = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getCityService(req.validated?.query)

    res.status(response.statusCode).json(response.body)
}
