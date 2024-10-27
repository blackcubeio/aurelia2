import { DI } from "aurelia";

export interface ITransitionConfig {
}

export interface ITransitionConfiguration extends TransitionConfigure {}
export const ITransitionConfiguration = DI.createInterface<ITransitionConfiguration>('ITransitionConfiguration', x => x.singleton(TransitionConfigure));

export class TransitionConfigure {
    protected _config: ITransitionConfig;

    constructor() {
        this._config = {
        };
    }
    configure(incoming: ITransitionConfig = null) {
        if (incoming) {
            Object.assign(this._config, incoming);
        }
        return this;
    }
    getOptions(): ITransitionConfig {
        return this._config;
    }

    options(obj: ITransitionConfig) {
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
