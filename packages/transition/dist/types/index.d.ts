import { IContainer } from 'aurelia';
import { ITransitionConfig, ITransitionConfiguration } from './configure';
import { ITransitionService, TransitionService } from "./services/transition-service";
import { ITransition, ITransitionRun, ITransitionProgress } from "./interfaces/transition-interface";
import { TransitionModes, TransitionChannels, TransitionStatus } from "./enums/transition-enums";
export { ITransitionConfig, ITransitionConfiguration, ITransitionService, TransitionService, ITransition, ITransitionRun, ITransitionProgress, TransitionModes, TransitionChannels, TransitionStatus, };
export declare const TransitionConfiguration: {
    register(container: IContainer): IContainer;
    configure(options: ITransitionConfig): any;
};
//# sourceMappingURL=index.d.ts.map