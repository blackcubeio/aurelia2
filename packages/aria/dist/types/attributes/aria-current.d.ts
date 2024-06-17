import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { IAriaCurrent } from "../interfaces/aria-current-interfaces";
import { CurrentModes } from "../enums/aria-current-enums";
export declare class AriaCurrent {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    static attribute: string;
    name: string;
    enabled: boolean;
    mode: CurrentModes;
    private disposable;
    constructor(logger: ILogger, ea: IEventAggregator, platform: IPlatform, element: HTMLElement);
    attached(): void;
    dispose(): void;
    onAriaCurrent: (data: IAriaCurrent) => void;
    private removeCurrent;
    private defineCurrent;
}
//# sourceMappingURL=aria-current.d.ts.map