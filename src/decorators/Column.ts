import { getColumnsStorage } from "../storages/GlobalStorage";
import { ColumnInfo, ColumnsType } from "../entities/ColumnInfo";


export function Column(columnDefinition?: ColumnInfo) {
    if (columnDefinition && !columnDefinition.type) {
        columnDefinition.type = ColumnsType.Data;
    }
    
    function decorator(target: Object, property: string): void {
        if (!columnDefinition || (columnDefinition && !columnDefinition.name)) {
            columnDefinition = {} as ColumnInfo;
            columnDefinition.name = property;
        }
        
        getColumnsStorage().push({taget: target.constructor, 
                                property: property, 
                                columnDefinition: columnDefinition});
    }

    return decorator;
}