import { IEventAggregator, ILogger, IPlatform } from 'aurelia';
import { ITransition } from '../interfaces/transition-interface';
export declare const ITransitionService: import("@aurelia/kernel").InterfaceSymbol<ITransitionService>;
export interface ITransitionService extends TransitionService {
}
declare class TransitionService {
    private readonly logger;
    private readonly platform;
    private readonly ea;
    constructor(logger?: ILogger, platform?: IPlatform, ea?: IEventAggregator);
    enter(element: HTMLElement | SVGElement, transition: ITransition, eventName?: any, noTransition?: boolean): Promise<unknown>;
    leave(element: HTMLElement | SVGElement, transition: ITransition, eventName?: any, noTransition?: boolean): Promise<unknown>;
    private enterWithTransition;
    private enterWithoutTransition;
    private leaveWithTransition;
    private leaveWithoutTransition;
    private cleanupTransition;
    private waitAnimationFrame;
}
export { TransitionService };
//# sourceMappingURL=transition-service.d.ts.map