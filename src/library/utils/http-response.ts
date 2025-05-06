import HttpResponseModel from "../models/http-response"

export const ok = async (data:any): Promise<HttpResponseModel> =>{
    return {
        statusCode: 200,
        body: {result: data}
    }
}

export const created = async (id: number): Promise<HttpResponseModel> =>{
    return {
        statusCode: 201,
        body: {message: "Sucess!", generated_id: id}
    }
}

export const noContent = async (): Promise<HttpResponseModel> =>{
    return {
        statusCode: 204,
        body: null
    }
}

export const badRequest = async (message: any | String): Promise<HttpResponseModel> =>{
    return {
        statusCode: 400,
        body: {error: message}
    }
}

export const unauthorized = async (): Promise<HttpResponseModel> =>{
    return {
        statusCode: 401,
        body: {error: "Authentication token is missing!"}
    }
}

export const forbidden = async (): Promise<HttpResponseModel> =>{
    return {
        statusCode: 403,
        body: {error: "Not authorized!"}
    }
}