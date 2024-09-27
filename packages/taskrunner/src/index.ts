import { IContainer, IRegistry } from 'aurelia';
import {
    ITasksRunnerConfig,
    ITasksRunnerConfiguration,
} from './configure';

export {
    ITasksRunnerConfig,
    ITasksRunnerConfiguration,
};

const DefaultComponents: IRegistry[] = [
    //Powshield as unknown as IRegistry,
];

function createTasksRunnerConfiguration(options: Partial<ITasksRunnerConfig>) {
    return {
        register(container: IContainer) {
            const configClass = container.get(ITasksRunnerConfiguration);

            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents)
        },
        configure(options: ITasksRunnerConfig) {
            return createTasksRunnerConfiguration(options);
        }
    };
}

export const TasksRunnerConfiguration = createTasksRunnerConfiguration({});