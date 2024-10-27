import {DI, ILogger, IPlatform, resolve} from 'aurelia';
import {ITasksRunnerConfiguration} from '../configure';

class Task {
    public static globalId: number = 0;
    public id:number;
    public promise: Promise<any>;
    public fn: Function;
    public finished: boolean = false;
    public result: any;
    public broadcastChannel: BroadcastChannel;
    public onBcMessage: Function;
    public constructor(
        public readonly job: Function,
        public readonly args: any[] = [],
    ) {

        this.id = ++Task.globalId;
    }

}
export const ITasksRunnerService =
    DI.createInterface<ITasksRunnerService>('ITasksRunnerService', (x) =>
        x.singleton(TasksRunnerService)
    );
export interface ITasksRunnerService extends TasksRunnerService {}
export class TasksRunnerService {

    private broadcastChannel: BroadcastChannel;

    private queuedTasks: Task[] = [];
    public constructor(
        private readonly logger: ILogger = resolve(ILogger),
        private readonly options: ITasksRunnerConfiguration = resolve(ITasksRunnerConfiguration),
        private readonly platform: IPlatform = resolve(IPlatform),
    ) {
        this.logger = logger.scopeTo('TasksRunnerService');
        this.logger.trace('constructor');
        this.broadcastChannel = new BroadcastChannel('tasks-runner');
    }
    public enqueue(task: Task) {
        task.broadcastChannel = new BroadcastChannel('task');
        task.promise = new Promise((resolve, reject) => {
            task.onBcMessage = (event: MessageEvent) => {
                switch(event.data.command) {
                    case 'task-finished':
                        if(event.data.id === task.id) {
                            resolve(task.result);
                        }
                        break;
                    case 'task-started':
                        if(event.data.id === task.id) {
                            task.finished = false;
                        }
                        break;
                }
            };
        });
        this.queuedTasks.push(task);
        return task.promise;
    }
    private nextTask() {
        const task = this.queuedTasks.shift();
        task.broadcastChannel.postMessage({
            command: 'run',
            id: task.id,
            args: task.args,
            job: task.job.toString(),
        });
    }
}