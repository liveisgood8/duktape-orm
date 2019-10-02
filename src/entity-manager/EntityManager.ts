import * as GlobalStorage from "../storages/GlobalStorage";
import * as SqlGenerator from "../query-builder/SqlBuilder";
import { EntityInfo, EntityColumnsInfo } from "../entities/EntityInfo";


export class EntityManager<T> {
    private entityCtor: Function;
    private entityInfo: EntityInfo;
    private entityColumns: Array<EntityColumnsInfo>;

    constructor(entityConstructor: new () => T) {
        this.setEntity(entityConstructor);
    }

    setEntity(entityConstructor: Function): EntityManager<T> {
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

    select(whereCallback?: Function): void {
        let whereLimitation = "";
        if (whereCallback) {
            let obj = Object.create(this.entityCtor.prototype);
            whereCallback(obj);

            for (var prop in obj) {
                let dbColumn = this.entityColumns.filter(e => e.property === prop)[0]; 
                whereLimitation += `${dbColumn.columnDefinition.name}=?`;
            }
        }
        
        let sql = SqlGenerator.generateSelect(this.entityColumns.map(e => e.columnDefinition.name), 
                                                this.entityInfo.table, 
                                                whereLimitation);
        print(sql);
    }

    insert(obj: T): EntityManager<T> {
        print("insert");
        let fields = new Array<string>();
        for (var prop in obj) {
            print(prop);
            let dbColumn = this.entityColumns.filter(e => e.property === prop)[0];
            fields.push(dbColumn.columnDefinition.name);
        }

        let sql = SqlGenerator.generateInsert(fields, this.entityInfo.table);
        print(sql);

        return this;
    }
}