import { IContainer, IRegistry, noop } from '@aurelia/kernel';
import {
    IRecaptchaConfig,
    IRecaptchaConfiguration,
} from './configure';

import {Recaptcha} from './attributes/recaptcha';

export {
    IRecaptchaConfig,
    IRecaptchaConfiguration,
};

const RecaptchaDefaultComponents: IRegistry[] = [
    Recaptcha as unknown as IRegistry,
];

function createRecaptchaConfiguration(options: Partial<IRecaptchaConfig>) {
    return {
        register(container: IContainer) {
            const configClass = container.get(IRecaptchaConfiguration);

            // @ts-ignore
            configClass.options(options);

            return container.register(...RecaptchaDefaultComponents)
        },
        configure(options: IRecaptchaConfig) {
            return createRecaptchaConfiguration(options);
        }
    };
}

export const RecaptchaConfiguration = createRecaptchaConfiguration({});