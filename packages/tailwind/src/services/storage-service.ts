import {DI, ILogger, resolve} from 'aurelia';

export const IStorageService =
    DI.createInterface<IStorageService>('IStorageService', (x) =>
        x.singleton(StorageService)
    );
export interface IStorageService extends StorageService {}
class StorageService
{
    private storage: Storage = localStorage;
    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('StorageService'),
    ) {
        this.logger.trace('Construct');
    }
    public get(key: string): string | null
    {
        return this.storage.getItem(key);
    }
    public set(key: string, value: string): void
    {
        this.storage.setItem(key, value);
    }
}

export {StorageService}
