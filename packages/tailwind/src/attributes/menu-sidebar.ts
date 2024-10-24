import {
    customAttribute,
    ILogger,
    ICustomAttributeViewModel,
    IPlatform,
    INode,
    resolve
} from 'aurelia';
import {ITransitionService, ITransition} from '@blackcube/aurelia2-transition';
import {ISidebarService} from '../services/sidebar-service';
import {IAriaService} from '@blackcube/aurelia2-aria';

@customAttribute('bc-tw-menu-sidebar')
export class MenuSidebar implements ICustomAttributeViewModel
{
    private buttons: NodeListOf<HTMLButtonElement>;
    private svgTransition: ITransition = {
        from: 'text-gray-400',
        to: 'text-gray-500 rotate-90',
        transition: 'transition-transform ease-in-out duration-150',
    }
    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('MenuSidebar'),
        private readonly transitionService: ITransitionService = resolve(ITransitionService),
        private readonly sidebarService: ISidebarService = resolve(ISidebarService),
        private readonly ariaService: IAriaService = resolve(IAriaService),
        private readonly platform: IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
    )
    {
    }
    public attaching()
    {
        this.logger.trace('Attaching');
        this.buttons = this.element.querySelectorAll('button[type="button"]');
        this.initSidebar();
    }

    public attached()
    {
        this.logger.trace('Attached');
        this.buttons.forEach((button) => button.addEventListener('click', this.onClick));
    }

    public detaching()
    {
        this.logger.trace('Detached');
        this.buttons.forEach((button) => button.removeEventListener('click', this.onClick));
    }

    private initSidebar()
    {
        this.buttons.forEach((button) => {
            const menuName = button.dataset.menuSidebar as string;
            if (menuName.length > 0) {
                const svg = button.querySelector('svg[data-menu-sidebar="arrow"]') as SVGElement;
                const submenu = button.nextElementSibling as HTMLElement;
                const state = this.sidebarService.getStatus(menuName);
                if (state) {
                    this.transitionService.enter(svg, this.svgTransition, true);
                    this.ariaService.setExpanded(button, 'true');
                    this.ariaService.setHidden(submenu, 'false');
                    submenu.classList.remove('hidden');
                } else {
                    this.transitionService.leave(svg, this.svgTransition, undefined, true);
                    this.ariaService.setExpanded(button, 'false');
                    this.ariaService.setHidden(submenu, 'true');
                    submenu.classList.add('hidden');
                }
            }
        });
    }
    private onClick = (evt: Event)=> {
        this.logger.trace('Click');
        evt.stopPropagation();
        const button = evt.target as HTMLButtonElement;
        const menuName = button.dataset.menuSidebar as string;
        const svg = button.querySelector('svg[data-menu-sidebar="arrow"]') as SVGElement;
        const submenu = button.nextElementSibling as HTMLElement;
        if (submenu.classList.contains('hidden')) {
            this.transitionService.enter(svg, this.svgTransition);
            submenu.classList.remove('hidden');
            this.ariaService.setExpanded(button, 'true');
            this.ariaService.setHidden(submenu, 'false');
            submenu.classList.remove('hidden');
            if (menuName.length > 0) {
                this.sidebarService.setStatus(menuName, true);
            }
        } else {
            this.transitionService.leave(svg, this.svgTransition);
            submenu.classList.add('hidden');
            this.ariaService.setExpanded(button, 'false');
            this.ariaService.setHidden(submenu, 'true');
            submenu.classList.add('hidden');
            if (menuName.length > 0) {
                this.sidebarService.setStatus(menuName, false);
            }
        }
    }

}