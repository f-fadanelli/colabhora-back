
import poolPromise from "../database/postgressql"
import UserModel from "../models/users"

export const findAllUsers = async (): Promise<UserModel[]> =>{
    let result
    const client = await poolPromise 
    result = await client.query(`SELECT * FROM TB_USUARIO`);

    return result.rows;
}
