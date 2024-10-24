import { DI } from "aurelia";

export interface ISvgConfig {
    svgSprites?: string;
    svgStyle?: string;
}

export interface ISvgConfiguration extends SvgConfigure {}
export const ISvgConfiguration = DI.createInterface<ISvgConfiguration>('ISvgConfiguration', x => x.singleton(SvgConfigure));

export class SvgConfigure {
    protected _config: ISvgConfig;

    constructor() {
        this._config = {
            svgStyle: 'contents',
        };
    }
    configure(incoming: ISvgConfig = null) {
        if (incoming) {
            Object.assign(this._config, incoming);
        }
        return this;
    }
    getOptions(): ISvgConfig {
        return this._config;
    }

    options(obj: ISvgConfig) {
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