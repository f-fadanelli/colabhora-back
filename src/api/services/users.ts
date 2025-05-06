import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

import HttpResponseModel from "../../library/models/http-response"
import { TransactionResult } from "../../library/models/transaction-response"

import { findAllUsers, findUserSkills, insertUser, updateUser } from "../../library/repositories/users"
import { UserInput, UserSearch, UserSkillsSearch, UserUpdate, UserValidate } from "../../library/schemas/users"

import { badRequest, created, noContent, ok } from "../../library/utils/http-response"

const JWT_SECRET = process.env.JWT_SECRET || 'meu_secret'

export const getUserService = async(filter: UserSearch):Promise<HttpResponseModel>=>{
    let data = await findAllUsers(filter)
    
    let response
    
    if(data.length>0){

        data.forEach((elem)=> {
            delete elem['cod_senha_usuario']
        })

        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}

export const getUserSkillsService = async(filter: UserSkillsSearch):Promise<HttpResponseModel>=>{
    let data = await findUserSkills(filter)
    
    let response
    
    if(data.length>0){
        
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}

export const validateUserLoginService = async(user: UserValidate):Promise<HttpResponseModel>=>{
    
    const data = await findAllUsers({'cod_email_usuario': user.cod_email_usuario})
    
    let response
    
    if(data){

        const foundUser = data[0]

        const valid = await bcrypt.compare(user.cod_senha_usuario, foundUser.cod_senha_usuario)

        if (!valid) 
            response = await badRequest("Invalid Credentials")
        else{
            const token = jwt.sign({ id_usuario: foundUser.id_usuario, flg_tipo_usuario: foundUser.flg_tipo_usuario }, JWT_SECRET, { expiresIn: '2h' })
            response = await ok({token})
        }
    }
    else{
        response = await badRequest("Invalid Credentials")
    }
    
    return response
}

export const postUserService = async(user: UserInput):Promise<HttpResponseModel>=>{
    
    const data = await findAllUsers({'cod_email_usuario': user.cod_email_usuario})
    
    let response
    
    if(data.length>0){
        response = await badRequest("Usuario com o email informado já foi cadastrado!")
    }
    else{
        const hashedPassword = await bcrypt.hash(user.cod_senha_usuario, 10);

        user['cod_senha_usuario'] = hashedPassword 

        const result: TransactionResult = await insertUser(user)
        
        if (result.success){ 
            response = await created(result.id)
        }
        else
            response = await badRequest(result.message)
    }
    
    return response
}

export const patchUserByIdService = async(user: UserUpdate):Promise<HttpResponseModel>=>{
    
    const data = await findAllUsers({'cod_email_usuario': user.cod_email_usuario})
    
    let response
    
    if(data.length>0 && data[0].id_usuario!=user.id_usuario){
        response = await badRequest("Usuario com o nome informado já foi cadastrada!")
    }
    else{

        const result: TransactionResult = await updateUser(user)
        
        if (result.success){ 
            response = await ok(result.message)
        }
        else
            response = await badRequest(result.message)
    }
    
    return response
}
