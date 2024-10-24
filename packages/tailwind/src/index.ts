import { IContainer, IRegistry, noop } from 'aurelia';
import {ConfigInterface,ITailwindConfiguration} from './configure';
export {
};
const DefaultComponents: IRegistry[] = [
];

function createTailwindConfiguration(options: Partial<ConfigInterface>) {
    return {
        register(container: IContainer) {
            const configClass = container.get(ITailwindConfiguration);

            // @ts-ignore
            configClass.options(options);

            return container.register(...DefaultComponents)
        },
        configure(options: ConfigInterface) {
            return createTailwindConfiguration(options);
        }
    };
}

export const TailwindConfiguration = createTailwindConfiguration({});