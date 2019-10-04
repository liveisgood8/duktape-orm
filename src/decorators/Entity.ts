import { getEntityStorage } from "../storages/GlobalStorage";


export function Entity(table: string) {
    function decorator(constructorFunction: Function): void {
        getEntityStorage().push({target: constructorFunction, 
            table: table
        });
    }

    return decorator;
}