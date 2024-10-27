import { ICustomAttributeViewModel, IEventAggregator, ILogger, IPlatform } from "aurelia";
import { ITransitionService } from "../services/transition-service";
import { ITransitionRun } from "../interfaces/transition-interface";
export declare class Transition implements ICustomAttributeViewModel {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly transitionService;
    private readonly element;
    name: string;
    private disposable;
    /**
     * Attribute used to handle transitions on an element runned when a message is received on the TransitionChannels.main channel
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
    constructor(logger?: ILogger, ea?: IEventAggregator, platform?: IPlatform, transitionService?: ITransitionService, element?: HTMLElement);
    attaching(): void;
    attached(): void;
    dispose(): void;
    onTransition: (data: ITransitionRun) => void;
}
//# sourceMappingURL=transition.d.ts.map