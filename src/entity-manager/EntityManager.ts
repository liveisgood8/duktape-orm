/// <reference path="../dukmodules.d.ts"/>
import * as GlobalStorage from "../storages/GlobalStorage";
import * as SqlGenerator from "../query-builder/SqlBuilder";
import { EntityInfo, EntityColumnsInfo } from "../entities/EntityInfo";
import { DukConnection } from "../native-database/DukConnection";


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
            throw new Error(`Не заданы сведения о модели ${entityConstructor}`);
        }  
    
        this.entityColumns = GlobalStorage.getColumnsStorage().filter(e => e.taget === entityConstructor);
        if (!this.entityColumns) {
            throw new Error(`Не заданы сведения о маппинге атрибутов для модели ${entityConstructor}`);
        }
        return this;
    }

    select(whereCallback?: (obj: T) => void): T[] | null {
        return this.selectPrivate(this.entityColumns, whereCallback);
    }

    selectSome(objectKeys: string[], whereCallback?: (obj: T) => void): T[] | null {
        return this.selectPrivate(this.entityColumns.filter(e => objectKeys.indexOf(e.property) !== -1), whereCallback);
    }

    private selectPrivate(eColumns: EntityColumnsInfo[], whereCallback?: (obj: T) => void): T[] | null {
        let whereLimitation = "";
        let args = new Array<any>();
        if (whereCallback) {
            let obj = Object.create(this.entityCtor.prototype);
            whereCallback(obj);

            for (var prop in obj) {
                let dbColumn = eColumns.filter(e => e.property === prop)[0]; 
                whereLimitation += `${dbColumn.columnDefinition.name}=?`;
                args.push(obj[prop]);
            }
        }
        
        let selectingColumns = eColumns.map(e => e.columnDefinition.name);
        let sql = SqlGenerator.generateSelect(selectingColumns, 
                                            this.entityInfo.table, 
                                            whereLimitation);

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
                    obj[this.entityColumns[j].property] = result[i][j];
                }

                objects.push(obj);
            }

            return objects;
        }
    }

    insert(obj: T): boolean {
        let fields = new Array<string>();
        let args = new Array<any>();
        for (var prop in obj) {
            let dbColumn = this.entityColumns.filter(e => e.property === prop)[0];
            fields.push(dbColumn.columnDefinition.name);
            args.push(obj[prop]);
        }

        let sql = SqlGenerator.generateInsert(fields, this.entityInfo.table);

        const db = new DukConnection();
        return db.execute(sql, args);
    }
}