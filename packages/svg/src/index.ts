import { IContainer, IRegistry, noop } from '@aurelia/kernel';
import {
    ISvgConfig,
    ISvgConfiguration
} from './configure';
import {SvgSprite} from './components/svg-sprite';

export {
    ISvgConfig,
    ISvgConfiguration,
};
const DefaultComponents: IRegistry[] = [
    SvgSprite as unknown as IRegistry,
];

function createSvgConfiguration(options: Partial<ISvgConfig>) {
    return {
        register(container: IContainer) {
            const configClass = container.get(ISvgConfiguration);

            // @ts-ignore
            configClass.options(options);

            return container.register(...DefaultComponents)
        },
        configure(options: ISvgConfig) {
            return createSvgConfiguration(options);
        }
    };
}

export const ToolsConfiguration = createSvgConfiguration({});
