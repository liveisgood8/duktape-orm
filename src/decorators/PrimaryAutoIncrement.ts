import { getColumnsStorage } from "../storages/GlobalStorage";
import { ColumnInfo, ColumnsType } from "../entities/ColumnInfo";


export function PrimaryAutoIncrement(columnDefinition?: ColumnInfo) {
    if (columnDefinition) {
        columnDefinition.type = ColumnsType.PrimaryAutoIncrement;
    }

    function decorator(target: Object, property: string): void {  
        if (!columnDefinition || (columnDefinition && !columnDefinition.name)) {
            columnDefinition = {} as ColumnInfo;
            columnDefinition.name = property;
            columnDefinition.type = ColumnsType.Data;
        }

        getColumnsStorage().push({taget: target.constructor, 
            property: property, 
            columnDefinition: columnDefinition
        });
    }

    return decorator;
}