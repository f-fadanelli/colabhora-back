import poolPromise from "../database/postgressql"
import StatusEnum from "../enums/status";
import { ServiceProviderUsersModel, ServiceCategoriesModel, ServiceModel, ServiceSkillsModel } from "../models/services";
import { TransactionResult } from "../models/transaction-response";
import { ConflictServiceSearch, ServiceCategoriesSearch, ServiceFinalizationUpdate, ServiceInput, ServiceProviderUpdate, ServiceProviderUsersSearch, ServiceRateUpdate, ServiceSearch, ServiceSkillsSearch } from "../schemas/services";
import { buildWhereClause } from "../utils/queryBuilder";

export const findAllServices = async (filter: ServiceSearch = {}): Promise<ServiceModel[]> =>{
    let result

    const client = await poolPromise 

    let {id_habilidade, id_categoria, id_usuario_prestador, id_usuario_busca, dth_servico_high, dth_servico_low, dth_fim_servico_low, dth_fim_servico_high,  ...newFilter} = filter

    let { clause, values } = buildWhereClause(newFilter);

    if (dth_servico_low || dth_servico_high) {
        const lowDate = dth_servico_low ? dth_servico_low : dth_servico_high ? dth_servico_high: new Date().toISOString()
        const highDate = dth_servico_high ? dth_servico_high : dth_servico_low ? dth_servico_low : new Date().toISOString()

        clause += ` ${values.length === 0 ? 'WHERE' : 'AND'} DTH_SERVICO BETWEEN $${values.length + 1} AND $${values.length + 2} `

        values.push(lowDate)
        values.push(highDate)
    }

    if (dth_fim_servico_low || dth_fim_servico_high) {
        const lowDate = dth_fim_servico_low ? dth_fim_servico_low : dth_fim_servico_high ? dth_fim_servico_high: new Date().toISOString()
        const highDate = dth_fim_servico_high ? dth_fim_servico_high : dth_fim_servico_low ? dth_fim_servico_low : new Date().toISOString()

        clause += ` ${values.length === 0 ? 'WHERE' : 'AND'} DTH_FIM_SERVICO BETWEEN $${values.length + 1} AND $${values.length + 2} `

        values.push(lowDate)
        values.push(highDate)
    }

    if(id_habilidade){
        clause+=` ${values.length===0? 'WHERE' : 'AND'} ID_SERVICO IN (SELECT DISTINCT(ID_SERVICO) FROM TB_SERVICO_HABILIDADE WHERE ID_HABILIDADE = $${values.length + 1} ) `
        values.push(id_habilidade)
    }

    if(id_categoria){
        clause+=` ${values.length===0? 'WHERE' : 'AND'} ID_SERVICO IN (SELECT DISTINCT(ID_SERVICO) FROM TB_SERVICO_CATEGORIA WHERE ID_CATEGORIA = $${values.length + 1} ) `
        values.push(id_categoria)
    }

    if(id_usuario_prestador){
        clause+=` ${values.length===0? 'WHERE' : 'AND'} ID_SERVICO IN (SELECT DISTINCT(ID_SERVICO) FROM TB_SERVICO_PRESTADOR WHERE ID_USUARIO_PRESTADOR = $${values.length + 1} ) `
        values.push(id_usuario_prestador)
    }

    if(id_usuario_busca){
        clause+=` ${values.length===0? 'WHERE' : 'AND'} ID_USUARIO_SOLICITANTE != $${values.length + 1} AND ID_SERVICO NOT IN (SELECT DISTINCT(ID_SERVICO) FROM TB_SERVICO_PRESTADOR WHERE ID_USUARIO_PRESTADOR = $${values.length + 2} ) `
        values.push(id_usuario_busca)
        values.push(id_usuario_busca)
    }
    
    const query = `SELECT * FROM VW_SERVICO ${clause} ORDER BY ID_SERVICO DESC`;
    
    result = await client.query(query, values);

    return result.rows;
}

