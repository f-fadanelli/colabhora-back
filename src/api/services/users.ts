import HttpResponseModel from "../../library/models/http-response"
import UserModel from "../../library/models/users"

import { findAllUsers } from "../../library/repositories/users"

import { badRequest, created, noContent, ok } from "../../library/utils/http-response"

export const getUserService = async():Promise<HttpResponseModel>=>{
    const data = await findAllUsers()
    
    let response
    
    if(data.length>0){
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}

// export const getUserByIdService = async(id: number):Promise<HttpResponseModel>=>{
//     const data = await findUserById(id)
    
//     let response
    
//     if(data){
//         response = await ok(data)
//     }
//     else{
//         response = await noContent()
//     }
    
//     return response
// }

// export const postUserService = async(User: UserModel):Promise<HttpResponseModel>=>{
//     let response

//     if(User){
//         //só deve entrar aqui após validar também os campos do User com joi, se não validar, jogar pro else
//         await insertUser(User)
//         response=created()
//     }
//     else{
//         response=badRequest()
//     }

//     return response    
// }

// export const patchUserByIdService = async(id: number, statistics: StatisticsModel):Promise<HttpResponseModel>=>{
//     let response = badRequest()

//     if(statistics){
//         //só deve entrar aqui após validar também os campos do User com joi, se não validar, jogar pro else
//         const updatedUser = await updateUserById(id, statistics)

//         if(updatedUser){
//             response=ok(updatedUser)
//         }
//     }
    
//     return response   
// }

// export const deleteUserByIdService = async(id: number):Promise<HttpResponseModel>=>{
//     let response
    
//     if(await deleteUserById(id)){
//         response = ok({message: "Deleted!"}) 
//     }
//     else{
//         response = badRequest()
//     }

//     return response    
// }