import HttpResponseModel from "../../library/models/http-response"
import { findAllStatus } from "../../library/repositories/status"
import { StatusSearch } from "../../library/schemas/status"

import { noContent, ok } from "../../library/utils/http-response"

export const getStatusService = async(filter: StatusSearch):Promise<HttpResponseModel>=>{
    
    const data = await findAllStatus(filter)
    
    let response
    
    if(data.length>0){
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}
