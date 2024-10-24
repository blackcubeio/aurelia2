import { DI } from "aurelia";
export interface ConfigInterface {
    focusableElementsQuerySelector?: string;
    invalidElementsQuerySelector?: string;
    keysMonitored?: string[];
    focusDelay?: number;
}

export interface IRgaaConfiguration extends Configure {}
export const IRgaaConfiguration = DI.createInterface<IRgaaConfiguration>('IRgaaConfiguration', x => x.singleton(Configure));

export class Configure {
    protected _config: ConfigInterface;

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