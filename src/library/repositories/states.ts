import poolPromise from "../database/postgressql"
import StateModel from "../models/states"
import { StateSearch } from "../schemas/states"
import { buildWhereClause } from "../utils/queryBuilder"

export const findAllStates = async (filter: StateSearch = {}): Promise<StateModel[]> => {
    let result

    const client = await poolPromise 

    const { clause, values } = buildWhereClause(filter);
    
    const query = `SELECT * FROM TB_ESTADO ${clause} ORDER BY NOM_ESTADO`;
    
    result = await client.query(query, values);

    return result.rows;
}
