import { ILogger, ICustomAttributeViewModel, IPlatform } from 'aurelia';
import { ITransitionService } from '@blackcube/aurelia2-transition';
import { ISidebarService } from '../services/sidebar-service';
import { IAriaService } from '@blackcube/aurelia2-aria';
export declare class MenuSidebar implements ICustomAttributeViewModel {
    private readonly logger;
    private readonly transitionService;
    private readonly sidebarService;
    private readonly ariaService;
    private readonly platform;
    private readonly element;
    private buttons;
    private arrowTransition;
    constructor(logger?: ILogger, transitionService?: ITransitionService, sidebarService?: ISidebarService, ariaService?: IAriaService, platform?: IPlatform, element?: HTMLElement);
    attaching(): void;
    attached(): void;
    detaching(): void;
    private initSidebar;
    private onClick;
}
//# sourceMappingURL=menu-sidebar.d.ts.map