import {bindable, customAttribute, IDisposable, IEventAggregator, ILogger, INode, IPlatform, resolve} from "aurelia";
import {HtmlActions} from "../enums/html-enums";
import {IRgaaConfiguration} from "../configure";
import {TrapFocusChannels} from "../enums/html-trap-focus-enums";
import {IHtmlTrapFocus, IHtmlTrapFocusEnded, IHtmlTrapFocusKeydown} from "../interfaces/html-trap-focus-interfaces";

@customAttribute('bc-trap-focus')
export class TrapFocus
{
    public static attributeGroup: string = 'trap-focus-group';
    public static attribute = 'trap-focus';
    @bindable( {primary: true} ) name: string;
    @bindable() enabled: boolean = false;
    private disposable:IDisposable;
    private focusableElements: HTMLElement[] = [];
    private currentFocusedIndex: number = 0;
    private currentGroups: string[] = [];
    private availableGroups: string[] = [];
    private keysMonitored: string[] = [];
    private focusableElementsQuerySelector: string = '';
    private lastFocusedElement: HTMLElement|null = null;
    private keepFocus: boolean = false;
    private focusDelay:number;

    public constructor(
        private readonly options: IRgaaConfiguration = resolve(IRgaaConfiguration),
        private readonly logger: ILogger = resolve(ILogger).scopeTo('TrapFocus'),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly platform:IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
        )
    {
        this.logger.trace('constructor')
        this.keysMonitored = this.options.get('keysMonitored');
        this.focusDelay = this.options.get('focusDelay');;
        this.focusableElementsQuerySelector = this.options.get('focusableElementsQuerySelector');
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(TrapFocusChannels.main, this.onTrapFocus);
        this.initAvailableGroups();
        this.element.addEventListener('keydown', this.onKeyDown);
        this.element.addEventListener('focusin', this.onFocusIn);
    }

    public detached()
    {
        this.logger.trace('detached');
        this.element.removeEventListener('keydown', this.onKeyDown);
        this.element.removeEventListener('focusin', this.onFocusIn);
        this.removeTrapFocus();
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }

    private onFocusIn = (event: FocusEvent) => {
        if (this.enabled) {
            // find the index of the focused element in the focusable elements list
            const focusedElement = event.target as HTMLElement;
            this.lastFocusedElement = focusedElement;
            const focusedIndex = this.focusableElements.indexOf(focusedElement);
            if (focusedElement && focusedIndex !== -1) {
                // element is in the focusable elements list
                if (focusedIndex !== this.currentFocusedIndex) {
                    this.currentFocusedIndex = focusedIndex;
                }
            }
        }
    }

