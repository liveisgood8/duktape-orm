import { getColumnsStorage } from "../storages/GlobalStorage";
import { ColumnInfo, ColumnsType } from "../entities/ColumnInfo";


export function PrimaryAutoGeneratedKey(columnDefinition: ColumnInfo) {
    columnDefinition.type = ColumnsType.PrimaryAutoGeneratedKey;

    function decorator(target: Object, property: string | symbol): void {       
        getColumnsStorage().push({taget: target.constructor, 
                                property: property, 
                                columnDefinition: columnDefinition});
    }

    return decorator;
}