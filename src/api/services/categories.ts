import HttpResponseModel from "../../library/models/http-response"
import { TransactionResult } from "../../library/models/transaction-response"

import { findAllCategories, insertCategory, updateCategory } from "../../library/repositories/categories"
import { CategoryInput, CategorySearch, CategoryUpdate } from "../../library/schemas/categories"

import { badRequest, created, noContent, ok } from "../../library/utils/http-response"

export const getCategoryService = async(filter: CategorySearch):Promise<HttpResponseModel>=>{
    
    const data = await findAllCategories(filter)
    
    let response
    
    if(data.length>0){
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}

export const postCategoryService = async(category: CategoryInput):Promise<HttpResponseModel>=>{
    
    const data = await findAllCategories({'nom_categoria': category.nom_categoria})
    
    let response
    
    if(data.length>0){
        response = await badRequest("Categoria com o nome informado já foi cadastrada!")
    }
    else{
        const result: TransactionResult = await insertCategory(category)
        
        if (result.success){ 
            response = await created(result.id)
        }
        else
            response = await badRequest(result.message)
    }
    
    return response
}

export const patchCategoryByIdService = async(category: CategoryUpdate):Promise<HttpResponseModel>=>{
    
    const data = await findAllCategories({'nom_categoria': category.nom_categoria})
    
    let response
    
    if(data.length>0 && data[0].id_categoria!=category.id_categoria){
        response = await badRequest("Categoria com o nome informado já foi cadastrada!")
    }
    else{
        const result: TransactionResult = await updateCategory(category)
        
        if (result.success){ 
            response = await ok(result.message)
        }
        else
            response = await badRequest(result.message)
    }
    
    return response
}
