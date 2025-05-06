import poolPromise from "../database/postgressql"
import SkillModel from "../models/skills"
import { TransactionResult } from "../models/transaction-response"
import { SkillInput, SkillSearch, SkillUpdate } from "../schemas/skills"
import { buildWhereClause } from "../utils/queryBuilder"

export const findAllSkills = async (filter: SkillSearch = {}): Promise<SkillModel[]> => {
    let result

    const client = await poolPromise 

    const { clause, values } = buildWhereClause(filter);
    
    const query = `SELECT * FROM TB_HABILIDADE ${clause} ORDER BY ID_HABILIDADE DESC`;
    
    result = await client.query(query, values);

    return result.rows;
}

export const insertSkill = async(skill: SkillInput): Promise<TransactionResult> =>{
    const client = await poolPromise 

    try {
        await client.query('BEGIN')
        
        const {nom_habilidade} = skill

        const insertQuery = `
            INSERT INTO TB_HABILIDADE (nom_habilidade)
            VALUES ($1)
            RETURNING id_habilidade;
        `;

        const values = [nom_habilidade]

        const result = await client.query(insertQuery, values)

        const id = result.rows[0]?.id_habilidade
    
        await client.query('COMMIT')
    
        return {
          success: true,
          message: 'Habilidade inserida com sucesso',
          id
        }

      } catch (err: any) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Erro ao inserir habilidade',
          error: err.message,
        }
      }
}

export const updateSkill = async(skill: SkillUpdate): Promise<TransactionResult> =>{
    const client = await poolPromise 

    try {
        await client.query('BEGIN')
        
        const {nom_habilidade, id_habilidade} = skill

        const updateQuery = `
            UPDATE TB_HABILIDADE SET NOM_HABILIDADE = $1
                WHERE ID_HABILIDADE = $2
        `;

        const values = [nom_habilidade, id_habilidade]

        await client.query(updateQuery, values)
    
        await client.query('COMMIT')
    
        return {
          success: true,
          message: 'Habilidade atualizada com sucesso',
          id: id_habilidade
        }

      } catch (err: any) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Erro ao atualizar habilidade',
          error: err.message,
        }
      }
}

