import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { IHtmlFocus } from "../interfaces/html-focus-interfaces";
import { IAriaConfiguration } from "../configure";
export declare class Focus {
    private readonly logger;
    private readonly options;
    private readonly ea;
    private readonly platform;
    private readonly element;
    static attribute: string;
    name: string;
    enabled: boolean;
    private disposable;
    private focusDelay;
    constructor(logger?: ILogger, options?: IAriaConfiguration, ea?: IEventAggregator, platform?: IPlatform, element?: HTMLElement);
    attached(): void;
    detached(): void;
    dispose(): void;
    onFocus: (data: IHtmlFocus) => void;
    private removeFocus;
    private defineFocus;
}
//# sourceMappingURL=focus.d.ts.map