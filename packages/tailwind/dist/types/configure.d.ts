export interface ConfigInterface {
}
export interface ITailwindConfiguration extends Configure {
}
export declare const ITailwindConfiguration: import("@aurelia/kernel").InterfaceSymbol<ITailwindConfiguration>;
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