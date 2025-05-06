import HttpResponseModel from "../../library/models/http-response"
import { TransactionResult } from "../../library/models/transaction-response"
import { findAllSkills, insertSkill, updateSkill } from "../../library/repositories/skills"
import { SkillInput, SkillSearch, SkillUpdate } from "../../library/schemas/skills"

import { badRequest, created, noContent, ok } from "../../library/utils/http-response"

export const getSkillService = async(filter: SkillSearch):Promise<HttpResponseModel>=>{
    
    const data = await findAllSkills(filter)
    
    let response
    
    if(data.length>0){
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}

export const postSkillService = async(skill: SkillInput):Promise<HttpResponseModel>=>{
    
    const data = await findAllSkills({'nom_habilidade': skill.nom_habilidade})
    
    let response
    
    if(data.length>0){
        response = await badRequest("Habilidade com o nome informado já foi cadastrada!")
    }
    else{
        const result: TransactionResult = await insertSkill(skill)
        
        if (result.success){ 
            response = await created(result.id)
        }
        else
            response = await badRequest(result.message)
    }
    
    return response
}

export const patchSkillByIdService = async(skill: SkillUpdate):Promise<HttpResponseModel>=>{
    
    const data = await findAllSkills({'nom_habilidade': skill.nom_habilidade})
    
    let response
    
    if(data.length>0 && data[0].id_habilidade!=skill.id_habilidade){
        response = await badRequest("Habilidade com o nome informado já foi cadastrada!")
    }
    else{
        const result: TransactionResult = await updateSkill(skill)
        
        if (result.success){ 
            response = await ok(result.message)
        }
        else
            response = await badRequest(result.message)
    }
    
    return response
}
