import { ColumnInfo } from "../entities/ColumnInfo";


export interface IExecutor {
    execute: (statement: string, args: any[]) => boolean;
    select: (statement: string, args: any[]) => Array<Array<any>>;
}