import { IPlatform, ILogger, ICustomAttributeViewModel, IEventAggregator } from 'aurelia';
import { ITransitionService } from '@blackcube/aurelia2-transition';
import { IAriaService } from '@blackcube/aurelia2-aria';
export declare class DropdownMenu implements ICustomAttributeViewModel {
    private readonly logger;
    private readonly platform;
    private readonly transitionService;
    private readonly ariaService;
    private readonly ea;
    private readonly element;
    private button;
    private menu;
    private isClosed;
    private disposable;
    private menuTransition;
    constructor(logger?: ILogger, platform?: IPlatform, transitionService?: ITransitionService, ariaService?: IAriaService, ea?: IEventAggregator, element?: HTMLElement);
    attaching(): void;
    attached(): void;
    detaching(): void;
    private onTrapFocus;
    private onToggle;
    private onFocusOut;
}
//# sourceMappingURL=dropdown-menu.d.ts.map