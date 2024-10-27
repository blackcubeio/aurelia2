import { IEventAggregator, ILogger, IPlatform } from 'aurelia';
import { ITransition } from '../interfaces/transition-interface';
export declare const ITransitionService: import("@aurelia/kernel").InterfaceSymbol<ITransitionService>;
export interface ITransitionService extends TransitionService {
}
/**
 * TransitionService use dataset attributes to handle transitions on an element
 *      * data-transition-from : initial state of the element when entering / final state when leaving
 *      * data-transition-to : final state of the element when entering / initial state when leaving
 *      * data-transition-transition : transition to apply when entering / leaving (if data-transition-transition-leaving is not set)
 *      * data-transition-transition-leaving : transition to apply when leaving
 *      * data-transition-show : `display` value to apply before entering
 *      * data-transition-hide : `display` value to apply after leaving
 * example:
 * <div bc-transition="myTransition"
 *      data-transition-from="transform opacity-0 scale-95"
 *      data-transition-to="transform opacity-100 scale-100"
 *      data-transition-transition="transition ease-out duration-100"
 *      data-transition-transition-leaving="transition ease-in duration-75"
 *      data-transition-show="inherit"
 *      data-transition-hide="none"
 * >
 * </div>
 */
declare class TransitionService {
    private readonly logger;
    private readonly platform;
    private readonly ea;
    constructor(logger?: ILogger, platform?: IPlatform, ea?: IEventAggregator);
    enter(element: HTMLElement | SVGElement, transition: ITransition, eventName?: any, noTransition?: boolean, timeout?: number): Promise<unknown>;
    leave(element: HTMLElement | SVGElement, transition: ITransition, eventName?: any, noTransition?: boolean, timeout?: number): Promise<unknown>;
    private enterWithTransition;
    private enterWithoutTransition;
    private leaveWithTransition;
    private leaveWithoutTransition;
    private cleanupTransition;
    private waitAnimationFrame;
    private rebuildTransition;
}
export { TransitionService };
//# sourceMappingURL=transition-service.d.ts.map