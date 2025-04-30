import HttpResponseModel from "../models/http-response"

export const ok = async (data:any): Promise<HttpResponseModel> =>{
    return {
        statusCode: 200,
        body: data
    }
}

export const created = async (): Promise<HttpResponseModel> =>{
    return {
        statusCode: 201,
        body: {message: "Sucess!"}
    }
}

export const noContent = async (): Promise<HttpResponseModel> =>{
    return {
        statusCode: 204,
        body: null
    }
}

export const badRequest = async (): Promise<HttpResponseModel> =>{
    return {
        statusCode: 400,
        body: {error: "Bad Request!"}
    }
}