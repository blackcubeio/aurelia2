import { DI } from "aurelia";

// --------------- Recaptcha ---------------
export interface IRecaptchaConfig {
    apiKey?: string;
    apiUrl?: string;
    verifyUrl?: string;
    size?: string;
    badge?: string;
    theme?: string;
}


declare var googleRecaptchaApiKey:string;

export interface IRecaptchaConfiguration extends RecaptchaConfigure {}
export const IRecaptchaConfiguration = DI.createInterface<IRecaptchaConfiguration>('IRecaptchaConfiguration', x => x.singleton(RecaptchaConfigure));

export class RecaptchaConfigure {
    protected _config: IRecaptchaConfig;

    constructor() {
        this._config = {
            apiUrl: 'https://www.google.com/recaptcha/api.js',
            size: 'invisible',
            badge: 'none',
            theme: 'light',
        };
        if (googleRecaptchaApiKey) {
            this._config.apiKey = googleRecaptchaApiKey;
        }
    }
    configure(incoming: IRecaptchaConfig = null) {
        if (incoming) {
            Object.assign(this._config, incoming);
        }
        return this;
    }
    getOptions(): IRecaptchaConfig {
        return this._config;
    }

    options(obj: IRecaptchaConfig) {
        Object.assign(this._config, obj);
    }

    get(key: string) {
        // @ts-ignore
        return this._config[key];
    }

    set(key: string, val: any) {
        // @ts-ignore
        this._config[key] = val;
        // @ts-ignore
        return this._config[key];
    }
}
