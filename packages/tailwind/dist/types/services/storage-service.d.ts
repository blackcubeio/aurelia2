import { ILogger } from 'aurelia';
export declare const IStorageService: import("@aurelia/kernel").InterfaceSymbol<IStorageService>;
export interface IStorageService extends StorageService {
}
declare class StorageService {
    private readonly logger;
    private storage;
    constructor(logger?: ILogger);
    get(key: string): string | null;
    set(key: string, value: string): void;
}
export { StorageService };
//# sourceMappingURL=storage-service.d.ts.map