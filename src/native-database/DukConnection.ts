/// <reference path="../dukmodules.d.ts"/>
import { IExecutor } from "./IExecutor"


export class DukConnection implements IExecutor {
    execute(statement: string, args?: any[]): boolean {
        let query = new Query(statement);
        if (args && args.length !== 0) {
            this.setArguments(query, args);
        }

        return query.exec();
    }

    select(statement: string, args?: any[]): Array<Array<any>> {
        let query = new Query(statement);
        if (args && args.length !== 0) {
            this.setArguments(query, args);
        }

        let rows = new Array<Array<any>>();
        if (query.exec()) {
            var fldsCount = query.fldsCount;
            while (!query.eof) {
                let row = new Array<any>();
                for (var i = 0; i < fldsCount; i++) {
                    row.push(query.get(i));
                }
                rows.push(row);
                query.next();
            }
        }

        return rows;
    }

    private setArguments(query: Query, args: any[]): void {
        const argsLen = args.length;
        for (var i = 0; i < argsLen; i++) {
            query.setParam(i, args[i]);
        }
    }
}