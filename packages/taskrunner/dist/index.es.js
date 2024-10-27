import { DI } from 'aurelia';

const ITasksRunnerConfiguration = DI.createInterface('ITasksRunnerConfiguration', x => x.singleton(TasksRunnerConfigure));
class TasksRunnerConfigure {
    constructor() {
        this._config = {
            workers: navigator.hardwareConcurrency || 10
        };
        console.log('PowshieldConfigure constructor');
    }
    configure(incoming = undefined) {
        if (incoming) {
            Object.assign(this._config, incoming);
        }
        return this;
    }
    getOptions() {
        return this._config;
    }
    options(obj) {
        Object.assign(this._config, obj);
    }
    get(key) {
        // @ts-ignore
        return this._config[key];
    }
    set(key, val) {
        // @ts-ignore
        this._config[key] = val;
        // @ts-ignore
        return this._config[key];
    }
}

const DefaultComponents = [
//Powshield as unknown as IRegistry,
];
function createTasksRunnerConfiguration(options) {
    return {
        register(container) {
            const configClass = container.get(ITasksRunnerConfiguration);
            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents);
        },
        configure(options) {
            return createTasksRunnerConfiguration(options);
        }
    };
}
const TasksRunnerConfiguration = createTasksRunnerConfiguration({});

export { ITasksRunnerConfiguration, TasksRunnerConfiguration };
//# sourceMappingURL=index.es.js.map
