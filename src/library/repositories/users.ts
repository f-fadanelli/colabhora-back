import poolPromise from "../database/postgressql"
import { TransactionResult } from "../models/transaction-response";
import { UserModel, UserSkillsModel } from "../models/users"
import { UserInput, UserSearch, UserSkillsSearch, UserUpdate } from "../schemas/users";
import { buildWhereClause } from "../utils/queryBuilder";

export const findAllUsers = async (filter: UserSearch = {}): Promise<UserModel[]> =>{
    let result

    const client = await poolPromise 

    let {id_habilidade, ...newFilter} = filter

    let { clause, values } = buildWhereClause(newFilter);

    if(id_habilidade){
        clause+=` ${values.length===0? 'WHERE' : 'AND'} ID_USUARIO IN (SELECT DISTINCT(ID_USUARIO) FROM TB_USUARIO_HABILIDADE WHERE ID_HABILIDADE = $${values.length + 1} ) `
        values.push(id_habilidade)
    }
    
    const query = `SELECT * FROM VW_USUARIO ${clause} ORDER BY ID_USUARIO DESC`;
    
    result = await client.query(query, values);

    return result.rows;
}

export const findUserSkills = async (filter: UserSkillsSearch): Promise<UserSkillsModel[]> =>{
    let result

    const client = await poolPromise 

    let {id_usuario} = filter

    const values = [id_usuario];

    result = await client.query(`SELECT * FROM VW_USUARIO_HABILIDADE  
                                WHERE ID_USUARIO = $1`, values);

    return result.rows;
}

export const insertUser = async(user: UserInput): Promise<TransactionResult> =>{
    const client = await poolPromise 

    try {
        await client.query('BEGIN')

        const {nom_usuario, cod_cadastro, cod_email_usuario, cod_senha_usuario, id_cidade, desc_endereco, flg_tipo_usuario, desc_area_atuacao, id_habilidade_lista} = user
        
        const insertQuery = `
            INSERT INTO TB_USUARIO (nom_usuario, cod_cadastro, cod_email_usuario, cod_senha_usuario, num_saldo_horas, id_cidade, desc_endereco, flg_tipo_usuario, desc_area_atuacao)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id_usuario;
        `;

        const initialBalance = 10

        const values = [nom_usuario, cod_cadastro, cod_email_usuario, cod_senha_usuario, initialBalance, id_cidade, desc_endereco, flg_tipo_usuario, desc_area_atuacao]

        const result = await client.query(insertQuery, values)

        const id = result.rows[0]?.id_usuario

        for(const id_habilidade of id_habilidade_lista){
            await client.query(`INSERT INTO TB_USUARIO_HABILIDADE(id_usuario, id_habilidade) VALUES($1, $2)`, [id, id_habilidade])
        }
    
        await client.query('COMMIT')
    
        return {
          success: true,
          message: 'Usuário inserido com sucesso',
          id
        }

      } catch (err: any) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Erro ao inserir usuário',
          error: err.message,
        }
      }
}

export const updateUser = async(user: UserUpdate): Promise<TransactionResult> =>{
    const client = await poolPromise 

    try {

        await client.query('BEGIN')
  
        const {id_usuario, nom_usuario, cod_cadastro, cod_email_usuario, id_cidade, desc_endereco, desc_area_atuacao, id_habilidade_lista} = user

        const skills = await findUserSkills({id_usuario: id_usuario})
        
        let current_skills_list = []

        for(const skill of skills){
            current_skills_list.push(skill['id_habilidade'])
        }

        let new_skills = id_habilidade_lista.filter(skl => !current_skills_list.includes(skl))
        let deleted_skills = current_skills_list.filter(skl => !id_habilidade_lista.includes(skl))

        for(const id_habilidade of new_skills){
            await client.query(`INSERT INTO TB_USUARIO_HABILIDADE(id_usuario, id_habilidade) VALUES($1, $2)`, [id_usuario, id_habilidade])
        }

        for(const id_habilidade of deleted_skills){
            await client.query(`DELETE FROM TB_USUARIO_HABILIDADE WHERE id_usuario = $1 AND id_habilidade = $2`, [id_usuario, id_habilidade])
        }

        const updateQuery = `
            UPDATE TB_USUARIO SET NOM_USUARIO = $1,
                                COD_CADASTRO = $2,
                                COD_EMAIL_USUARIO = $3,
                                ID_CIDADE = $4,
                                DESC_ENDERECO = $5,
                                DESC_AREA_ATUACAO = $6
                WHERE ID_USUARIO = $7
        `;

        const values = [nom_usuario, cod_cadastro, cod_email_usuario, id_cidade, desc_endereco, desc_area_atuacao, id_usuario]

        await client.query(updateQuery, values)
    
        await client.query('COMMIT')
    
        return {
          success: true,
          message: 'Usuário atualizado com sucesso',
          id: id_usuario
        }

      } catch (err: any) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Erro ao atualizar usuário',
          error: err.message,
        }
      }
}