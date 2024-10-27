import {DI, ILogger, resolve} from 'aurelia';
import {IStorageService} from './storage-service';

export const ISidebarService =
    DI.createInterface<ISidebarService>('ISidebarService', (x) =>
        x.singleton(SidebarService)
    );
export interface ISidebarService extends SidebarService {}
class SidebarService
{
    private KEY = 'sidebar:';
    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('SidebarService'),
        private readonly storageService: IStorageService = resolve(IStorageService),
    ) {
        this.logger.trace('Construct');
    }
    public getStatus(key: string): boolean
    {
        const status = this.storageService.get(this.KEY+key);
        return status === '1';
    }
    public setStatus(key: string, status: boolean): void
    {
        if (status) {
            this.storageService.set(this.KEY+key, '1');
        } else {
            this.storageService.set(this.KEY+key, '0');
        }
    }
}

export {SidebarService}
