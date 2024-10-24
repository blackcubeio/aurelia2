import { IEventAggregator, ILogger, ICustomAttributeViewModel, IPlatform } from 'aurelia';
import { IAriaService } from '@blackcube/aurelia2-aria';
export declare class FormDropdown implements ICustomAttributeViewModel {
    private readonly logger;
    private readonly platform;
    private readonly element;
    private readonly ea;
    private ariaService;
    private button;
    private label;
    private input;
    private select;
    private list;
    private optionTemplate;
    private generatedId;
    private disposable;
    constructor(logger?: ILogger, platform?: IPlatform, element?: HTMLElement, ea?: IEventAggregator, ariaService?: IAriaService);
    attaching(): void;
    private initList;
    private updateList;
    attached(): void;
    detaching(): void;
    private onTrapFocusKeydown;
    private onKeyPress;
    private onFocusOut;
    private onToggleList;
    private onSelectChange;
    private onInputChange;
    private onSelectElement;
}
//# sourceMappingURL=form-dropdown.d.ts.map