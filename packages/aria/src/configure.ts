import { DI } from "aurelia";
export interface IAriaConfig {
    focusableElementsQuerySelector?: string;
    invalidElementsQuerySelector?: string;
    keysMonitored?: string[];
    focusDelay?: number;
}

export interface IAriaConfiguration extends  AriaConfigure {}
export const IAriaConfiguration = DI.createInterface<IAriaConfiguration>('IAriaConfiguration', x => x.singleton( AriaConfigure));

export class  AriaConfigure {
    protected _config: IAriaConfig;

    constructor() {
        this._config = {
            focusableElementsQuerySelector: '[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [accesskey], summary, canvas, audio, video, details, iframe, [contenteditable]',
            invalidElementsQuerySelector: '[aria-invalid="true"], :invalid',
            keysMonitored: [
                'Escape',
            ],
            focusDelay: 100,
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