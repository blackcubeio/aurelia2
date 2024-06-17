export interface IRecaptchaConfig {
    apiKey?: string;
    apiUrl?: string;
    verifyUrl?: string;
    size?: string;
    badge?: string;
    theme?: string;
}
export interface IRecaptchaConfiguration extends RecaptchaConfigure {
}
export declare const IRecaptchaConfiguration: import("@aurelia/kernel").InterfaceSymbol<IRecaptchaConfiguration>;
export declare class RecaptchaConfigure {
    protected _config: IRecaptchaConfig;
    constructor();
    configure(incoming?: IRecaptchaConfig): this;
    getOptions(): IRecaptchaConfig;
    options(obj: IRecaptchaConfig): void;
    get(key: string): any;
    set(key: string, val: any): any;
}
//# sourceMappingURL=configure.d.ts.map