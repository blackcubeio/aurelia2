import { ILogger, ICustomAttributeViewModel, IPlatform } from 'aurelia';
import { ITransitionService } from '@blackcube/aurelia2-transition';
export declare class MenuMobile implements ICustomAttributeViewModel {
    private readonly logger;
    private readonly transitionService;
    private readonly platform;
    private readonly element;
    private openButton;
    private closeButtonTransition;
    private closeButton;
    private closeButtonPanel;
    private overlayTransition;
    private overlayPanel;
    private offcanvasTransition;
    private offcanvasPanel;
    private isClosed;
    constructor(logger?: ILogger, transitionService?: ITransitionService, platform?: IPlatform, element?: HTMLElement);
    attaching(): Promise<void>;
    attached(): void;
    detaching(): void;
    private onOpenMobileMenu;
    private onCloseMobileMenu;
}
//# sourceMappingURL=menu-mobile.d.ts.map