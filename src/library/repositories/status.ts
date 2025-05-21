import poolPromise from "../database/postgressql"
import StatusModel from "../models/status"
import { StatusSearch } from "../schemas/status"
import { buildWhereClause } from "../utils/queryBuilder"

export const findAllStatus = async (filter: StatusSearch = {}): Promise<StatusModel[]> => {
    let result

    const client = await poolPromise 

    const { clause, values } = buildWhereClause(filter);
    
    const query = `SELECT * FROM TB_STATUS ${clause} ORDER BY ID_STATUS`;
    
    result = await client.query(query, values);

    return result.rows;
}
