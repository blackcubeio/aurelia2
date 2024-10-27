import {
    IPlatform,
    ILogger,
    INode,
    resolve, customAttribute, ICustomAttributeViewModel, IDisposable, IEventAggregator
} from 'aurelia';
import {ITransition, ITransitionService} from '@blackcube/aurelia2-transition';
import {AriaService, IAriaService, IAriaTrapFocus} from '@blackcube/aurelia2-aria';

@customAttribute('bc-tw-dropdown-menu')
export class DropdownMenu implements ICustomAttributeViewModel
{
    private button: HTMLButtonElement;
    private menu: HTMLElement;
    private isClosed = true;
    private disposable: IDisposable;
    // default transition for the menu, can be overriden by data-transition-* attributes
    private menuTransition: ITransition = {
        from: 'transform opacity-0 scale-95',
        to: 'transform opacity-100 scale-100',
        transition: 'ease-out duration-100',
        transitionLeaving: 'ease-in duration-75',
        show: 'inherit',
        hide: 'none'
    };

    constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('DropdownMenu'),
        private readonly platform: IPlatform = resolve(IPlatform),
        private readonly transitionService: ITransitionService = resolve(ITransitionService),
        private readonly ariaService: IAriaService = resolve(IAriaService),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
    ) {
        this.logger.debug('constructor');
    }

    public attaching()
    {
        this.logger.trace('Attaching');
        this.button = this.element.querySelector('[data-dropdown-menu="button"]') as HTMLButtonElement;
        this.menu = this.element.querySelector('[data-dropdown-menu="menu"]') as HTMLElement;
        if (!this.button || !this.menu) {
            throw new Error('Missing required elements');
        }
        this.transitionService.leave(this.menu, this.menuTransition, undefined, true)
            .then(() => {
                this.isClosed = true;
                this.ariaService.setExpanded(this.button, 'false');
                this.ariaService.setHidden(this.menu, 'true');
                this.ariaService.untrapFocus();
            });
        this.disposable = this.ea.subscribe(AriaService.trapFocusChannel, this.onTrapFocus);
    }
    public attached()
    {
        this.logger.trace('Attached');
        this.button.addEventListener('click', this.onToggle);
    }

    public detaching()
    {
        this.logger.trace('Detaching');
        this.button.removeEventListener('click', this.onToggle);
    }

    public dispose() {
        this.logger.trace('Dispose');
        this.disposable?.dispose();
    }

    private onTrapFocus = (evt: IAriaTrapFocus) =>
    {
        this.logger.debug('onTrapFocus', evt);
        if (evt.trapElement === this.menu && this.isClosed === false) {
            this.transitionService.leave(this.menu, this.menuTransition)
                .then(() => {
                    this.isClosed = true;
                    this.ariaService.setExpanded(this.button, 'false');
                    this.ariaService.setHidden(this.menu, 'true');
                    this.platform.requestAnimationFrame(() => evt.rollbackFocusElement?.focus());
                });
        }
    }

    private onToggle = (evt: Event)=>
    {
        this.logger.debug('onToggle', evt);
        evt.preventDefault();
        if (this.isClosed) {
            this.transitionService.enter(this.menu, this.menuTransition)
                .then(() => {
                    this.isClosed = false;
                    this.ariaService.setExpanded(this.button, 'true');
                    this.ariaService.setHidden(this.menu, 'false');
                    this.ariaService.trapFocus(this.menu, this.button);
                    this.menu.addEventListener('focusout', this.onFocusOut);
                });
        } else {
           // this.transitionService.leave(this.menu, this.menuTransition)
           //     .then(() => {
           //         this.isClosed = true;
           //         this.ariaService.setExpanded(this.button, 'false');
           //         this.ariaService.setHidden(this.menu, 'true');
           //         this.logger.debug('untrapFocus onToggle');
           //         this.menu.removeEventListener('focusout', this.onFocusOut);
           //         this.ariaService.untrapFocus();
           //     });
        }
    };

    private onFocusOut = (evt: FocusEvent)=> {
        if (evt.relatedTarget === null || !this.menu.contains(evt.relatedTarget as Node)) {
            this.menu.removeEventListener('focusout', this.onFocusOut);
            this.transitionService.leave(this.menu, this.menuTransition)
                .then(() => {
                    this.isClosed = true;
                    this.ariaService.setExpanded(this.button, 'false');
                    this.ariaService.setHidden(this.menu, 'true');
                    this.logger.debug('untrapFocus onFocusOut');
                    this.ariaService.untrapFocus();
                });
        }
    }

}