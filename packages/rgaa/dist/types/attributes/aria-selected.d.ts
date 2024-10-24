import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { IAriaSelected } from "../interfaces/aria-selected-interfaces";
import { SelectedModes } from "../enums/aria-selected-enums";
export declare class AriaSelected {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    static attribute: string;
    name: string;
    enabled: boolean;
    mode: SelectedModes;
    private disposable;
    constructor(logger?: ILogger, ea?: IEventAggregator, platform?: IPlatform, element?: HTMLElement);
    attached(): void;
    dispose(): void;
    onAriaSelected: (data: IAriaSelected) => void;
    private removeSelected;
    private defineSelected;
}
//# sourceMappingURL=aria-selected.d.ts.map