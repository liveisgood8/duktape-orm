export enum ColumnsType {
    PrimaryKey,
    PrimaryAutoIncrement,
    ManualIncrement,
    Data,
    Relation
}

export enum Flags {
    ForceUpdate = 1
}

export interface ColumnInfo {
    name: string,
    type?: ColumnsType,
    length?: number,
    flags?: number
}

export function checkFlag(flag: Flags, object: ColumnInfo) {
    return (object.flags & flag) === flag; 
}