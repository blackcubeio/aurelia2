import { ILogger, IPlatform } from 'aurelia';
import { ITasksRunnerConfiguration } from '../configure';
declare class Task {
    readonly job: Function;
    readonly args: any[];
    static globalId: number;
    id: number;
    promise: Promise<any>;
    fn: Function;
    finished: boolean;
    result: any;
    broadcastChannel: BroadcastChannel;
    onBcMessage: Function;
    constructor(job: Function, args?: any[]);
}
export declare const ITasksRunnerService: import("@aurelia/kernel").InterfaceSymbol<ITasksRunnerService>;
export interface ITasksRunnerService extends TasksRunnerService {
}
export declare class TasksRunnerService {
    private readonly logger;
    private readonly options;
    private readonly platform;
    private broadcastChannel;
    private queuedTasks;
    constructor(logger?: ILogger, options?: ITasksRunnerConfiguration, platform?: IPlatform);
    enqueue(task: Task): Promise<any>;
    private nextTask;
}
export {};
//# sourceMappingURL=tasks-runner.d.ts.map