import {
    customAttribute,
    ILogger,
    ICustomAttributeViewModel,
    IPlatform,
    INode,
    resolve
} from 'aurelia';
import {ITransitionService, ITransition} from '@blackcube/aurelia2-transition';

@customAttribute('bc-tw-menu-mobile')
export class MenuMobile implements ICustomAttributeViewModel
{
    private openButton: HTMLButtonElement;
    // element searched using [data-menu-mobile="close"]
    // default transition for the menu, can be overriden by data-transition-* attributes
    private closeButtonTransition: ITransition = {
        from: 'opacity-0',
        to: 'opacity-100',
        transition: 'transition-opacity ease-in-out duration-300',
        show: 'inherit',
        hide: 'none'
    };
    private closeButton: HTMLButtonElement;
    private closeButtonPanel: HTMLDivElement;
    // element searched using [data-menu-mobile="overlay"]
    // default transition for the menu, can be overriden by data-transition-* attributes
    private overlayTransition: ITransition = {
        from: 'opacity-0',
        to: 'opacity-100',
        transition: 'transition-opacity ease-linear duration-300',
        show: 'inherit',
        hide: 'none'
    };
    private overlayPanel: HTMLDivElement;
    // element searched using [data-menu-mobile="offcanvas"]
    // default transition for the menu, can be overriden by data-transition-* attributes
    private offcanvasTransition: ITransition = {
        from: '-translate-x-full',
        to: 'translate-x-0',
        transition: 'transition ease-in-out duration-300 transform',
        show: 'inherit',
        hide: 'none'
    };
    private offcanvasPanel: HTMLDivElement;

    private isClosed = true;
    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('MenuMobile'),
        private readonly transitionService: ITransitionService = resolve(ITransitionService),
        private readonly platform: IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
    )
    {
    }
    public attaching()
    {
        this.logger.trace('Attaching');
        this.openButton = this.platform.document.querySelector('[data-menu-mobile="open"]') as HTMLButtonElement;
        this.closeButton = this.element.querySelector('[data-menu-mobile="close"]') as HTMLButtonElement;
        this.closeButtonPanel = this.closeButton.parentElement as HTMLDivElement;
        this.overlayPanel = this.element.querySelector('[data-menu-mobile="overlay"]') as HTMLDivElement;
        this.offcanvasPanel = this.element.querySelector('[data-menu-mobile="offcanvas"]') as HTMLDivElement;
        if (!this.openButton || !this.closeButton || !this.closeButtonPanel || !this.overlayPanel || !this.offcanvasPanel) {
            throw new Error('Missing required elements');
        }
        const promises = [];
        promises.push(this.transitionService.leave(this.closeButtonPanel, this.closeButtonTransition, undefined, true));
        promises.push(this.transitionService.leave(this.overlayPanel, this.overlayTransition, undefined, true));
        promises.push(this.transitionService.leave(this.offcanvasPanel, this.offcanvasTransition, undefined, true));
        return Promise.all(promises).then(() => {
            this.isClosed = true;
            this.element.style.display = 'none';
            return Promise.resolve();
        });
    }

    public attached()
    {
        this.logger.trace('Attached');
        this.openButton.addEventListener('click', this.onOpenMobileMenu);
        this.closeButton.addEventListener('click', this.onCloseMobileMenu);
    }

    public detaching()
    {
        this.logger.trace('Detached');
        this.openButton.removeEventListener('click', this.onOpenMobileMenu);
        this.closeButton.removeEventListener('click', this.onCloseMobileMenu);
    }

    private onOpenMobileMenu = (evt: Event) => {
        evt.preventDefault();
        this.logger.trace('Open mobile menu');

        this.element.style.display = 'inherit';
        const promises = [];
        promises.push(this.transitionService.enter(this.closeButtonPanel, this.closeButtonTransition));
        promises.push(this.transitionService.enter(this.overlayPanel, this.overlayTransition));
        promises.push(this.transitionService.enter(this.offcanvasPanel, this.offcanvasTransition));
        Promise.all(promises).then(() => {
            this.isClosed = false;
            this.element.style.display = 'inherit';
            return Promise.resolve();
        });
    }

    private onCloseMobileMenu = (evt: Event) => {
        evt.preventDefault();
        this.logger.trace('Close mobile menu');
        const promises = [];
        promises.push(this.transitionService.leave(this.closeButtonPanel, this.closeButtonTransition));
        promises.push(this.transitionService.leave(this.overlayPanel, this.overlayTransition));
        promises.push(this.transitionService.leave(this.offcanvasPanel, this.offcanvasTransition));
        Promise.all(promises).then(() => {this.isClosed = true;
            this.element.style.display = 'none';
            this.isClosed = true;
            return Promise.resolve();
        });
    };

}