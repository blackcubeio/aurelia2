import { DI } from "aurelia";
export interface IAriaConfig {
}

export interface IAriaConfiguration extends AriaConfigure {}
export const IAriaConfiguration = DI.createInterface<IAriaConfiguration>('IAriaConfiguration', x => x.singleton(AriaConfigure));

export class AriaConfigure {
    protected _config: IAriaConfig;

    constructor() {
        this._config = {
        };
    }
    configure(incoming: IAriaConfig = {}) {
        Object.assign(this._config, incoming);
        return this;
    }
    getOptions(): IAriaConfig {
        return this._config;
    }

    options(obj: IAriaConfig) {
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