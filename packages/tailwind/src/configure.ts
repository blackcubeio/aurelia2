import { DI } from "aurelia";
export interface ConfigInterface {
}

export interface ITailwindConfiguration extends Configure {}
export const ITailwindConfiguration = DI.createInterface<ITailwindConfiguration>('ITailwindConfiguration', x => x.singleton(Configure));

export class Configure {
    protected _config: ConfigInterface;

    constructor() {
        this._config = {
        };
    }
    configure(incoming: ConfigInterface = {}) {
        Object.assign(this._config, incoming);
        return this;
    }
    getOptions(): ConfigInterface {
        return this._config;
    }

    options(obj: ConfigInterface) {
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