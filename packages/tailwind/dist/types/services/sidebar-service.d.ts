import { ILogger } from 'aurelia';
import { IStorageService } from './storage-service';
export declare const ISidebarService: import("@aurelia/kernel").InterfaceSymbol<ISidebarService>;
export interface ISidebarService extends SidebarService {
}
declare class SidebarService {
    private readonly logger;
    private readonly storageService;
    private KEY;
    constructor(logger?: ILogger, storageService?: IStorageService);
    getStatus(key: string): boolean;
    setStatus(key: string, status: boolean): void;
}
export { SidebarService };
//# sourceMappingURL=sidebar-service.d.ts.map