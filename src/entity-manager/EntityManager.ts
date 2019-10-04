/// <reference path="../dukmodules.d.ts"/>
import * as GlobalStorage from "../storages/GlobalStorage";
import * as SqlGenerator from "../query-builder/SqlBuilder";
import { EntityInfo, EntityColumnsInfo } from "../entities/EntityInfo";
import { DukConnection } from "../native-database/DukConnection";
import { ColumnsType } from "../entities/ColumnInfo";


export class EntityManager<T> {
    private entityCtor: Function;
    private entityInfo: EntityInfo;
    private entityColumns: EntityColumnsInfo[];

    constructor(entityConstructor: new () => T) {
        this.setEntity(entityConstructor);
    }

    private setEntity(entityConstructor: Function): EntityManager<T> {
        this.entityCtor = entityConstructor;

        this.entityInfo = GlobalStorage.getEntityStorage().filter(e => e.target === entityConstructor)[0];
        if (!this.entityInfo) {
            throw new Error(`Cannot extract information about model: ${entityConstructor}`);
        }

        this.entityColumns = GlobalStorage.getColumnsStorage().filter(e => e.taget === entityConstructor);
        if (!this.entityColumns) {
            throw new Error(`Cannot extract information for mapping model: ${entityConstructor}`);
        }
        return this;
    }

    select(whereCallback?: (obj: T) => void): T[] | null {
        return this.selectPrivate(this.entityColumns, whereCallback);
    }

    selectSome(objectKeys: string[], whereCallback?: (obj: T) => void): T[] | null {
        return this.selectPrivate(this.entityColumns.filter(e => objectKeys.indexOf(e.property) !== -1), whereCallback);
    }

    selectSomeFirst(objectKeys: string[], whereCallback?: (obj: T) => void): T | null {
        let result = this.selectPrivate(this.entityColumns.filter(e => objectKeys.indexOf(e.property) !== -1), whereCallback);
        if (result && result.length) {
            return result[0];
        }

        return null;
    }

    // selectIdFirst(whereCallback?: (obj: T) => void): number | null {
    //     let idColumn = this.entityColumns.filter(e => 
    //         e.columnDefinition.type == ColumnsType.PrimaryKey || e.columnDefinition.type == ColumnsType.PrimaryAutoGeneratedKey);

    //     if (!idColumn || !idColumn.length) {
    //         throw new Error("Cannot select id, there is no PK in model");
    //     }

    //     let idRow = this.selectSomeFirst([idColumn[0].property], whereCallback);
    //     if (idRow) {
    //         return (idRow as any)[idColumn[0].property];
    //     }

    //     return null;
    // }

    private selectPrivate(eColumns: EntityColumnsInfo[], whereCallback?: (obj: T) => void): T[] | null {
        if (!eColumns.length) {
            throw new Error(`No columns for select on model ${this.entityCtor}`);
        }

        let whereStatements: string[] = [];
        let args: any[] = [];
        if (whereCallback) {
            let obj = Object.create(this.entityCtor.prototype);
            whereCallback(obj);

            for (var prop in obj) {
                let dbColumn = this.entityColumns.filter(e => e.property === prop)[0];
                if (!dbColumn) {
                    throw new Error(`Property '${prop}' not founded in model: ${this.entityCtor}`)
                }
                whereStatements.push(`[${dbColumn.columnDefinition.name}]=?`);
                args.push(obj[prop]);
            }
        }

        let selectingColumns = eColumns.map(e => e.columnDefinition.name);
        let sql = SqlGenerator.generateSelect(selectingColumns,
            this.entityInfo.table,
            whereStatements);

        const db = new DukConnection();
        let result = db.select(sql, args);

        if (result.length === 0) {
            return null;
        }
        else {
            let objects = new Array<T>();
            for (let i = 0; i < result.length; i++) {
                let obj = Object.create(this.entityCtor.prototype);

                if (selectingColumns.length !== result[i].length) {
                    throw new Error(`Error trying to match query results for: ${sql}`);
                }

                for (let j = 0; j < result[i].length; j++) {
                    obj[eColumns[j].property] = result[i][j];
                }

                objects.push(obj);
            }

            return objects;
        }
    }

