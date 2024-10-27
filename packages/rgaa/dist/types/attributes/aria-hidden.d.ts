import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { HiddenModes } from "../enums/aria-hidden-enums";
import { IAriaHidden } from "../interfaces/aria-hidden-interfaces";
export declare class AriaHidden {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    static attribute: string;
    name: string;
    enabled: boolean;
    mode: HiddenModes;
    private disposable;
    constructor(logger?: ILogger, ea?: IEventAggregator, platform?: IPlatform, element?: HTMLElement);
    attached(): void;
    dispose(): void;
    onAriaHidden: (data: IAriaHidden) => void;
    private removeHidden;
    private defineHidden;
}
//# sourceMappingURL=aria-hidden.d.ts.map