export interface ConfigInterface {
    focusableElementsQuerySelector?: string;
    invalidElementsQuerySelector?: string;
    keysMonitored?: string[];
    focusDelay?: number;
}
export interface IRgaaConfiguration extends Configure {
}
export declare const IRgaaConfiguration: import("@aurelia/kernel").InterfaceSymbol<IRgaaConfiguration>;
export declare class Configure {
    protected _config: ConfigInterface;
    constructor();
    configure(incoming?: ConfigInterface): this;
    getOptions(): ConfigInterface;
    options(obj: ConfigInterface): void;
    get(key: string): any;
    set(key: string, val: any): any;
}
//# sourceMappingURL=configure.d.ts.map