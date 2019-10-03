import { getColumnsStorage } from "../storages/GlobalStorage";
import { ColumnInfo, ColumnsType } from "../entities/ColumnInfo";


export function Column(columnDefinition: ColumnInfo) {
    if (!columnDefinition.type) {
        columnDefinition.type = ColumnsType.Data;
    }
    
    function decorator(target: Object, property: string | symbol): void {       
        getColumnsStorage().push({taget: target.constructor, 
                                property: property, 
                                columnDefinition: columnDefinition});
    }

    return decorator;
}