type WhereClause = {
    clause: string;
    values: any[];
};

export const buildWhereClause = (filters: Record<string, any>): WhereClause => {
    const conditions: string[] = [];
    const values: any[] = [];

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            values.push(value);
            conditions.push(`${key} = $${values.length}`);
        }
    });

    const clause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    return { clause, values };
};
