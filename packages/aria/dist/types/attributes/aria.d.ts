import { ILogger, ICustomAttributeViewModel, IEventAggregator } from 'aurelia';
import { IAriaService } from '../services/aria-service';
export declare class Aria implements ICustomAttributeViewModel {
    private readonly logger;
    private readonly ariaService;
    private readonly ea;
    private readonly element;
    name: string;
    private disposableSet;
    private disposableUnset;
    constructor(logger?: ILogger, ariaService?: IAriaService, ea?: IEventAggregator, element?: HTMLElement);
    attaching(): void;
    attached(): void;
    detaching(): void;
    private onSetAria;
    private onRevertAria;
}
//# sourceMappingURL=aria.d.ts.map