import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { IHtmlFocus } from "../interfaces/html-focus-interfaces";
import { IRgaaConfiguration } from "../configure";
export declare class Focus {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    private readonly options;
    static attribute: string;
    name: string;
    enabled: boolean;
    private disposable;
    private focusDelay;
    constructor(logger?: ILogger, ea?: IEventAggregator, platform?: IPlatform, element?: HTMLElement, options?: IRgaaConfiguration);
    attached(): void;
    detached(): void;
    dispose(): void;
    onFocus: (data: IHtmlFocus) => void;
    private removeFocus;
    private defineFocus;
}
//# sourceMappingURL=focus.d.ts.map