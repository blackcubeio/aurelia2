import { TaskState } from '../enums/taskrunner';
export interface IStatistics {
    started: number;
    ended: number;
}
export interface ITaskEvent {
    status: TaskState;
    result: any;
    statistics?: IStatistics;
    message?: string;
}
//# sourceMappingURL=taskrunner.d.ts.map