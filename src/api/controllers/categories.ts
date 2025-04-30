import { Request, Response } from "express"
import HttpResponseModel from "../../library/models/http-response"
import { getCategoryService } from "../services/categories"

export const getCategories = async (req: Request, res: Response)=>{
    
    const response:HttpResponseModel = await getCategoryService()

    res.status(response.statusCode).json(response.body)
}

// export const getPlayerById = async (req: Request, res: Response)=>{
//     const id = parseInt(req.params.id)
//     const response:HttpResponseModel = await getPlayerByIdService(id)

//     res.status(response.statusCode).json(response.body)
// }

// export const postPlayer = async (req: Request, res: Response)=>{
//     const player = req.body
//     const response:HttpResponseModel = await postPlayerService(player)

//     res.status(response.statusCode).json(response.body)
// }

// export const patchPlayerById  = async (req: Request, res: Response)=>{
//     const statistics = req.body
//     const id = parseInt(req.params.id)

//     const response:HttpResponseModel = await patchPlayerByIdService(id, statistics)

//     res.status(response.statusCode).json(response.body)
// }

// export const deletePlayerById = async (req: Request, res: Response)=>{
//     const id = parseInt(req.params.id)
//     const response:HttpResponseModel = await deletePlayerByIdService(id)

//     res.status(response.statusCode).json(response.body)
// }