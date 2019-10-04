export function generateSelect(fields: string[], table: string, whereStatements?: string[]): string {
    fields = shieldFields(fields);

    let sql = `select ${fields.join(',')} from [${table}]`;
    if (whereStatements && whereStatements.length) {
        sql += ` where ${whereStatements.join(" AND ")}`;
    }

    return sql;
}

export function generateInsert(fields: string[], table: string): string {
    fields = shieldFields(fields);
    return `insert into [${table}] (${fields.join(',')}) values (${createPlaceholders(fields.length)})`;
}

export function generateCheckExist(table: string, whereStatements: string[]) {
    return `select count(*) from [${table}] where ${whereStatements.join(" AND ")}`;
}

export function generateMax(column: string, table:string, whereStatements?: string[]) {
    let sql = `select max(${column}) from [${table}]`;
    if (whereStatements && whereStatements.length) {
        sql += ` where ${whereStatements.join(" AND ")}`;
    }

    return sql;
}

function shieldFields(fields: string[]): string[] {
    return fields.map(e => `[${e}]`);
}

/**
 * Create placeholders list for native query, look like ?, ?, ?, ...(length)
 * @param length Length of placeholders list
 */
function createPlaceholders(length: number): string {
    let placeholdersList = "";
    for (var i = 0; i < length; i++) {
        if (i !== 0) {
            placeholdersList += ',';
        }
        placeholdersList += '?'
    }

    return placeholdersList;
}