export const findConflictServices = async (filter: ConflictServiceSearch): Promise<ServiceModel[]> =>{
    let result

    const client = await poolPromise 

    let { dth_servico, dth_fim_servico, id_usuario} = filter
    
    //confere serviços que o usuário solicita
    const query1 = `SELECT * FROM VW_SERVICO
                    WHERE ID_USUARIO_SOLICITANTE = $1
                    AND ID_STATUS != ${StatusEnum.CANCELED}
                    AND $2 < DTH_FIM_SERVICO AND DTH_SERVICO < $3`;
    
    const values1 = [id_usuario, dth_servico, dth_fim_servico]
    const result1 = await client.query(query1, values1);

    //confere serviços que o usuário presta
    const query2 = `SELECT * FROM VW_SERVICO_PRESTADOR
                    WHERE ID_USUARIO_PRESTADOR = $1
                    AND ID_STATUS != ${StatusEnum.CANCELED}
                    AND $2 < DTH_FIM_SERVICO AND DTH_SERVICO < $3`;
    
    const values2 = [id_usuario, dth_servico, dth_fim_servico]
    const result2 = await client.query(query2, values2);

    result = result1.rows.concat(result2.rows)
    return result;
}

export const findServiceSkills = async (filter: ServiceSkillsSearch): Promise<ServiceSkillsModel[]> =>{
    let result

    const client = await poolPromise 

    let {id_servico} = filter

    const values = [id_servico];

    result = await client.query(`SELECT * FROM VW_SERVICO_HABILIDADE  
                                WHERE ID_SERVICO = $1`, values);

    return result.rows;
}

export const findServiceCategories = async (filter: ServiceCategoriesSearch): Promise<ServiceCategoriesModel[]> =>{
    let result

    const client = await poolPromise 

    let {id_servico} = filter

    const values = [id_servico];

    result = await client.query(`SELECT * FROM VW_SERVICO_CATEGORIA  
                                WHERE ID_SERVICO = $1`, values);

    return result.rows;
}

export const findServiceProviderUsers = async (filter: ServiceProviderUsersSearch): Promise<ServiceProviderUsersModel[]> =>{
    let result

    const client = await poolPromise 

    let {id_servico} = filter

    const values = [id_servico];

    result = await client.query(`SELECT * FROM VW_SERVICO_PRESTADOR  
                                WHERE ID_SERVICO = $1`, values);

    return result.rows;
}

export const insertService = async(service: ServiceInput): Promise<TransactionResult> =>{
    const client = await poolPromise 

    try {
        await client.query('BEGIN')

        const {nom_servico, desc_servico, id_usuario_solicitante, id_projeto_pai, dth_servico, dth_fim_servico, num_tempo_estimado, num_novo_saldo, num_qtd_prestadores, id_habilidade_lista, id_categoria_lista} = service
        
        const insertQuery = `
            INSERT INTO TB_SERVICO (nom_servico, desc_servico, id_usuario_solicitante, id_projeto_pai, dth_servico, dth_fim_servico, num_tempo_estimado, num_qtd_prestadores, id_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ${StatusEnum.PENDING})
            RETURNING id_servico;
        `;

        const values = [nom_servico, desc_servico, id_usuario_solicitante, id_projeto_pai, dth_servico, dth_fim_servico, num_tempo_estimado, num_qtd_prestadores]

        const result = await client.query(insertQuery, values)

        const id = result.rows[0]?.id_servico

        for(const id_habilidade of id_habilidade_lista){
            await client.query(`INSERT INTO TB_SERVICO_HABILIDADE(id_servico, id_habilidade) VALUES($1, $2)`, [id, id_habilidade])
        }

        for(const id_categoria of id_categoria_lista){
            await client.query(`INSERT INTO TB_SERVICO_CATEGORIA(id_servico, id_categoria) VALUES($1, $2)`, [id, id_categoria])
        }

        await client.query(`UPDATE TB_USUARIO SET NUM_SALDO_HORAS = $1 WHERE ID_USUARIO = $2`, [num_novo_saldo, id_usuario_solicitante])
    
        await client.query('COMMIT')
    
        return {
          success: true,
          message: 'Serviço inserido com sucesso',
          id
        }

      } catch (err: any) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Erro ao criar serviço',
          error: err.message,
        }
      }
}

