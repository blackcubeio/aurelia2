import { IContainer, IRegistry } from 'aurelia';
import {IAriaConfig, IAriaConfiguration} from './configure';
import {IAriaSet, IAriaRevert, IAriaTrapFocus} from './interfaces/aria';
import {IAriaService, AriaService} from './services/aria-service';
import {Aria} from './attributes';
export {
    IAriaConfig,
    IAriaConfiguration,
    IAriaSet,
    IAriaRevert,
    IAriaTrapFocus,
    IAriaService,
    AriaService

};
const DefaultComponents: IRegistry[] = [
    Aria as unknown as IRegistry,
];

function createAriaConfiguration(options: Partial<IAriaConfig>) {
    return {
        register(container: IContainer) {
            const configClass = container.get(IAriaConfiguration);

            // @ts-ignore
            configClass.options(options);

            return container.register(...DefaultComponents)
        },
        configure(options: IAriaConfig) {
            return createAriaConfiguration(options);
        }
    };
}

export const AriaConfiguration = createAriaConfiguration({});