export interface ITailwindConfig {
}
export interface ITailwindConfiguration extends Configure {
}
export declare const ITailwindConfiguration: import("@aurelia/kernel").InterfaceSymbol<ITailwindConfiguration>;
export declare class Configure {
    protected _config: ITailwindConfig;
    constructor();
    configure(incoming?: ITailwindConfig): this;
    getOptions(): ITailwindConfig;
    options(obj: ITailwindConfig): void;
    get(key: string): any;
    set(key: string, val: any): any;
}
//# sourceMappingURL=configure.d.ts.map