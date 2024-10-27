export interface ISvgConfig {
    svgSprites?: string;
    svgStyle?: string;
}
export interface ISvgConfiguration extends SvgConfigure {
}
export declare const ISvgConfiguration: import("@aurelia/kernel").InterfaceSymbol<ISvgConfiguration>;
export declare class SvgConfigure {
    protected _config: ISvgConfig;
    constructor();
    configure(incoming?: ISvgConfig): this;
    getOptions(): ISvgConfig;
    options(obj: ISvgConfig): void;
    get(key: string): any;
    set(key: string, val: any): any;
}
//# sourceMappingURL=configure.d.ts.map