export interface IWebauthnConfig {
    prepareAttachDeviceUrl?: string;
    prepareRegisterDeviceUrl?: string;
    validateRegisterUrl?: string;
    prepareLoginUrl?: string;
    prepareLoginDeviceUrl?: string;
    validateLoginUrl?: string;
}
export interface IWebauthnConfiguration extends WebauthnConfigure {
}
export declare const IWebauthnConfiguration: import("@aurelia/kernel").InterfaceSymbol<IWebauthnConfiguration>;
export declare class WebauthnConfigure {
    protected _config: IWebauthnConfig;
    constructor();
    configure(incoming?: IWebauthnConfig): this;
    getOptions(): IWebauthnConfig;
    options(obj: IWebauthnConfig): void;
    get(key: string): any;
    set(key: string, val: any): any;
}
//# sourceMappingURL=configure.d.ts.map