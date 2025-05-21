import HttpResponseModel from "../../library/models/http-response"
import { findAllCities } from "../../library/repositories/cities"
import { CitySearch } from "../../library/schemas/cities"

import { noContent, ok } from "../../library/utils/http-response"

export const getCityService = async(filter: CitySearch):Promise<HttpResponseModel>=>{
    
    const data = await findAllCities(filter)
    
    let response
    
    if(data.length>0){
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}
