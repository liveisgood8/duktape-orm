export function generateSelect(fields: string[], table: string, whereLimitation?: string): string {
    let sql = `select ${fields.join(',')} from ${table}`;
    if (whereLimitation) {
        sql += ` where ${whereLimitation}`;
    }

    return sql;
}

export function generateInsert(fields: string[], table: string): string {
    return `insert into ${table} (${fields.join(',')}) values (${createPlaceholders(fields.length)})`;
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