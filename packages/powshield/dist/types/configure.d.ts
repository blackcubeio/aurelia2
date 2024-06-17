export interface IPowshieldConfig {
    generateChallengeUrl?: string;
    verifySolutionUrl?: string;
    solutionInputSelector?: string;
}
export interface IPowshieldConfiguration extends PowshieldConfigure {
}
export declare const IPowshieldConfiguration: import("@aurelia/kernel").InterfaceSymbol<IPowshieldConfiguration>;
export declare class PowshieldConfigure {
    protected _config: IPowshieldConfig;
    constructor();
    configure(incoming?: IPowshieldConfig): this;
    getOptions(): IPowshieldConfig;
    options(obj: IPowshieldConfig): void;
    get(key: string): any;
    set(key: string, val: any): any;
}
//# sourceMappingURL=configure.d.ts.map