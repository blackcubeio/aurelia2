export class InlineWorker {
    private blobURL: string;
    private worker: Worker;

    private status: InlineWorkerState = InlineWorkerState.INITIALIZED;

    constructor() {
        // creates an worker that runs a job
        this.blobURL = URL.createObjectURL(new Blob([
                this.getWorkerScript()
            ],
            {
                type: 'application/javascript'
            }
        ));
        this.worker = new Worker(this.blobURL);
    }

    public run = (job: InlineWorkerJob): Promise<any> => {
        return new Promise<any>(
            (resolve, reject) => {
                this.worker.onmessage = (ev: MessageEvent) => {
                    job.statistics.ended = Date.now();
                    this.status = ev.data.status;
                    ev.data.statistics = job.statistics;
                    resolve(ev.data);
                };

                this.worker.onerror = (err) => {
                    job.statistics.ended = Date.now();
                    this.status = InlineWorkerState.FAILED;

                    reject({
                        status: InlineWorkerState.FAILED,
                        message: err,
                        statistics: job.statistics
                    });
                };

                job.statistics.started = Date.now();
                this.worker.postMessage({
                    command: 'run',
                    args: [this.convertJobToObj(job)]
                });
            }
        );
    }

    private convertJobToObj(job: InlineWorkerJob) {
        return {
            id: job.id,
            args: job.args,
            doFunction: job.doFunction.toString()
        };
    }

    /**
     * destroys the Taskmanager if not needed anymore.
     */
    public destroy() {
        this.worker.terminate();
        URL.revokeObjectURL(this.blobURL);
    }

    private getWorkerScript(): string {
        return `var job = null;
var base = self;

onmessage = function (msg) {
    var data = msg.data;
    var command = data.command;
    var args = data.args;

    switch (command) {
        case("run"):
            base.job = args[0];
            var func = new Function("return " + base.job.doFunction)();
            func(base.job.args).then(function (result) {
                base.postMessage({
                    status: "finished",
                    result: result
                });
            }).catch(function (error) {
                base.postMessage({
                    type: "failed",
                    message: error
                });
            });
            break;
        default:
            base.postMessage({
                status: "failed",
                message: "invalid command"
            });
            break;
    }
}`;
    }
}

export enum InlineWorkerState {
    INITIALIZED = 'initialized',
    RUNNING = 'running',
    FINISHED = 'finished',
    FAILED = 'failed',
    STOPPED = 'stopped'
}

export class InlineWorkerJob {
    get statistics(): { ended: number; started: number } {
        return this._statistics;
    }

    set statistics(value: { ended: number; started: number }) {
        this._statistics = value;
    }

    get args(): any[] {
        return this._args;
    }

    get id(): number {
        return this._id;
    }

    private static jobIDCounter = 0;
    private _id: number;
    private _args: any[] = [];

    private _statistics = {
        started: -1,
        ended: -1
    };

    constructor(doFunction: (args: any[]) => Promise<any>, args: any[]) {
        this._id = ++InlineWorkerJob.jobIDCounter;
        this.doFunction = doFunction;
        this._args = args;
    }

    doFunction = (args: any[]) => {
        return new Promise<any>((resolve, reject) => {
            reject('not implemented');
        });
    }
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