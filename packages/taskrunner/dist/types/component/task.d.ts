import { IStatistics } from '../interfaces/taskrunner';
export declare class Task {
    get statistics(): IStatistics;
    set statistics(value: IStatistics);
    get args(): any[];
    get id(): number;
    private static taskId;
    private _id;
    private _args;
    private _statistics;
    constructor(doFunction: (args: any[]) => Promise<any>, args: any[]);
    doFunction: (args: any[]) => Promise<any>;
}
//# sourceMappingURL=task.d.ts.map