export const updateServiceProviders = async(serviceProvider: ServiceProviderUpdate): Promise<TransactionResult> =>{
    const client = await poolPromise 

    try {
        await client.query('BEGIN')

        const {id_servico, id_usuario_prestador, id_novo_status} = serviceProvider
        
        const updateQuery = `
            UPDATE TB_SERVICO SET ID_STATUS = $1 
            WHERE ID_SERVICO = $2;
        `;

        const valuesUpdate = [id_novo_status, id_servico]

        await client.query(updateQuery, valuesUpdate)

        const insertQuery = `
            INSERT INTO TB_SERVICO_PRESTADOR (ID_SERVICO, ID_USUARIO_PRESTADOR)
            VALUES ($1, $2);
        `;

        const valuesInsert = [id_servico, id_usuario_prestador]

        await client.query(insertQuery, valuesInsert)

        const id = id_servico
       
        await client.query('COMMIT')
    
        return {
          success: true,
          message: 'Prestador de Serviço vinculado com sucesso!',
          id
        }

      } catch (err: any) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Erro ao atualizar prestadores do serviço',
          error: err.message,
        }
      }
}

export const updateServiceFinalization = async(serviceFinalization: ServiceFinalizationUpdate): Promise<TransactionResult> =>{
    const client = await poolPromise 

    try {
        await client.query('BEGIN')

        const {id_servico, id_usuario_solicitante, num_saldo_horas_reajuste, id_usuario_prestador_list, num_tempo_estimado} = serviceFinalization
        
        const id_novo_status = StatusEnum.DONE

        const updateServiceQuery = `
            UPDATE TB_SERVICO SET ID_STATUS = $1 
            WHERE ID_SERVICO = $2;
        `;

        const valuesUpdateService = [id_novo_status, id_servico]

        await client.query(updateServiceQuery, valuesUpdateService)

        if(num_saldo_horas_reajuste && num_saldo_horas_reajuste>0){
            const updateUserQuery = `
                    UPDATE TB_USUARIO SET NUM_SALDO_HORAS = $1 
                    WHERE ID_USUARIO = $2;
                `;
    
            const valuesUpdateUser = [num_saldo_horas_reajuste, id_usuario_solicitante]
    
            await client.query(updateUserQuery, valuesUpdateUser)
        }

        if (id_usuario_prestador_list)
            for (const id_usuario_prestador of id_usuario_prestador_list) {
                const updateUserQuery = `
                    UPDATE TB_USUARIO SET NUM_SALDO_HORAS = NUM_SALDO_HORAS + $1 
                    WHERE ID_USUARIO = $2;
                `;

                const valuesUpdateUser = [num_tempo_estimado, id_usuario_prestador]

                await client.query(updateUserQuery, valuesUpdateUser)
            }

        const id = id_servico
       
        await client.query('COMMIT')
    
        return {
          success: true,
          message: 'Serviço finalizado com sucesso!',
          id
        }

      } catch (err: any) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Erro ao finalizar serviço',
          error: err.message,
        }
      }
}

export const updateServiceRate = async(serviceRate: ServiceRateUpdate): Promise<TransactionResult> =>{
    const client = await poolPromise 

    try {
        await client.query('BEGIN')

        const {id_servico, avaliacao_usuario_list} = serviceRate
        
        for(const avaliacao_usuario of avaliacao_usuario_list) {

            const {id_usuario, num_nota_avaliacao, desc_comentario_avaliacao} = avaliacao_usuario

            const updateRateQuery = `
                    UPDATE TB_SERVICO_PRESTADOR SET NUM_NOTA_AVALIACAO = $1,
                                                    DESC_COMENTARIO_AVALIACAO = $2 
                    WHERE ID_SERVICO = $3
                    AND ID_USUARIO_PRESTADOR = $4;
                `;
    
            const valuesUpdateUser = [num_nota_avaliacao, desc_comentario_avaliacao, id_servico, id_usuario]
    
            await client.query(updateRateQuery, valuesUpdateUser)
        }

        const id = id_servico
       
        await client.query('COMMIT')
    
        return {
          success: true,
          message: 'Serviço avaliado com sucesso!',
          id
        }

      } catch (err: any) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Erro ao avaliar serviço',
          error: err.message,
        }
      }
}
