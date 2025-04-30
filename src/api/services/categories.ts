import HttpResponseModel from "../../library/models/http-response"

import { findAllCategories } from "../../library/repositories/categories"

import { badRequest, created, noContent, ok } from "../../library/utils/http-response"

export const getCategoryService = async():Promise<HttpResponseModel>=>{
    const data = await findAllCategories()
    
    let response
    
    if(data.length>0){
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}
