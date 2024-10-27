export interface ITasksRunnerConfig {
    workers?: number;
}
export interface ITasksRunnerConfiguration extends TasksRunnerConfigure {
}
export declare const ITasksRunnerConfiguration: import("@aurelia/kernel").InterfaceSymbol<ITasksRunnerConfiguration>;
export declare class TasksRunnerConfigure {
    protected _config: ITasksRunnerConfig;
    constructor();
    configure(incoming?: ITasksRunnerConfig): this;
    getOptions(): ITasksRunnerConfig;
    options(obj: ITasksRunnerConfig): void;
    get(key: string): any;
    set(key: string, val: any): any;
}
//# sourceMappingURL=configure.d.ts.map