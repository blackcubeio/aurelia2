import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { ExpandedModes } from "../enums/aria-expanded-enums";
import { IAriaExpanded } from "../interfaces/aria-expanded-interfaces";
export declare class AriaExpanded {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    static attribute: string;
    name: string;
    enabled: boolean;
    mode: ExpandedModes;
    private disposable;
    constructor(logger: ILogger, ea: IEventAggregator, platform: IPlatform, element: HTMLElement);
    attached(): void;
    dispose(): void;
    onAriaExpand: (data: IAriaExpanded) => void;
    private removeExpanded;
    private defineExpanded;
}
//# sourceMappingURL=aria-expanded.d.ts.map