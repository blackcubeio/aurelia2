import { DI } from "aurelia";

// --------------- Webauthn ---------------
export interface IWebauthnConfig {
    prepareAttachDeviceUrl?: string;
    prepareRegisterDeviceUrl?: string;
    validateRegisterUrl?: string;
    prepareLoginUrl?: string;
    prepareLoginDeviceUrl?: string;
    validateLoginUrl?: string;
}

export interface IWebauthnConfiguration extends WebauthnConfigure {}

export const IWebauthnConfiguration = DI.createInterface<IWebauthnConfiguration>('IWebauthnConfiguration', x => x.singleton(WebauthnConfigure));

export class WebauthnConfigure {
    protected _config: IWebauthnConfig;

    constructor() {
        this._config = {
            prepareAttachDeviceUrl: '/webauthn/prepare-register-user-device',
            prepareRegisterDeviceUrl: '/webauthn/prepare-register-device',
            validateRegisterUrl: '/webauthn/register-validate',
            prepareLoginUrl: '/webauthn/prepare-login-user-device',
            prepareLoginDeviceUrl: '/webauthn/prepare-login-device',
            validateLoginUrl: '/webauthn/login-validate'
        };
        console.log('WebauthnConfiguration constructor');
    }
    configure(incoming: IWebauthnConfig = undefined) {
        if (incoming) {
            Object.assign(this._config, incoming);
        }
        return this;
    }
    getOptions(): IWebauthnConfig {
        return this._config;
    }

    options(obj: IWebauthnConfig) {
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