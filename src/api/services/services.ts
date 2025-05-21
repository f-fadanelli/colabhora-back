import StatusEnum from "../../library/enums/status"
import HttpResponseModel from "../../library/models/http-response"
import { TransactionResult } from "../../library/models/transaction-response"
import { findAllServices, findConflictServices, findServiceCategories, findServiceProviderUsers, findServiceSkills, insertService, updateServiceProviders } from "../../library/repositories/services"
import { findAllUsers, findUserSkills } from "../../library/repositories/users"
import { ServiceCategoriesSearch, ServiceInput, ServiceProviderUpdate, ServiceProviderUsersSearch, ServiceSearch, ServiceSkillsSearch } from "../../library/schemas/services"

import { badRequest, created, noContent, ok } from "../../library/utils/http-response"

export const getServiceService = async(filter: ServiceSearch):Promise<HttpResponseModel>=>{
    let data = await findAllServices(filter)
    
    let response
    
    if(data.length>0){
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}

export const getServiceSkillsService = async(filter: ServiceSkillsSearch):Promise<HttpResponseModel>=>{
    let data = await findServiceSkills(filter)
    
    let response
    
    if(data.length>0){
        
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}

export const getServiceCategoriesService = async(filter: ServiceCategoriesSearch):Promise<HttpResponseModel>=>{
    let data = await findServiceCategories(filter)
    
    let response
    
    if(data.length>0){
        
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}

export const getServiceProviderUsersService = async(filter: ServiceProviderUsersSearch):Promise<HttpResponseModel>=>{
    let data = await findServiceProviderUsers(filter)
    
    let response
    
    if(data.length>0){
        
        response = await ok(data)
    }
    else{
        response = await noContent()
    }
    
    return response
}

export const postServiceService = async(service: ServiceInput):Promise<HttpResponseModel>=>{
    
    let response

    const {dth_servico, dth_fim_servico, num_qtd_prestadores, id_usuario_solicitante} = service
    
    let num_tempo_estimado = dth_fim_servico.getTime() - dth_servico.getTime()
    num_tempo_estimado = num_tempo_estimado / (1000 * 60 * 60)
    const num_tempo_total = num_tempo_estimado * num_qtd_prestadores

    const userData = await findAllUsers({id_usuario: id_usuario_solicitante})

    if (userData.length > 0) {
        const user = userData[0]
        if (user.num_saldo_horas >= num_tempo_total) {

            const dateConflict = await findConflictServices({id_usuario: id_usuario_solicitante, dth_servico, dth_fim_servico })

            if (dateConflict.length > 0) {
                response = await badRequest("Não é possível criar o serviço por conta de conflitos de horários!")
            }
            else {
                service['num_tempo_estimado'] = num_tempo_estimado
                service['num_novo_saldo'] = user.num_saldo_horas - num_tempo_total

                const result: TransactionResult = await insertService(service)

                if (result.success) {
                    response = await created(result.id)
                }
                else
                    response = await badRequest(result.message)
            }
        }
        else {
            response = await badRequest('Saldo de Horas do usuário é insuficiente para solicitar serviço!')
        }
    }
    else{
        response = await badRequest('Usuário inválido!')
    }
    
    return response
}

export const patchServiceProvidersService = async(serviceProvider: ServiceProviderUpdate):Promise<HttpResponseModel>=>{
    
    let response

    const {id_servico, id_usuario_prestador} = serviceProvider

    //valida habilidades do usuário e serviço
    const serviceRequiredSkills = await findServiceSkills({id_servico: id_servico})
    const userSkills = await findUserSkills({id_usuario: id_usuario_prestador})
    
    const serviceSkillsIds = serviceRequiredSkills.map(elem=>elem.id_habilidade)
    const userSkillsIds = userSkills.map(elem=>elem.id_habilidade)

    const hasAllSkills = serviceSkillsIds.every(elem => userSkillsIds.includes(elem))

    if (hasAllSkills) {
        //valida hora de serviço e usuário
        const service = await findAllServices({ id_servico: id_servico })
        const { dth_servico, dth_fim_servico, num_qtd_prestadores, num_qtd_prestadores_confirmados } = service[0]
        const dateConflict = await findConflictServices({ id_usuario: id_usuario_prestador, dth_servico, dth_fim_servico })
        if (dateConflict.length > 0) {
            response = await badRequest("Não é possível criar o serviço por conta de conflitos de horários!")
        }
        else {

            let id_novo_status

            //Valida se o número de prestadores não vai extrapolar a quantidade solicitada
            if (num_qtd_prestadores == num_qtd_prestadores_confirmados) {
                response = await badRequest("O serviço já está lotado!")
            }
            else {
                if (num_qtd_prestadores_confirmados + 1 == num_qtd_prestadores) {
                    id_novo_status = StatusEnum.TOTAL_ACCEPTED
                }
                else {
                    id_novo_status = StatusEnum.PARCIAL_ACCEPTED
                }
                const result: TransactionResult = await updateServiceProviders({ id_servico, id_usuario_prestador, id_novo_status })

                if (result.success) {
                    response = await created(result.id)
                }
                else
                    response = await badRequest(result.message)
            }
           
        }
    }
    else
        response = await badRequest('O usuário deve ter as habilidades necessárias para prestar o serviço!')

    

    return response
}

// export const patchUserByIdService = async(user: UserUpdate):Promise<HttpResponseModel>=>{
    
//     const data = await findAllUsers({'cod_email_usuario': user.cod_email_usuario})
    
//     let response
    
//     if(data.length>0 && data[0].id_usuario!=user.id_usuario){
//         response = await badRequest("Usuario com o nome informado já foi cadastrada!")
//     }
//     else{

//         const result: TransactionResult = await updateUser(user)
        
//         if (result.success){ 
//             response = await ok(result.message)
//         }
//         else
//             response = await badRequest(result.message)
//     }
    
//     return response
// }