    insert(obj: T): boolean {
        const db = new DukConnection();

        let fields: string[] = [];
        let args: any[] = [];
        for (var prop in obj) {
            let dbColumn = this.entityColumns.filter(e => e.property === prop)[0];
            if (!dbColumn) {
                throw new Error(`Property '${prop}' not founded in model: ${this.entityCtor}`)
            }

            if (dbColumn.columnDefinition.type === ColumnsType.ManualIncrement) {
                // Object helper for existance check
                let indexObj = {} as any;
                indexObj[prop] = obj[prop];

                if ((obj[prop] && this.isExist(indexObj)) || !obj[prop]) {
                     // Set max number
                    let result = db.select(SqlGenerator.generateMax(dbColumn.columnDefinition.name,
                        this.entityInfo.table));
                    if (result && result.length && result[0].length) {
                        obj[prop] = result[0][0] + 1;
                    }
                    else {
                        throw new Error(`Manual increment calculation error for field: ${dbColumn.columnDefinition.name}`)
                    }
                }
            }
            if (dbColumn.columnDefinition.type === ColumnsType.Data
                || dbColumn.columnDefinition.type === ColumnsType.ManualIncrement) {
                fields.push(dbColumn.columnDefinition.name);
                args.push(obj[prop]);
            }
        }

        let sql = SqlGenerator.generateInsert(fields, this.entityInfo.table);
        return db.execute(sql, args);
    }

    /**
     * Update some row in database using data of obj (skip pk values and other system props)
     * @param obj Object which store updating data
     * @param whereCallback Callback for setup limitations
     */
    update(obj: any, whereCallback?: (obj: T) => void): boolean {
        let fields: string[] = [];
        let args: any[] = [];

        for (var prop in obj) {
            let dbColumn = this.entityColumns.filter(e => e.property === prop)[0];
            if (!dbColumn) {
                throw new Error(`Property '${prop}' not founded in model: ${this.entityCtor}`)
            }

            if (dbColumn.columnDefinition.type === ColumnsType.Data
                || dbColumn.columnDefinition.type === ColumnsType.ManualIncrement) {
                fields.push(dbColumn.columnDefinition.name);
                args.push(obj[prop]);
            }
        }

        let whereStatements: string[] = [];
        if (whereCallback) {
            let obj = Object.create(this.entityCtor.prototype);
            whereCallback(obj);

            for (var prop in obj) {
                let dbColumn = this.entityColumns.filter(e => e.property === prop)[0];
                if (!dbColumn) {
                    throw new Error(`Property '${prop}' not founded in model: ${this.entityCtor}`)
                }
                whereStatements.push(`[${dbColumn.columnDefinition.name}]=?`);
                args.push(obj[prop]);
            }
        }

        let sql = SqlGenerator.generateUpdate(fields, this.entityInfo.table, whereStatements);
        return new DukConnection().execute(sql, args);
    }

    isExist(obj: any): boolean {
        let fields: string[] = [];
        let args: any[] = [];
        let whereStatements: string[] = [];
        for (var prop in obj) {
            let dbColumn = this.entityColumns.filter(e => e.property === prop)[0];
            if (!dbColumn) {
                throw new Error(`Property '${prop}' not founded in model: ${this.entityCtor}`)
            }

            whereStatements.push(`[${dbColumn.columnDefinition.name}=?]`);
            fields.push(dbColumn.columnDefinition.name);
            args.push(obj[prop]);
        }

        let sql = SqlGenerator.generateCheckExist(this.entityInfo.table, whereStatements);

        const db = new DukConnection();
        let result = db.select(sql, args);
        return result[0][0] !== 0;
    }
}