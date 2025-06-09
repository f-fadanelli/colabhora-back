import poolPromise from "../database/postgressql"
import StatusEnum from "../enums/status";
import ProjectModel from "../models/projects";
import { TransactionResult } from "../models/transaction-response";
import { ProjectInput, ProjectSearch } from "../schemas/projects";
import { buildWhereClause } from "../utils/queryBuilder";

export const findAllProjects = async (filter: ProjectSearch = {}): Promise<ProjectModel[]> =>{
    let result

    const client = await poolPromise 

    let {dth_inicio_low, dth_inicio_high, dth_fim_low, dth_fim_high,  ...newFilter} = filter

    let { clause, values } = buildWhereClause(newFilter);

    if (dth_inicio_low || dth_inicio_high) {
        const lowDate = dth_inicio_low ? dth_inicio_low : dth_inicio_high ? dth_inicio_high: new Date().toISOString()
        const highDate = dth_inicio_high ? dth_inicio_high : dth_inicio_low ? dth_inicio_low : new Date().toISOString()

        clause += ` ${values.length === 0 ? 'WHERE' : 'AND'} DTH_INICIO BETWEEN $${values.length + 1} AND $${values.length + 2} `

        values.push(lowDate)
        values.push(highDate)
    }

    if (dth_fim_low || dth_fim_high) {
        const lowDate = dth_fim_low ? dth_fim_low : dth_fim_high ? dth_fim_high: new Date().toISOString()
        const highDate = dth_fim_high ? dth_fim_high : dth_fim_low ? dth_fim_low : new Date().toISOString()

        clause += ` ${values.length === 0 ? 'WHERE' : 'AND'} DTH_FIM BETWEEN $${values.length + 1} AND $${values.length + 2} `

        values.push(lowDate)
        values.push(highDate)
    }

    const query = `SELECT * FROM VW_PROJETO ${clause} ORDER BY ID_PROJETO DESC`;
    
    result = await client.query(query, values);

    return result.rows;
}

export const insertProject = async(project: ProjectInput): Promise<TransactionResult> =>{
    const client = await poolPromise 

    try {
        await client.query('BEGIN')

        const {nom_projeto, desc_projeto, id_usuario_responsavel, dth_inicio, dth_fim} = project
        
        const insertQuery = `
            INSERT INTO TB_PROJETO (nom_projeto, desc_projeto, id_usuario_responsavel, dth_inicio, dth_fim)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_projeto;
        `;

        const values = [nom_projeto, desc_projeto, id_usuario_responsavel, dth_inicio, dth_fim]

        const result = await client.query(insertQuery, values)

        const id = result.rows[0]?.id_projeto
    
        await client.query('COMMIT')
    
        return {
          success: true,
          message: 'Projeto inserido com sucesso',
          id
        }

      } catch (err: any) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Erro ao criar projeto',
          error: err.message,
        }
      }
}
