import HttpResponseModel from "../../library/models/http-response"
import { TransactionResult } from "../../library/models/transaction-response"
import { findAllProjects, insertProject } from "../../library/repositories/projects"
import { findAllUsers } from "../../library/repositories/users"
import { ProjectInput, ProjectSearch } from "../../library/schemas/projects"

import { badRequest, created, noContent, ok } from "../../library/utils/http-response"

export const getProjectService = async(filter: ProjectSearch):Promise<HttpResponseModel>=>{
    
    const data = await findAllProjects(filter)
    
    let response
    
    if(data.length>0){
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}

export const postProjectService = async(project: ProjectInput):Promise<HttpResponseModel>=>{
    
    const data = await findAllUsers({'id_usuario': project.id_usuario_responsavel})
    
    let response
    
    if(data.length>0){
        const user = data[0]

        if(user.flg_tipo_usuario!='PJ'){
            response = await badRequest("Usuário deve ser do tipo PJ!")
        }
        else{
            const result: TransactionResult = await insertProject(project)
        
            if (result.success){ 
                response = await created(result.id)
            }
            else
                response = await badRequest(result.message)
        }
    }
    else{
        response = await badRequest("Usuário inválido!")
    }
    
    return response
}
