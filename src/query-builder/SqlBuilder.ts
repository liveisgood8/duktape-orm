export function generateSelect(fields: string[], table: string, whereLimitation?: string): string {
    fields = shieldFields(fields);

    let sql = `select ${fields.join(',')} from [${table}]`;
    if (whereLimitation) {
        sql += ` where ${whereLimitation}`;
    }

    return sql;
}

export function generateInsert(fields: string[], table: string): string {
    fields = shieldFields(fields);
    return `insert into [${table}] (${fields.join(',')}) values (${createPlaceholders(fields.length)})`;
}

export function generateCheckExist(table: string, whereLimitation: string) {
    return `select count(*) from [${table}] where ${whereLimitation}`;
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