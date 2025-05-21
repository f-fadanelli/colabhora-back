import poolPromise from "../database/postgressql"
import CityModel from "../models/cities"
import { CitySearch } from "../schemas/cities"
import { buildWhereClause } from "../utils/queryBuilder"

export const findAllCities = async (filter: CitySearch = {}): Promise<CityModel[]> => {
    let result

    const client = await poolPromise 

    const { clause, values } = buildWhereClause(filter);
    
    const query = `SELECT * FROM TB_CIDADE ${clause} ORDER BY NOM_CIDADE`;
    
    result = await client.query(query, values);

    return result.rows;
}
