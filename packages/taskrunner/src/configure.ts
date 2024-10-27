import { DI } from "aurelia";

// --------------- TasksRunner ---------------
export interface ITasksRunnerConfig {
    workers?: number;
}

export interface ITasksRunnerConfiguration extends TasksRunnerConfigure {}

export const ITasksRunnerConfiguration = DI.createInterface<ITasksRunnerConfiguration>('ITasksRunnerConfiguration', x => x.singleton(TasksRunnerConfigure));

export class TasksRunnerConfigure {
    protected _config: ITasksRunnerConfig;

    constructor() {
        this._config = {
            workers: navigator.hardwareConcurrency || 10
        };
        console.log('PowshieldConfigure constructor');
    }
    configure(incoming: ITasksRunnerConfig = undefined) {
        if (incoming) {
            Object.assign(this._config, incoming);
        }
        return this;
    }
    getOptions(): ITasksRunnerConfig {
        return this._config;
    }

    options(obj: ITasksRunnerConfig) {
        Object.assign(this._config, obj);
    }

    get(key: string) {
        // @ts-ignore
        return this._config[key];
    }

    set(key: string, val: any) {
        // @ts-ignore
        this._config[key] = val;
        // @ts-ignore
        return this._config[key];
    }
}