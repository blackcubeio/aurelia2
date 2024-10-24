import {
    DI,
    IEventAggregator,
    ILogger,
    INode,
    IPlatform,
    resolve
} from "aurelia";
import {IAriaSet, IAriaRevert, IAriaTrapFocus} from '../interfaces/aria';

export const IAriaService =
    DI.createInterface<IAriaService>('IAriaService', (x) =>
        x.singleton(AriaService)
    );
export interface IAriaService extends AriaService {}

export class AriaService
{
    public static trapFocusChannel: string = 'ARIA_TRAP_FOCUS';
    public static ariaSetAttributeChannel: string = 'ARIA_SET_ATTRIBUTE';
    public static ariaRevertAttributeChannel: string = 'ARIA_REVERT_ATTRIBUTE';
    private currentFocusedIndex: number = 0;
    private keysMonitored: string[] = [
        'Escape',
    ];
    private focusableElementsQuerySelector: string = '[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [accesskey], summary, canvas, audio, video, details, iframe, [contenteditable]';
    private lastFocusedElement: HTMLElement|null = null;
    private keepFocus: boolean = false;
    private focusDelay:number = 10;
    private currentFocusedIndew: Map<HTMLElement, number> = new Map();
    private focusableElements: HTMLElement[] = [];
    private focusableElementsConfig: Map<HTMLElement, any>;
    private trapElement: HTMLElement|undefined;
    private rollbackFocusElement: HTMLElement|undefined;

    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('AriaService'),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly platform:IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
    )
    {
        this.logger.trace('constructor')
    }

    /**
     * trapFocus keep the focus inside the trapElement
     * @param trapElement the element where to trap the focus
     * @param rollbackFocusElement the element to focus back when the trap is removed
     */
    public trapFocus(trapElement: HTMLElement, rollbackFocusElement: HTMLElement = undefined) {
        this.logger.trace('trapFocus');
        if (this.trapElement) {
            this.logger.warn('trap: already set');
            this.untrapFocus();
        }
        this.trapElement = trapElement;
        this.focusableElements = [];
        this.focusableElementsConfig = new Map();
        this.currentFocusedIndex = 0;
        this.rollbackFocusElement = rollbackFocusElement;
        this.trapElement.querySelectorAll(this.focusableElementsQuerySelector)
            .forEach((focusableElement: HTMLElement) => {
                const isDisabled = focusableElement.hasAttribute('disabled');
                const isAriaHidden = (focusableElement.getAttribute('aria-hidden') === 'true');
                if (isDisabled === false && isAriaHidden === false) {
                    this.focusableElementsConfig.set(focusableElement, {
                        tabIndex: focusableElement.tabIndex,
                        // ariaHidden: focusableElement.getAttribute('aria-hidden'),
                        // disabled: focusableElement.getAttribute('disabled'),
                    });
                    this.setTabindex(focusableElement);
                    // focusableElement.removeAttribute('tabindex');
                    this.focusableElements.push(focusableElement);
                }
            });
        this.focusElementByIndex(this.currentFocusedIndex);
        this.trapElement.addEventListener('keydown', this.onKeyDown);
        this.trapElement.addEventListener('focusin', this.onFocusIn);
        return Promise.resolve(this.trapElement);
    }

    /**
     * untrapFocus remove the focus trap
     *
     */
    public untrapFocus() {
        this.logger.trace('untrapFocus');
        if (this.trapElement) {
            this.focusableElements.forEach((focusableElement: HTMLElement) => {
                this.revertTabindex(focusableElement);
            });
            this.trapElement.removeEventListener('keydown', this.onKeyDown);
            this.trapElement.removeEventListener('focusin', this.onFocusIn);
            const trappedElement = this.trapElement;
            const rollbackFocusElement = this.rollbackFocusElement;
            this.trapElement = undefined;
            this.rollbackFocusElement = undefined;
            this.focusableElements = [];
            this.focusableElementsConfig = new Map();
            this.currentFocusedIndex = 0;
            return new Promise((resolve) => {
                this.platform.requestAnimationFrame(() => {
                    if (rollbackFocusElement) {
                        rollbackFocusElement.focus();
                    }
                    resolve([trappedElement,rollbackFocusElement]);
                });
            });
        }
    }

    private onFocusIn = (event: FocusEvent) => {
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

    private checkElementAvailable(element: HTMLElement) {
        if (element.getAttribute('aria-hidden') !== 'true'
            && element.getAttribute('tabindex') !== '-1'
            && element.getAttribute('aria-disabled') !== 'true'
            && element.getAttribute('aria-hidden') !== 'true'
            && element.getAttribute('disabled') !== 'true'
            && element.checkVisibility() !== false) {
            return true;
        }
        return false;
    }

    private onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
                this.logger.trace('onKeyDown: handle Tab key');
                event.preventDefault();
                if (event.shiftKey) {
                    let currentFocusedIndex = this.currentFocusedIndex;
                    let selectedElement = this.focusableElements[currentFocusedIndex];
                    do {
                        this.currentFocusedIndex--;
                        if (this.currentFocusedIndex < 0) {
                            this.currentFocusedIndex = this.focusableElements.length - 1;
                        }
                        selectedElement = this.focusableElements[this.currentFocusedIndex];
                        if (this.checkElementAvailable(selectedElement)) {
                            currentFocusedIndex = this.currentFocusedIndex;
                            break;
                        }

                    } while (currentFocusedIndex !== this.currentFocusedIndex);

                } else {
                    let currentFocusedIndex = this.currentFocusedIndex;
                    let selectedElement = this.focusableElements[currentFocusedIndex];
                    do {
                        this.currentFocusedIndex++;
                        if (this.currentFocusedIndex >= this.focusableElements.length) {
                            this.currentFocusedIndex = 0;
                        }
                        selectedElement = this.focusableElements[this.currentFocusedIndex];
                        if (this.checkElementAvailable(selectedElement)) {
                            currentFocusedIndex = this.currentFocusedIndex;
                            break;
                        }
                    } while (currentFocusedIndex !== this.currentFocusedIndex);
                }
                this.focusElementByIndex(this.currentFocusedIndex);
        } else if (this.keysMonitored.includes(event.key)) {
            this.logger.trace('onKeyDown: handle Escape key');
            event.preventDefault();
            this.untrapFocus()
                .then((data: HTMLElement[])=> {
                    const trapElement: HTMLElement = data[0];
                    const rollbackFocusElement: HTMLElement = data[1];
                    // send message to let dev focus elsewhere if needed
                    const message: IAriaTrapFocus = {
                        escape: true,
                        trapElement,
                        rollbackFocusElement,
                    };
                    this.ea.publish(AriaService.trapFocusChannel, message);
                });

        }
    }

    private focusElementByIndex(elementIndex: number) {
        if (elementIndex >= 0 && elementIndex < this.focusableElements.length) {
                this.platform.requestAnimationFrame(() => {
                    this.focusableElements[elementIndex].focus();
                });
        }
    }

    private elementsInitialConfig: Map<HTMLElement, any> = new Map();

    /**
     * @param element HTMLElement where to set aria-checked if it's a string send an event to let element change it's own aria-checked
     * @param checked aria-checked value if undefined aria-checked will be removed
     * @param role role value if not set it will be untouched should be set to 'checkbox' or 'menuitemcheckbox' or 'menuitemradio' or 'radio'
     */
    public setChecked(element: HTMLElement|string, checked:'true'|'false'|'mixed' = undefined, role:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-checked',
                checked,
                role,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (checked !== undefined) {
                element.ariaChecked = checked;
                if (role) {
                    element.role = role;
                }
            } else {
                element.removeAttribute('aria-checked');
            }
        }

    }

    /**
     * @param element HTMLElement where to set aria-checked to original value if it's a string send an event to let element change it's own aria-checked
     */
    public revertChecked(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-checked',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaChecked = this.getConfig(element, 'aria-checked');
            if (ariaChecked) {
                element.ariaChecked = ariaChecked;
            } else {
                element.removeAttribute('aria-checked');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
        }
    }

    /**
     * @param element HTMLElement where to set aria-controls if it's a string send an event to let element change it's own aria-controls
     * @param controls aria-controls value
     * @param role
     */
    public setControls(element: HTMLElement|string, controls:string = undefined, role:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-controls',
                controls,
                role,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (controls) {
                element.setAttribute('aria-controls', controls);
                if (role) {
                    element.role = role;
                }
            } else {
                element.removeAttribute('aria-controls');
            }
        }
    }
    public revertControls(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-controls',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaControls = this.getConfig(element, 'aria-controls');
            if (ariaControls) {
                element.setAttribute('aria-controls', ariaControls);
            } else {
                element.removeAttribute('aria-controls');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
        }
    }

    public setCurrent(element: HTMLElement|string, current:'page'|'step'|'location'|'date'|'time'|'true'|'false' = undefined, role:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-current',
                current,
                role,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (current) {
                element.ariaCurrent = current;
                if (role) {
                    element.role = role;
                }
            } else {
                element.removeAttribute('aria-current');
            }
        }
    }
    public revertCurrent(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-current',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaCurrent = this.getConfig(element, 'aria-current');
            if (ariaCurrent) {
                element.ariaCurrent = ariaCurrent;
            } else {
                element.removeAttribute('aria-current');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
        }
    }

    public setDescribedBy(element: HTMLElement|string, describedby:string = undefined, role:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-describedby',
                describedby,
                role,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (describedby) {
                element.setAttribute('aria-describedby', describedby);
                if (role) {
                    element.role = role;
                }
            }
        }
    }
    public revertDescribedBy(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-describedby',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaDescribedBy = this.getConfig(element, 'aria-describedby');
            if (ariaDescribedBy) {
                element.setAttribute('aria-describedby', ariaDescribedBy);
            } else {
                element.removeAttribute('aria-describedby');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
        }
    }

    public setDescription(element: HTMLElement|string, description:string = undefined, role:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-description',
                description,
                role,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (description) {
                element.ariaDescription = description;
                if (role) {
                    element.role = role;
                }
            } else {
                element.removeAttribute('aria-description');
            }
        }
    }
    public revertDescription(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-description',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaDescription = this.getConfig(element, 'aria-description');
            if (ariaDescription) {
                element.ariaDescription = ariaDescription;
            } else {
                element.removeAttribute('aria-description');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
        }
    }

    public setDetails(element: HTMLElement|string, details:string = undefined, role:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-details',
                details,
                role,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (details) {
                element.setAttribute('aria-details', details);
                if (role) {
                    element.role = role;
                }
            } else {
                element.removeAttribute('aria-details');
            }
        }
    }
    public revertDetails(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-details',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaDetails = this.getConfig(element, 'aria-details');
            if (ariaDetails) {
                element.setAttribute('aria-details', ariaDetails);
            } else {
                element.removeAttribute('aria-details');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
        }
    }

    public setDisabled(element: HTMLElement|string, disabled:'true'|'false' = undefined, role:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-disabled',
                disabled,
                role,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (disabled) {
                element.ariaDisabled = disabled;
                if (role) {
                    element.role = role;
                }
            } else {
                element.removeAttribute('aria-disabled');
            }
        }
    }
    public revertDisabled(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-disabled',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaDisabled = this.getConfig(element, 'aria-disabled');
            if (ariaDisabled) {
                element.ariaDisabled = ariaDisabled;
            } else {
                element.removeAttribute('aria-disabled');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
        }
    }

    public setExpanded(element: HTMLElement|string, expanded:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-expanded',
                expanded,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (expanded) {
                element.ariaExpanded = expanded;
            } else {
                element.removeAttribute('aria-expanded');
            }
        }
    }
    public revertExpanded(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-expanded',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaExpanded = this.getConfig(element, 'aria-expanded');
            if (ariaExpanded) {
                element.ariaExpanded = ariaExpanded;
            } else {
                element.removeAttribute('aria-expanded');
            }
        }
    }

    public setLevel(element: HTMLElement|string, level:'1'|'2'|'3'|'4'|'5'|'6' = undefined) {

        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-level',
                level,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (level) {
                element.setAttribute('role', 'heading');
                element.setAttribute('aria-level', level);
            } else {
                element.removeAttribute('aria-level');
                element.removeAttribute('role');
            }
        }
    }
    public revertLevel(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-level',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaLevel = this.getConfig(element, 'aria-level');
            if (ariaLevel) {
                element.setAttribute('aria-level', ariaLevel);
            } else {
                element.removeAttribute('aria-level');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
        }
    }

    public setHasPopup(element: HTMLElement|string, haspopup:'true'|'menu'|'listbox'|'tree'|'grid'|'dialog'|'false' = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-haspopup',
                haspopup,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (haspopup) {
                element.ariaHasPopup = haspopup;
            } else {
                element.removeAttribute('aria-haspopup');
            }
        }
    }

    public revertHasPopup(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-haspopup',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaHasPopup = this.getConfig(element, 'aria-haspopup');
            if (ariaHasPopup) {
                element.ariaHasPopup = ariaHasPopup;
            } else {
                element.removeAttribute('aria-haspopup');
            }
        }
    }

    public setHidden(element: HTMLElement|string, hidden:'true'|'false' = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-hidden',
                hidden,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (hidden) {
                element.ariaHidden = hidden;
            } else {
                element.removeAttribute('aria-hidden');
            }
        }
    }
    public revertHidden(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-hidden',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaHidden = this.getConfig(element, 'aria-hidden');
            if (ariaHidden) {
                element.ariaHidden = ariaHidden;
            } else {
                element.removeAttribute('aria-hidden');
            }
        }
    }

    public setInvalid(element: HTMLElement|string, invalid:'grammar'|'spelling'|'true'|'false' = 'false', role:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-invalid',
                invalid,
                role,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (invalid) {
                element.ariaInvalid = invalid;
                if (role) {
                    element.role = role;
                }
            } else {
                element.removeAttribute('aria-invalid');
            }
        }
    }
    public revertInvalid(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-invalid',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaInvalid = this.getConfig(element, 'aria-invalid');
            if (ariaInvalid) {
                element.ariaInvalid = ariaInvalid;
            } else {
                element.removeAttribute('aria-invalid');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
        }
    }

    public setLabel(element: HTMLElement|string, label:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-label',
                label,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (label) {
                element.ariaLabel = label;
            } else {
                element.removeAttribute('aria-label');
            }
        }
    }
    public revertLabel(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-label',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaLabel = this.getConfig(element, 'aria-label');
            if (ariaLabel) {
                element.ariaLabel = ariaLabel;
            } else {
                element.removeAttribute('aria-label');
            }
        }
    }

    public setLabelledBy(element: HTMLElement|string, labelledby:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-labelledby',
                labelledby,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (labelledby) {
                element.setAttribute('aria-labelledby', labelledby);
            } else {
                element.removeAttribute('aria-labelledby');
            }
        }
    }
    public revertLabelledBy(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-labelledby',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaLabelledBy = this.getConfig(element, 'aria-labelledby');
            if (ariaLabelledBy) {
                element.setAttribute('aria-labelledby', ariaLabelledBy);
            } else {
                element.removeAttribute('aria-labelledby');
            }
        }
    }

    public setLive(element: HTMLElement|string, live:'assertive'|'polite'|'off' = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-live',
                live,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (live) {
                element.ariaLive = live;
            } else {
                element.removeAttribute('aria-live');
            }
        }
    }
    public revertLive(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-live',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaLive = this.getConfig(element, 'aria-live');
            if (ariaLive) {
                element.ariaLive = ariaLive;
            } else {
                element.removeAttribute('aria-live');
            }
        }
    }

    public setModal(element: HTMLElement|string, modal:'true'|'false' = undefined``, role = undefined, tabindex:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-modal',
                modal,
                role,
                tabindex,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (modal) {
                element.ariaModal = modal;
                if (role) {
                    element.role = role;
                }
                if (tabindex) {
                    element.tabIndex = parseInt(tabindex);
                }
            } else {
                element.removeAttribute('aria-modal');
            }
        }
    }
    public revertModal(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-modal',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaModal = this.getConfig(element, 'aria-modal');
            if (ariaModal) {
                element.ariaModal = ariaModal;
            } else {
                element.removeAttribute('aria-modal');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
            const tabindex = this.getConfig(element, 'tabindex');
            if (tabindex) {
                element.tabIndex = tabindex;
            } else {
                element.removeAttribute('tabindex');
            }
        }
    }

    public setPressed(element: HTMLElement|string, pressed:'false'|'mixed'|'true' = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-pressed',
                pressed,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (pressed) {
                element.ariaPressed = pressed;
            } else {
                element.removeAttribute('aria-pressed');
            }
        }
    }
    public revertPressed(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-pressed',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaPressed = this.getConfig(element, 'aria-pressed');
            if (ariaPressed) {
                element.ariaPressed = ariaPressed;
            } else {
                element.removeAttribute('aria-pressed');
            }
        }
    }

    public setRequired(element: HTMLElement|string, required:'true'|'false' = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-required',
                required,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (required) {
                element.ariaRequired = required;
            } else {
                element.removeAttribute('aria-required');
            }
        }
    }
    public revertRequired(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-required',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaRequired = this.getConfig(element, 'aria-required');
            if (ariaRequired) {
                element.ariaRequired = ariaRequired;
            } else {
                element.removeAttribute('aria-required');
            }
        }
    }

    public setRole(element: HTMLElement|string, role:string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'role',
                role,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
        }
    }
    public revertRole(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'role',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            } else {
                element.removeAttribute('role');
            }
        }
    }

    public setSelected(element: HTMLElement|string, selected:'true'|'false' = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-selected',
                selected,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (selected) {
                element.ariaSelected = selected;
            } else {
                element.removeAttribute('aria-selected');
            }
        }
    }
    public revertSelected(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-selected',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaSelected = this.getConfig(element, 'aria-selected');
            if (ariaSelected) {
                element.ariaSelected = ariaSelected;
            } else {
                element.removeAttribute('aria-selected');
            }
        }
    }

    public setSort(element: HTMLElement|string, sort:'ascending'|'descending'|'none'|'other' = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'aria-sort',
                sort,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (sort) {
                element.ariaSort = sort;
            } else {
                element.removeAttribute('aria-sort');
            }
        }
    }
    public revertSort(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'aria-sort',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const ariaSort = this.getConfig(element, 'aria-sort');
            if (ariaSort) {
                element.ariaSort = ariaSort;
            } else {
                element.removeAttribute('aria-sort');
            }
        }
    }

    public setTabindex(element: HTMLElement|string, tabindex: string = undefined) {
        if (typeof element === 'string') {
            const message: IAriaSet = {
                name: element,
                attribute: 'tabindex',
                tabindex,
            }
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (tabindex !== undefined) {
                element.setAttribute('tabindex', tabindex);
                // element.tabIndex = parseInt(tabindex);
            } else {
                element.removeAttribute('tabindex');
            }
        }
    }
    public revertTabindex(element: HTMLElement|string) {
        if (typeof element === 'string') {
            const message: IAriaRevert = {
                name: element,
                attribute: 'tabindex',
            }
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        } else if (element instanceof HTMLElement) {
            const tabindex = this.getConfig(element, 'tabindex');
            if (tabindex !== undefined) {
                element.setAttribute('tabindex', tabindex);
                // element.tabIndex = parseInt(tabindex);
            } else {
                element.removeAttribute('tabindex');
            }
        }
    }

    public setByConfig(element: HTMLElement, config: IAriaSet) {
        this.storeConfig(element);
        switch (config.attribute) {
            case 'aria-checked':
                this.setChecked(element, config.checked??undefined, config.role??undefined);
                break;
            case 'aria-controls':
                this.setControls(element, config.controls??undefined, config.role??undefined);
                break;
            case 'aria-current':
                this.setCurrent(element, config.current??undefined, config.role??undefined);
                break;
            case 'aria-describedby':
                this.setDescribedBy(element, config.describedby??undefined, config.role??undefined);
                break;
            case 'aria-description':
                this.setDescription(element, config.description??undefined, config.role??undefined);
                break;
            case 'aria-details':
                this.setDetails(element, config.details??undefined, config.role??undefined);
                break;
            case 'aria-disabled':
                this.setDisabled(element, config.disabled??undefined, config.role??undefined);
                break;
            case 'aria-expanded':
                this.setExpanded(element, config.expanded??undefined);
                break;
            case 'aria-hidden':
                this.setHidden(element, config.hidden??undefined);
                break;
            case 'aria-invalid':
                this.setInvalid(element, config.invalid??undefined, config.role??undefined);
                break;
            case 'aria-label':
                this.setLabel(element, config.label??undefined);
                break;
            case 'aria-labelledby':
                this.setLabelledBy(element, config.labelledby??undefined);
                break;
            case 'aria-level':
                this.setLevel(element, config.level??undefined);
                break;
            case 'aria-live':
                this.setLive(element, config.live??undefined);
                break;
            case 'aria-modal':
                this.setModal(element, config.modal??undefined, config.role??undefined, config.tabindex??undefined);
                break;
            case 'aria-pressed':
                this.setPressed(element, config.pressed??undefined);
                break;
            case 'aria-required':
                this.setRequired(element, config.required??undefined);
                break;
            case 'role':
                this.setRole(element, config.role??undefined);
                break;
            case 'aria-selected':
                this.setSelected(element, config.selected??undefined);
                break;
            case 'aria-sort':
                this.setSort(element, config.sort??undefined);
                break;
            case 'tabindex':
                this.setTabindex(element, config.tabindex??undefined);
                break;
            default:
                this.logger.warn('set: unknown attribute', config.attribute);
                break;

        }
    }
    public revertByConfig(element: HTMLElement, config: IAriaRevert) {
        switch (config.attribute) {
            case 'aria-checked':
                this.revertChecked(element);
                break;
            case 'aria-controls':
                this.revertControls(element);
                break;
            case 'aria-current':
                this.revertCurrent(element);
                break;
            case 'aria-describedby':
                this.revertDescribedBy(element);
                break;
            case 'aria-description':
                this.revertDescription(element);
                break;
            case 'aria-details':
                this.revertDetails(element);
                break;
            case 'aria-disabled':
                this.revertDisabled(element);
                break;
            case 'aria-expanded':
                this.revertExpanded(element);
                break;
            case 'aria-hidden':
                this.revertHidden(element);
                break;
            case 'aria-invalid':
                this.revertInvalid(element);
                break;
            case 'aria-label':
                this.revertLabel(element);
                break;
            case 'aria-labelledby':
                this.revertLabelledBy(element);
                break;
            case 'aria-level':
                this.revertLevel(element);
                break;
            case 'aria-live':
                this.revertLive(element);
                break;
            case 'aria-modal':
                this.revertModal(element);
                break;
            case 'aria-pressed':
                this.revertPressed(element);
                break;
            case 'aria-required':
                this.revertRequired(element);
                break;
            case 'role':
                this.revertRole(element);
                break;
            case 'aria-selected':
                this.revertSelected(element);
                break;
            case 'aria-sort':
                this.revertSort(element);
                break;
            case 'tabindex':
                this.revertTabindex(element);
                break;
            default:
                this.logger.warn('revert: unknown attribute', config.attribute);
                break;
        }
    }

    private storeConfig(element: HTMLElement) {
        if (!this.elementsInitialConfig.has(element)) {
            const initialAttributes = {};
            Array.from(element.attributes)
                .forEach(attribute => {
                    initialAttributes[attribute.name.toLowerCase()] = attribute.value;
                });
            this.elementsInitialConfig.set(element, initialAttributes);
        }
    }
    private getConfig(element: HTMLElement, attribute: string) {
        if (this.elementsInitialConfig.has(element)) {
            const initialAttributes = this.elementsInitialConfig.get(element);
            if (initialAttributes[attribute]) {
                return initialAttributes[attribute];
            }
        }
        return undefined;
    }
    private restoreConfig(element: HTMLElement) {
        if (this.elementsInitialConfig.has(element)) {
            Array.from(element.attributes)
                .forEach(attribute => {
                    element.removeAttribute(attribute.name);
                });
            const initialAttributes = this.elementsInitialConfig.get(element);
            Object.keys(initialAttributes)
                .forEach(key => {
                    element.setAttribute(key, initialAttributes[key]);
                });
            this.elementsInitialConfig.delete(element);
        }
    }
}