    private onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
            if (this.enabled) {
                this.logger.trace('onKeyDown: handle Tab key');
                event.preventDefault();
                if (event.shiftKey) {
                    this.currentFocusedIndex--;
                    if (this.currentFocusedIndex < 0) {
                        this.currentFocusedIndex = this.focusableElements.length - 1;
                    }
                } else {
                    this.currentFocusedIndex++;
                    if (this.currentFocusedIndex >= this.focusableElements.length) {
                        this.currentFocusedIndex = 0;
                    }
                }
                this.focusElementByIndex(this.currentFocusedIndex);
            }
        } else if (this.keysMonitored.includes(event.key)) {
            event.preventDefault();
            const message: IHtmlTrapFocusKeydown = {
                name: this.name,
                code: event.code,
                shiftKey: event.shiftKey,
                group: this.getGroups()
            };
            this.ea.publish(TrapFocusChannels.keydown, message);
        }
    }
    public onTrapFocus = (data:IHtmlTrapFocus) => {
        if (data.name === this.name) {
            const message: IHtmlTrapFocusEnded = {
                name: this.name,
                action: data.action,
            }
            if (this.handleGroups()) {
                if(typeof data.groups === 'string') {
                    this.setGroups(data.groups);
                } else if( data.groups === false) {
                    this.resetGroups();
                }
                message.groups = this.getGroups();
                if (data.keepFocus && data.keepFocus === true) {
                    // get first goup of the list
                    this.keepFocus = true;
                }
            }

            if (data.action === HtmlActions.define) {
                message.action = this.defineTrapFocus();
            } else if (data.action === HtmlActions.remove) {
                message.action = this.removeTrapFocus();
            } else {
                throw new Error('TrapFocus: action not supported');
            }

            this.ea.publish(TrapFocusChannels.ended, message);
        }
    }

    private defineTrapFocus = () => {
        this.initFocusableElementsList();
        // focusable elements list is ready
        if (this.handleGroups()) {
            if (this.keepFocus) {
                if(this.lastFocusedElement) {
                    const previousFocusedElementIndex = this.getFocusableElementIndex(this.lastFocusedElement);
                    if (previousFocusedElementIndex !== -1) {
                        this.currentFocusedIndex = previousFocusedElementIndex;
                    }
                }
                this.keepFocus = false;
            }
        }
        this.focusElementByIndex(this.currentFocusedIndex);
        return this.enabled ? HtmlActions.define : HtmlActions.remove;
    }

    private removeTrapFocus = () => {
        this.enabled = false;
        this.focusableElements = [];
        this.currentFocusedIndex = 0;
        this.resetGroups();
        return HtmlActions.remove;
    }

    private initFocusableElementsList() {
        this.logger.trace('initFocusableElementsList');
        this.focusableElements = [];
        this.currentFocusedIndex = 0;
        const focusableElements = this.element.querySelectorAll(this.focusableElementsQuerySelector);
        focusableElements.forEach((element: HTMLElement) => {
            const isDisabled = element.hasAttribute('disabled');
            const isAriaHidden = (element.getAttribute('aria-hidden') === 'true');

            let isInGroups = true;
            if (this.handleGroups()) {
                const elementGroups = element.getAttribute(TrapFocus.attributeGroup);
                isInGroups = false;
                if (elementGroups) {
                    if (this.hasGroups(elementGroups)) {
                        isInGroups = true;
                    }
                }
            }
            if (isDisabled === false && isAriaHidden === false && isInGroups === true) {
                this.focusableElements.push(element);
            }
        });
    }

    private focusElementByIndex(elementIndex: number) {
        if (elementIndex >= 0 && elementIndex < this.focusableElements.length) {
            this.enabled = true;
            this.platform.taskQueue.queueTask(() => {
                this.platform.requestAnimationFrame(() => {
                    this.logger.trace('focusElementByIndex', elementIndex);
                    this.focusableElements[elementIndex].focus();
                });
            }, {delay: this.focusDelay});
        }
    }
    private getFocusableElementIndex(element: HTMLElement): number {
        return this.focusableElements.indexOf(element);
    }
    private extractGroups(groups: string): string[] {
        return groups.split(/\s+/);
    }
    private getGroups(): string|false {
        if (this.currentGroups.length === 0) {
            return false;
        } else {
            return this.currentGroups.join(' ');
        }
    }
    private setGroups(groupsString: string) {
        if (this.handleGroups()) {
            this.logger.trace('setGroups', groupsString);
            this.currentGroups = [];
            const groups = this.extractGroups(groupsString);
            groups.forEach((group) => {
                if (this.currentGroups.includes(group) === false) {
                    this.currentGroups.push(group);
                }
            });
        }
    }
    private hasGroups(groupsString: string): boolean {
        if (this.handleGroups()) {
            if(this.currentGroups.length === 0) {
                return true;
            }
            const groups = this.extractGroups(groupsString);
            let hasGroups = false;
            groups.forEach((group) => {
                if (this.currentGroups.includes(group) === true) {
                    hasGroups = true;
                }
            });
            return hasGroups;
        }
        return false;
    }
    private resetGroups() {
        if (this.handleGroups()) {
            this.currentGroups = [];
        }
    }
    private initAvailableGroups() {
        const focusableElements = this.element.querySelectorAll(this.focusableElementsQuerySelector);
        focusableElements.forEach((element: HTMLElement) => {
            const groupsString = element.getAttribute(TrapFocus.attributeGroup);
            if (groupsString) {
                const groups = this.extractGroups(groupsString);
                groups.forEach((group) => {
                    if (this.availableGroups.includes(group) === false) {
                        this.availableGroups.push(group);
                    }
                });
            }
        });
        this.logger.trace('initAvailableGroups', this.availableGroups.join(' '));
    }
    private handleGroups() :boolean {
        return this.availableGroups.length > 0;
    }
}