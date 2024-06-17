import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { ModalModes, ModalRoles } from "../enums/aria-modal-enums";
import { IAriaModal } from "../interfaces/aria-modal-interfaces";
export declare class AriaModal {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    static attribute: string;
    static roleAttribute: string;
    static tabindexAttribute: string;
    name: string;
    enabled: boolean;
    tabindexEnabled: boolean;
    mode: ModalModes;
    role: ModalRoles;
    private defaultTabindex;
    private disposable;
    constructor(logger: ILogger, ea: IEventAggregator, platform: IPlatform, element: HTMLElement);
    attached(): void;
    dispose(): void;
    onAriaModal: (data: IAriaModal) => void;
    private removeModal;
    private defineModal;
}
//# sourceMappingURL=aria-modal.d.ts.map