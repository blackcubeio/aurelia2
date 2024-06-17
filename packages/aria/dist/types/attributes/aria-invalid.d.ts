import { IEventAggregator, IPlatform, ILogger } from "aurelia";
import { ValidationResult } from "@aurelia/validation";
import { InvalidModes } from "../enums/aria-invalid-enums";
import { IAriaInvalid } from "../interfaces/aria-invalid-interfaces";
export declare class AriaInvalid {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    static attribute: string;
    static describedByAttribute: string;
    static labelledByAttribute: string;
    name: string;
    enabled: boolean;
    mode: InvalidModes;
    describedByEnabled: boolean;
    describedById: string;
    labelledByEnabled: boolean;
    labelledById: string;
    private form;
    private disposable;
    constructor(logger: ILogger, ea: IEventAggregator, platform: IPlatform, element: HTMLElement);
    static convertErrors(resuts: ValidationResult[], form?: HTMLFormElement | null): IAriaInvalid[];
    attached(): void;
    dispose(): void;
    onAriaInvalid: (data: IAriaInvalid | IAriaInvalid[]) => void;
    private removeInvalid;
    private defineInvalid;
}
//# sourceMappingURL=aria-invalid.d.ts.map