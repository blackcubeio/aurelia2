import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { LiveModes } from "../enums/aria-live-enums";
import { IAriaLive } from "../interfaces/aria-live-interfaces";
export declare class AriaLive {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    static attribute: string;
    name: string;
    mode: LiveModes;
    enabled: boolean;
    private disposable;
    constructor(logger?: ILogger, ea?: IEventAggregator, platform?: IPlatform, element?: HTMLElement);
    attached(): void;
    dispose(): void;
    onAriaLive: (data: IAriaLive) => void;
    private removeLive;
    private defineLive;
}
//# sourceMappingURL=aria-live.d.ts.map