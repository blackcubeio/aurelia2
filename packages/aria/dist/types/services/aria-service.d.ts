import { IEventAggregator, ILogger, IPlatform } from "aurelia";
import { IAriaSet, IAriaRevert } from '../interfaces/aria';
export declare const IAriaService: import("@aurelia/kernel").InterfaceSymbol<IAriaService>;
export interface IAriaService extends AriaService {
}
export declare class AriaService {
    private readonly logger;
    private readonly ea;
    private readonly platform;
    private readonly element;
    static trapFocusChannel: string;
    static ariaSetAttributeChannel: string;
    static ariaRevertAttributeChannel: string;
    private currentFocusedIndex;
    private keysMonitored;
    private focusableElementsQuerySelector;
    private lastFocusedElement;
    private keepFocus;
    private focusDelay;
    private currentFocusedIndew;
    private focusableElements;
    private focusableElementsConfig;
    private trapElement;
    private rollbackFocusElement;
    constructor(logger?: ILogger, ea?: IEventAggregator, platform?: IPlatform, element?: HTMLElement);
    /**
     * trapFocus keep the focus inside the trapElement
     * @param trapElement the element where to trap the focus
     * @param rollbackFocusElement the element to focus back when the trap is removed
     */
    trapFocus(trapElement: HTMLElement, rollbackFocusElement?: HTMLElement): Promise<HTMLElement>;
    /**
     * untrapFocus remove the focus trap
     *
     */
    untrapFocus(): Promise<unknown>;
    private onFocusIn;
    private checkElementAvailable;
    private onKeyDown;
    private focusElementByIndex;
    private elementsInitialConfig;
    /**
     * @param element HTMLElement where to set aria-checked if it's a string send an event to let element change it's own aria-checked
     * @param checked aria-checked value if undefined aria-checked will be removed
     * @param role role value if not set it will be untouched should be set to 'checkbox' or 'menuitemcheckbox' or 'menuitemradio' or 'radio'
     */
    setChecked(element: HTMLElement | string, checked?: 'true' | 'false' | 'mixed', role?: string): void;
    /**
     * @param element HTMLElement where to set aria-checked to original value if it's a string send an event to let element change it's own aria-checked
     */
    revertChecked(element: HTMLElement | string): void;
    /**
     * @param element HTMLElement where to set aria-controls if it's a string send an event to let element change it's own aria-controls
     * @param controls aria-controls value
     * @param role
     */
    setControls(element: HTMLElement | string, controls?: string, role?: string): void;
    revertControls(element: HTMLElement | string): void;
    setCurrent(element: HTMLElement | string, current?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false', role?: string): void;
    revertCurrent(element: HTMLElement | string): void;
    setDescribedBy(element: HTMLElement | string, describedby?: string, role?: string): void;
    revertDescribedBy(element: HTMLElement | string): void;
    setDescription(element: HTMLElement | string, description?: string, role?: string): void;
    revertDescription(element: HTMLElement | string): void;
    setDetails(element: HTMLElement | string, details?: string, role?: string): void;
    revertDetails(element: HTMLElement | string): void;
    setDisabled(element: HTMLElement | string, disabled?: 'true' | 'false', role?: string): void;
    revertDisabled(element: HTMLElement | string): void;
    setExpanded(element: HTMLElement | string, expanded?: string): void;
    revertExpanded(element: HTMLElement | string): void;
    setLevel(element: HTMLElement | string, level?: '1' | '2' | '3' | '4' | '5' | '6'): void;
    revertLevel(element: HTMLElement | string): void;
    setHasPopup(element: HTMLElement | string, haspopup?: 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'false'): void;
    revertHasPopup(element: HTMLElement | string): void;
    setHidden(element: HTMLElement | string, hidden?: 'true' | 'false'): void;
    revertHidden(element: HTMLElement | string): void;
    setInvalid(element: HTMLElement | string, invalid?: 'grammar' | 'spelling' | 'true' | 'false', role?: string): void;
    revertInvalid(element: HTMLElement | string): void;
    setLabel(element: HTMLElement | string, label?: string): void;
    revertLabel(element: HTMLElement | string): void;
    setLabelledBy(element: HTMLElement | string, labelledby?: string): void;
    revertLabelledBy(element: HTMLElement | string): void;
    setLive(element: HTMLElement | string, live?: 'assertive' | 'polite' | 'off'): void;
    revertLive(element: HTMLElement | string): void;
    setModal(element: HTMLElement | string, modal?: 'true' | 'false', role?: any, tabindex?: string): void;
    revertModal(element: HTMLElement | string): void;
    setPressed(element: HTMLElement | string, pressed?: 'false' | 'mixed' | 'true'): void;
    revertPressed(element: HTMLElement | string): void;
    setRequired(element: HTMLElement | string, required?: 'true' | 'false'): void;
    revertRequired(element: HTMLElement | string): void;
    setRole(element: HTMLElement | string, role?: string): void;
    revertRole(element: HTMLElement | string): void;
    setSelected(element: HTMLElement | string, selected?: 'true' | 'false'): void;
    revertSelected(element: HTMLElement | string): void;
    setSort(element: HTMLElement | string, sort?: 'ascending' | 'descending' | 'none' | 'other'): void;
    revertSort(element: HTMLElement | string): void;
    setTabindex(element: HTMLElement | string, tabindex?: string): void;
    revertTabindex(element: HTMLElement | string): void;
    setByConfig(element: HTMLElement, config: IAriaSet): void;
    revertByConfig(element: HTMLElement, config: IAriaRevert): void;
    private storeConfig;
    private getConfig;
    private restoreConfig;
}
//# sourceMappingURL=aria-service.d.ts.map