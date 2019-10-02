import * as global from "../storages/GlobalStorage"


export function selectAll(objectCtor: Function, whereCallback: Function) {
    let entity = global.getEntityStorage().filter(e => e.target === objectCtor)[0];
    if (!entity) {
        throw new Error(`Не заданы сведения о модели ${objectCtor}`);
    }  

    let columns = global.getColumnsStorage().filter(e => e.taget === objectCtor);
    if (!columns) {
        throw new Error(`Не заданы сведения о маппинге атрибутов для модели ${objectCtor}`);
    }

    let obj = Object.create(objectCtor.prototype);
    whereCallback(obj);

    let sql = "select ";
    sql += columns.map((e) => e.columnDefinition.name).join(',');
    sql += ` from ${entity.table}`;

    let where = "";
    for (var prop in obj) {
        let column = columns.filter(e => e.property = prop)[0]; 
        where += `${column.columnDefinition.name}=?`;
    }

    if (where) {
        sql += ` where ${where}`;
    }

    print(sql);
}