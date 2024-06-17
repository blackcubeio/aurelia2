import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { IHtmlTabindex } from "../interfaces/html-tabindex-interfaces";
export declare class Tabindex {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    static attribute: string;
    static disabledAttribute: string;
    name: string;
    enabled: boolean;
    enabledDisabled: boolean;
    value: string;
    private disposable;
    private previousValue;
    constructor(logger: ILogger, ea: IEventAggregator, platform: IPlatform, element: HTMLElement);
    attached(): void;
    dispose(): void;
    onTabindex: (data: IHtmlTabindex) => void;
    private rotateTabindex;
    private removeTabindex;
    private defineTabindex;
}
//# sourceMappingURL=tabindex.d.ts.map