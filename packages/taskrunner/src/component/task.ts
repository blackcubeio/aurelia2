import {IStatistics} from '../interfaces/taskrunner';

export class Task {
    get statistics(): IStatistics {
        return this._statistics;
    }

    set statistics(value: IStatistics) {
        this._statistics = value;
    }

    get args(): any[] {
        return this._args;
    }

    get id(): number {
        return this._id;
    }

    private static taskId = 0;

    private _id: number;
    private _args: any[] = [];

    private _statistics: IStatistics = {
        started: -1,
        ended: -1
    };

    constructor(doFunction: (args: any[]) => Promise<any>, args: any[]) {
        this._id = ++Task.taskId;
        this.doFunction = doFunction;
        this._args = args;
    }

    doFunction = (args: any[]) => {
        return new Promise<any>((resolve, reject) => {
            reject('Not implemented');
        });
    }
}