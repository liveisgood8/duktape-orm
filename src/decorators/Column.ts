import { getColumnsStorage } from "../storages/GlobalStorage";
import { ColumnInfo } from "../entities/ColumnInfo";


export function Column(columnDefinition: ColumnInfo) {
    function decorator(target: Object, property: string | symbol): void {       
        getColumnsStorage().push({taget: target.constructor, 
                                property: property, 
                                columnDefinition: columnDefinition});
    }

    return decorator;
}