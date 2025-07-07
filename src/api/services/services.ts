import StatusEnum from "../../library/enums/status"
import HttpResponseModel from "../../library/models/http-response"
import { TransactionResult } from "../../library/models/transaction-response"
import { findAllServices, findConflictServices, findServiceCategories, findServiceProviderUsers, findServiceSkills, insertService, updateServiceCancelation, updateServiceFinalization, updateServiceProviders, updateServiceRate } from "../../library/repositories/services"
import { findAllUsers, findUserSkills } from "../../library/repositories/users"
import { ServiceCancelationUpdate, ServiceCategoriesSearch, ServiceFinalizationUpdate, ServiceInput, ServiceProviderUpdate, ServiceProviderUsersSearch, ServiceRateUpdate, ServiceSearch, ServiceSkillsSearch } from "../../library/schemas/services"
import { arraysNumericosIguais, decimalParaHorasEMinutos } from "../../library/utils/general"

import { badRequest, created, noContent, ok } from "../../library/utils/http-response"
import { sendEmail } from "../../library/utils/mails"

export const getServiceService = async(filter: ServiceSearch):Promise<HttpResponseModel>=>{
    let data = await findAllServices(filter)
    
    let response
    
    if(data.length>0){

        data.forEach((elem)=> {
            elem['num_tempo_estimado_st'] = decimalParaHorasEMinutos(elem.num_tempo_estimado)
        })

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

                if(user.flg_tipo_usuario=='PF'){
                    service['num_novo_saldo'] = user.num_saldo_horas - num_tempo_total
                }
                else{
                    service['num_novo_saldo'] = user.num_saldo_horas
                }

                const result: TransactionResult = await insertService(service)

                if (result.success) {
                    const subject = `Criação de Serviço ${result.id}: ${service.nom_servico}`
                    const text = `Olá, ${user.nom_usuario}! Seu novo serviço foi criado com o código ${result.id}!`
                    const receivers = [user.cod_email_usuario] 
                    const emailNotification = await sendEmail(receivers, subject, text)
                    
                    if(emailNotification.success){
                        console.log('Enviado')
                    }
                    
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

        const providerUserSearch = await findAllUsers({id_usuario: id_usuario_prestador})
        const providerUser = providerUserSearch[0]
        
        //valida hora de serviço e usuário
        const serviceSearch = await findAllServices({ id_servico: id_servico })
        const service = serviceSearch[0]
        const { dth_servico, dth_fim_servico, num_qtd_prestadores, num_qtd_prestadores_confirmados } = service
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
                    const subject = `Aceite do Serviço ${id_servico}: ${service.nom_servico}`
                    const text = `Olá! Serviço ${id_servico} aceito por ${providerUser.nom_usuario}!`
                    const receivers = [providerUser.cod_email_usuario, service.cod_email_usuario] 
                    const emailNotification = await sendEmail(receivers, subject, text)
                    
                    if(emailNotification.success){
                        console.log('Enviado')
                    }
                    
                    response = await ok(result.id)
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

export const patchServiceFinalizationService = async(serviceFinalization: ServiceFinalizationUpdate):Promise<HttpResponseModel>=>{
    
    let response

    const serviceSearch = await findAllServices({id_servico: serviceFinalization.id_servico})
    
    if(serviceSearch.length>0){
        const service = serviceSearch[0]

        const {id_servico, id_usuario_solicitante, num_qtd_prestadores, num_qtd_prestadores_confirmados, num_tempo_estimado} = service

        let num_saldo_horas_reajuste=0

        //se a quantidade de prestadores for diferente da quantidade planejada, retorna a diferença de horas calculadas ao solicitante
        if(num_qtd_prestadores_confirmados<num_qtd_prestadores){
            const devolucao_horas = (num_qtd_prestadores - num_qtd_prestadores_confirmados) * num_tempo_estimado
            const userSearch = await findAllUsers({id_usuario: id_usuario_solicitante})
            const user = userSearch[0]
            const {num_saldo_horas} = user
            num_saldo_horas_reajuste = num_saldo_horas + devolucao_horas
        }

        const serviceProviders = await findServiceProviderUsers({id_servico: id_servico})

        const id_usuario_prestador_list = serviceProviders.map(elem=>parseInt(elem.id_usuario_prestador))
        
        const result: TransactionResult = await updateServiceFinalization({id_servico, id_usuario_solicitante, num_saldo_horas_reajuste, num_tempo_estimado, id_usuario_prestador_list})
        
        const usuario_prestador_info_list = serviceProviders.map(elem=>{return {id_usuario_prestador: elem.id_usuario_prestador, nom_usuario: elem.nom_usuario_prestador}})
        
        if (result.success){ 
            let receivers = serviceProviders.map(elem=>elem.cod_email_usuario_prestador)
            receivers.push(service.cod_email_usuario)
            const subject = `Finalização do Serviço ${id_servico}: ${service.nom_servico}`
            const text = `Olá! Serviço ${id_servico} finalizado com sucesso!`
            const emailNotification = await sendEmail(receivers, subject, text)

            if (emailNotification.success) {
                console.log('Enviado')
            }

            response = await ok({message: result.message, id_servico: result.id, avaliar_usuarios: usuario_prestador_info_list})
        }
        else
            response = await badRequest(result.message)
    }
    else{
        response = await badRequest('Serviço inválido!')
    }
    
    return response
}

export const patchServiceCancelationService = async(serviceCancelation: ServiceCancelationUpdate):Promise<HttpResponseModel>=>{
    
    let response

    const serviceSearch = await findAllServices({id_servico: serviceCancelation.id_servico})
    
    if(serviceSearch.length>0){
        const service = serviceSearch[0]

        const {id_servico, id_usuario_solicitante, num_qtd_prestadores, num_tempo_estimado} = service

        const devolucao_horas = num_qtd_prestadores * num_tempo_estimado
        const userSearch = await findAllUsers({id_usuario: id_usuario_solicitante})
        const user = userSearch[0]
        const {num_saldo_horas} = user
        const num_saldo_horas_reajuste = num_saldo_horas + devolucao_horas

        const serviceProviders = await findServiceProviderUsers({id_servico: id_servico})

        const result: TransactionResult = await updateServiceCancelation({id_servico, id_usuario_solicitante, num_saldo_horas_reajuste})
         
        if (result.success){ 
            let receivers = serviceProviders.map(elem=>elem.cod_email_usuario_prestador)
            receivers.push(service.cod_email_usuario)
            const subject = `Cancelamento do Serviço ${id_servico}: ${service.nom_servico}`
            const text = `Olá! Serviço ${id_servico} cancelado!`
            const emailNotification = await sendEmail(receivers, subject, text)

            if (emailNotification.success) {
                console.log('Enviado')
            }

            response = await ok({message: result.message, id_servico: result.id})
        }
        else
            response = await badRequest(result.message)
    }
    else{
        response = await badRequest('Serviço inválido!')
    }
    
    return response
}


export const patchServiceRateService = async(serviceRate: ServiceRateUpdate):Promise<HttpResponseModel>=>{
    
    let response

    const {avaliacao_usuario_list} = serviceRate

    const serviceProviders = await findServiceProviderUsers({id_servico: serviceRate.id_servico})

    const id_usuario_prestador_list = serviceProviders.map(elem=>parseInt(elem.id_usuario_prestador))

    const id_usuario_avaliado_list = avaliacao_usuario_list.map(elem=>elem.id_usuario)

    if(arraysNumericosIguais(id_usuario_prestador_list, id_usuario_avaliado_list)){
        const result: TransactionResult = await updateServiceRate(serviceRate)
        
        if (result.success){ 
            response = await ok(result)
        }
        else
            response = await badRequest(result.message)    
    }    
    else
        response = await badRequest('Lista de usuários prestadores informados não é compatível com a real')

    
    
    return response
}
