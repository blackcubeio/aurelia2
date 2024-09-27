import { RunnerState } from '../enums/taskrunner';
import { Task } from './task';
export declare class WorkerRunner {
    private blobUrl;
    private worker;
    private status;
    constructor();
    setState(state: RunnerState): void;
    getState(): RunnerState;
    private getInlineWorkerScript;
    destroy(): void;
    private prepareTaskForWorker;
    run: (task: Task) => Promise<any>;
}
//# sourceMappingURL=worker-runner.d.ts.map