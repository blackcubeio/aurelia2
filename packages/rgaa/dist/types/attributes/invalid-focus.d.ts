import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { IRgaaConfiguration } from "../configure";
import { IHtmlInvalidFocus } from "../interfaces/html-invalid-focus-interfaces";
export declare class InvalidFocus {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    private readonly options;
    static attribute: string;
    name: string;
    private disposable;
    private invalidElementsQuerySelector;
    private focusDelay;
    constructor(logger?: ILogger, ea?: IEventAggregator, platform?: IPlatform, element?: HTMLElement, options?: IRgaaConfiguration);
    attached(): void;
    detached(): void;
    dispose(): void;
    onInvalidFocus: (data: IHtmlInvalidFocus) => void;
    private removeInvalidFocus;
    private defineInvalidFocus;
}
//# sourceMappingURL=invalid-focus.d.ts.map