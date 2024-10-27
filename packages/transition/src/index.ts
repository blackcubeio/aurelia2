import { IContainer, IRegistry } from 'aurelia';
import {
    ITransitionConfig,
    ITransitionConfiguration,
} from './configure';
import {ITransitionService, TransitionService} from "./services/transition-service";
import {ITransition, ITransitionRun, ITransitionProgress} from "./interfaces/transition-interface";
import {TransitionModes, TransitionChannels, TransitionStatus} from "./enums/transition-enums";
import {Transition} from "./attributes/transition";
export {
    ITransitionConfig,
    ITransitionConfiguration,
    ITransitionService, TransitionService,
    ITransition, ITransitionRun, ITransitionProgress,
    TransitionModes, TransitionChannels, TransitionStatus,

};
const DefaultComponents: IRegistry[] = [
    Transition as unknown as IRegistry,
];

function createTransitionConfiguration(options: Partial<ITransitionConfig>) {
    return {
        register(container: IContainer) {
            const configClass = container.get(ITransitionConfiguration);

            // @ts-ignore
            configClass.options(options);

            return container.register(...DefaultComponents)
        },
        configure(options: ITransitionConfig) {
            return createTransitionConfiguration(options);
        }
    };
}

export const TransitionConfiguration = createTransitionConfiguration({});
