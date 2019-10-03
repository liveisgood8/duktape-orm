import {ColumnInfo} from "./ColumnInfo";


export interface EntityColumnsInfo {
    taget: Function,
    property: string | symbol,
    columnDefinition: ColumnInfo,
}

export interface EntityInfo {
    target: Function,
    table: string;
}
