import HttpResponseModel from "../../library/models/http-response"
import { findAllStates } from "../../library/repositories/states"
import { StateSearch } from "../../library/schemas/states"

import { noContent, ok } from "../../library/utils/http-response"

export const getStateService = async(filter: StateSearch):Promise<HttpResponseModel>=>{
    
    const data = await findAllStates(filter)
    
    let response
    
    if(data.length>0){
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}
