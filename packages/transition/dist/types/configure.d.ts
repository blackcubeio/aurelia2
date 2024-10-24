export interface ITransitionConfig {
}
export interface ITransitionConfiguration extends TransitionConfigure {
}
export declare const ITransitionConfiguration: import("@aurelia/kernel").InterfaceSymbol<ITransitionConfiguration>;
export declare class TransitionConfigure {
    protected _config: ITransitionConfig;
    constructor();
    configure(incoming?: ITransitionConfig): this;
    getOptions(): ITransitionConfig;
    options(obj: ITransitionConfig): void;
    get(key: string): any;
    set(key: string, val: any): any;
}
//# sourceMappingURL=configure.d.ts.map