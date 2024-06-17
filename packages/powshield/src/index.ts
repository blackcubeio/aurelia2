import { IContainer, IRegistry } from 'aurelia';
import {
    IPowshieldConfig,
    IPowshieldConfiguration,
} from './configure';
import {IHttpService, HttpService} from './services/http-service';
import {IHttpResponse} from './interfaces/http';
import {IPowshieldService, PowshieldService} from './services/powshield-service';
import {Algorithm} from './types/powshield';
import {IPowshieldChallenge, IPowshieldSolution} from './interfaces/powshield';
import {Powshield} from './attributes/powshield';

export {
    IPowshieldConfig,
    IPowshieldConfiguration,
    IHttpService, HttpService, IHttpResponse,
    Algorithm, IPowshieldChallenge, IPowshieldSolution,
    IPowshieldService, PowshieldService,
    Powshield,
};

const DefaultComponents: IRegistry[] = [
    Powshield as unknown as IRegistry,
];

function createPowshieldConfiguration(options: Partial<IPowshieldConfig>) {
    return {
        register(container: IContainer) {
            const configClass = container.get(IPowshieldConfiguration);

            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents)
        },
        configure(options: IPowshieldConfig) {
            return createPowshieldConfiguration(options);
        }
    };
}

export const PowshieldConfiguration = createPowshieldConfiguration({});