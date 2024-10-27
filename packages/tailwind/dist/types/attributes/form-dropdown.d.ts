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
    private panel;
    private optionTemplate;
    private generatedId;
    private disposable;
    private isMultiple;
    constructor(logger?: ILogger, platform?: IPlatform, element?: HTMLElement, ea?: IEventAggregator, ariaService?: IAriaService);
    attaching(): void;
    attached(): void;
    detaching(): void;
    private initList;
    private updateList;
    private onTrapFocusKeydown;
    private onKeyPress;
    private onFocusOut;
    private onFocusOutDropdown;
    private onToggleList;
    private onSelectChange;
    private onInputChange;
    private onSelectElement;
    private fillInput;
}
//# sourceMappingURL=form-dropdown.d.ts.map