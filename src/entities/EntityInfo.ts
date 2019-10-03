import {ColumnInfo} from "./ColumnInfo";


export interface EntityColumnsInfo {
    taget: Function,
    property: string,
    columnDefinition: ColumnInfo,
}

export interface EntityInfo {
    target: Function,
    table: string;
}
