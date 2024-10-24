import { DI } from "aurelia";
export interface ITailwindConfig {
}

export interface ITailwindConfiguration extends Configure {}
export const ITailwindConfiguration = DI.createInterface<ITailwindConfiguration>('ITailwindConfiguration', x => x.singleton(Configure));

export class Configure {
    protected _config: ITailwindConfig;

    constructor() {
        this._config = {
        };
    }
    configure(incoming: ITailwindConfig = {}) {
        Object.assign(this._config, incoming);
        return this;
    }
    getOptions(): ITailwindConfig {
        return this._config;
    }

    options(obj: ITailwindConfig) {
        Object.assign(this._config, obj);
    }

    get(key: string) {
        return this._config[key];
    }

    set(key: string, val: any) {
        this._config[key] = val;
        return this._config[key];
    }
}