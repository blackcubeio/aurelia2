export interface IAriaConfig {
    focusableElementsQuerySelector?: string;
    invalidElementsQuerySelector?: string;
    keysMonitored?: string[];
    focusDelay?: number;
}
export interface IAriaConfiguration extends AriaConfigure {
}
export declare const IAriaConfiguration: import("@aurelia/kernel").InterfaceSymbol<IAriaConfiguration>;
export declare class AriaConfigure {
    protected _config: IAriaConfig;
    constructor();
    configure(incoming?: IAriaConfig): this;
    getOptions(): IAriaConfig;
    options(obj: IAriaConfig): void;
    get(key: string): any;
    set(key: string, val: any): any;
}
//# sourceMappingURL=configure.d.ts.map