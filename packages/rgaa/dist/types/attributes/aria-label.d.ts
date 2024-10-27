import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { IAriaLabel } from "../interfaces/aria-label-interfaces";
export declare class AriaLabel {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    static attribute: string;
    name: string;
    enabled: boolean;
    label: string;
    private disposable;
    constructor(logger?: ILogger, ea?: IEventAggregator, platform?: IPlatform, element?: HTMLElement);
    attached(): void;
    dispose(): void;
    onAriaLabel: (data: IAriaLabel) => void;
    private removeLabel;
    private defineLabel;
}
//# sourceMappingURL=aria-label.d.ts.map