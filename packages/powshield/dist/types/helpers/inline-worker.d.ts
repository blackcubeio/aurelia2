export declare class InlineWorker {
    private blobURL;
    private worker;
    private status;
    constructor();
    run: (job: InlineWorkerJob) => Promise<any>;
    private convertJobToObj;
    /**
     * destroys the Taskmanager if not needed anymore.
     */
    destroy(): void;
    private getWorkerScript;
}
export declare enum InlineWorkerState {
    INITIALIZED = "initialized",
    RUNNING = "running",
    FINISHED = "finished",
    FAILED = "failed",
    STOPPED = "stopped"
}
export declare class InlineWorkerJob {
    get statistics(): {
        ended: number;
        started: number;
    };
    set statistics(value: {
        ended: number;
        started: number;
    });
    get args(): any[];
    get id(): number;
    private static jobIDCounter;
    private _id;
    private _args;
    private _statistics;
    constructor(doFunction: (args: any[]) => Promise<any>, args: any[]);
    doFunction: (args: any[]) => Promise<any>;
}
export interface InlineWorkerEvent {
    status: InlineWorkerState;
    result: any;
    statistics?: {
        started: number;
        ended: number;
    };
    message?: string;
}
//# sourceMappingURL=inline-worker.d.ts.map