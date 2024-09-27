import {RunnerState} from '../enums/taskrunner';
import {Task} from './task';

export class WorkerRunner {
    private blobUrl: string;
    private worker: Worker;
    private status: RunnerState = RunnerState.AVAILABLE;

    constructor() {
        this.blobUrl = URL.createObjectURL(new Blob([
                this.getInlineWorkerScript()
            ],
            {
                type: 'application/javascript'
            }
        ));
        this.worker = new Worker(this.blobUrl);
    }

    public setState(state: RunnerState) {
        this.status = state;
    }
    public getState(): RunnerState {
        return this.status;
    }
    private getInlineWorkerScript() {
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

    public destroy() {
        this.worker.terminate();
        URL.revokeObjectURL(this.blobUrl);
    }

    private prepareTaskForWorker(task: Task) {
        return {
            id: task.id,
            args: task.args,
            doFunction: task.doFunction.toString()
        };
    }

    public run = (task: Task): Promise<any> => {
        return new Promise<any>(
            (resolve, reject) => {
                this.worker.onmessage = (ev: MessageEvent) => {
                    task.statistics.ended = Date.now();
                    this.status = ev.data.status;
                    ev.data.statistics = task.statistics;
                    resolve(ev.data);
                };

                this.worker.onerror = (err) => {
                    task.statistics.ended = Date.now();
                    this.status = RunnerState.FAILED;
                    reject({
                        status: RunnerState.FAILED,
                        message: err,
                        statistics: task.statistics
                    });
                };

                task.statistics.started = Date.now();
                this.worker.postMessage({
                    command: 'run',
                    args: [this.prepareTaskForWorker(task)]
                });
            }
        );
    }
}