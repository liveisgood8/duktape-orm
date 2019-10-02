import {EntityColumnsInfo, EntityTableInfo} from "../entities/EntityInfo"

// For duktape
if (typeof globalThis === 'undefined') {
    (function () {
        var global = new Function('return this;')();
        Object.defineProperty(global, 'globalThis', {
            value: global,
            writable: true,
            enumerable: false,
            configurable: true
        });
    })();
}

(globalThis as any).columnsStorage = new Array<EntityColumnsInfo>();
(globalThis as any).entityStorage = new Array<EntityTableInfo>();

export function getColumnsStorage(): Array<EntityColumnsInfo> {
    return (globalThis as any).columnsStorage;
}

export function getEntityStorage(): Array<EntityTableInfo> {
    return (globalThis as any).entityStorage;
}