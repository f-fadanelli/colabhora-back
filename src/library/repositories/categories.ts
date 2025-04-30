import poolPromise from "../database/postgressql"
import CategoryModel from "../models/categories"

export const findAllCategories = async (): Promise<CategoryModel[]> => {
    let result
    const client = await poolPromise 
    result = await client.query(`SELECT * FROM TB_CATEGORIA`);

    return result.rows;
}