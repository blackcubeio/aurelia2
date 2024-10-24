'use strict';

var aurelia = require('aurelia');

const IAriaConfiguration = aurelia.DI.createInterface('IAriaConfiguration', x => x.singleton(AriaConfigure));
class AriaConfigure {
    constructor() {
        this._config = {};
    }
    configure(incoming = {}) {
        Object.assign(this._config, incoming);
        return this;
    }
    getOptions() {
        return this._config;
    }
    options(obj) {
        Object.assign(this._config, obj);
    }
    get(key) {
        return this._config[key];
    }
    set(key, val) {
        this._config[key] = val;
        return this._config[key];
    }
}

const IAriaService = aurelia.DI.createInterface('IAriaService', (x) => x.singleton(AriaService));
class AriaService {
    constructor(logger = aurelia.resolve(aurelia.ILogger).scopeTo('AriaService'), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.currentFocusedIndex = 0;
        this.keysMonitored = [
            'Escape',
        ];
        this.focusableElementsQuerySelector = '[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [accesskey], summary, canvas, audio, video, details, iframe, [contenteditable]';
        this.lastFocusedElement = null;
        this.keepFocus = false;
        this.focusDelay = 10;
        this.currentFocusedIndew = new Map();
        this.focusableElements = [];
        this.onFocusIn = (event) => {
            // find the index of the focused element in the focusable elements list
            const focusedElement = event.target;
            this.lastFocusedElement = focusedElement;
            const focusedIndex = this.focusableElements.indexOf(focusedElement);
            if (focusedElement && focusedIndex !== -1) {
                // element is in the focusable elements list
                if (focusedIndex !== this.currentFocusedIndex) {
                    this.currentFocusedIndex = focusedIndex;
                }
            }
        };
        this.onKeyDown = (event) => {
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
                }
                else {
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
            }
            else if (this.keysMonitored.includes(event.key)) {
                this.logger.trace('onKeyDown: handle Escape key');
                event.preventDefault();
                this.untrapFocus()
                    .then((data) => {
                    const trapElement = data[0];
                    const rollbackFocusElement = data[1];
                    // send message to let dev focus elsewhere if needed
                    const message = {
                        escape: true,
                        trapElement,
                        rollbackFocusElement,
                    };
                    this.ea.publish(AriaService.trapFocusChannel, message);
                });
            }
        };
        this.elementsInitialConfig = new Map();
        this.logger.trace('constructor');
    }
    /**
     * trapFocus keep the focus inside the trapElement
     * @param trapElement the element where to trap the focus
     * @param rollbackFocusElement the element to focus back when the trap is removed
     */
    trapFocus(trapElement, rollbackFocusElement = undefined) {
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
            .forEach((focusableElement) => {
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
    untrapFocus() {
        this.logger.trace('untrapFocus');
        if (this.trapElement) {
            this.focusableElements.forEach((focusableElement) => {
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
                    resolve([trappedElement, rollbackFocusElement]);
                });
            });
        }
    }
    checkElementAvailable(element) {
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
    focusElementByIndex(elementIndex) {
        if (elementIndex >= 0 && elementIndex < this.focusableElements.length) {
            this.platform.requestAnimationFrame(() => {
                this.focusableElements[elementIndex].focus();
            });
        }
    }
    /**
     * @param element HTMLElement where to set aria-checked if it's a string send an event to let element change it's own aria-checked
     * @param checked aria-checked value if undefined aria-checked will be removed
     * @param role role value if not set it will be untouched should be set to 'checkbox' or 'menuitemcheckbox' or 'menuitemradio' or 'radio'
     */
    setChecked(element, checked = undefined, role = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-checked',
                checked,
                role,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (checked !== undefined) {
                element.ariaChecked = checked;
                if (role) {
                    element.role = role;
                }
            }
            else {
                element.removeAttribute('aria-checked');
            }
        }
    }
    /**
     * @param element HTMLElement where to set aria-checked to original value if it's a string send an event to let element change it's own aria-checked
     */
    revertChecked(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-checked',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaChecked = this.getConfig(element, 'aria-checked');
            if (ariaChecked) {
                element.ariaChecked = ariaChecked;
            }
            else {
                element.removeAttribute('aria-checked');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
        }
    }
    /**
     * @param element HTMLElement where to set aria-controls if it's a string send an event to let element change it's own aria-controls
     * @param controls aria-controls value
     * @param role
     */
    setControls(element, controls = undefined, role = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-controls',
                controls,
                role,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (controls) {
                element.setAttribute('aria-controls', controls);
                if (role) {
                    element.role = role;
                }
            }
            else {
                element.removeAttribute('aria-controls');
            }
        }
    }
    revertControls(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-controls',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaControls = this.getConfig(element, 'aria-controls');
            if (ariaControls) {
                element.setAttribute('aria-controls', ariaControls);
            }
            else {
                element.removeAttribute('aria-controls');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
        }
    }
    setCurrent(element, current = undefined, role = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-current',
                current,
                role,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (current) {
                element.ariaCurrent = current;
                if (role) {
                    element.role = role;
                }
            }
            else {
                element.removeAttribute('aria-current');
            }
        }
    }
    revertCurrent(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-current',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaCurrent = this.getConfig(element, 'aria-current');
            if (ariaCurrent) {
                element.ariaCurrent = ariaCurrent;
            }
            else {
                element.removeAttribute('aria-current');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
        }
    }
    setDescribedBy(element, describedby = undefined, role = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-describedby',
                describedby,
                role,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (describedby) {
                element.setAttribute('aria-describedby', describedby);
                if (role) {
                    element.role = role;
                }
            }
        }
    }
    revertDescribedBy(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-describedby',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaDescribedBy = this.getConfig(element, 'aria-describedby');
            if (ariaDescribedBy) {
                element.setAttribute('aria-describedby', ariaDescribedBy);
            }
            else {
                element.removeAttribute('aria-describedby');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
        }
    }
    setDescription(element, description = undefined, role = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-description',
                description,
                role,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (description) {
                element.ariaDescription = description;
                if (role) {
                    element.role = role;
                }
            }
            else {
                element.removeAttribute('aria-description');
            }
        }
    }
    revertDescription(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-description',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaDescription = this.getConfig(element, 'aria-description');
            if (ariaDescription) {
                element.ariaDescription = ariaDescription;
            }
            else {
                element.removeAttribute('aria-description');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
        }
    }
    setDetails(element, details = undefined, role = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-details',
                details,
                role,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (details) {
                element.setAttribute('aria-details', details);
                if (role) {
                    element.role = role;
                }
            }
            else {
                element.removeAttribute('aria-details');
            }
        }
    }
    revertDetails(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-details',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaDetails = this.getConfig(element, 'aria-details');
            if (ariaDetails) {
                element.setAttribute('aria-details', ariaDetails);
            }
            else {
                element.removeAttribute('aria-details');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
        }
    }
    setDisabled(element, disabled = undefined, role = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-disabled',
                disabled,
                role,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (disabled) {
                element.ariaDisabled = disabled;
                if (role) {
                    element.role = role;
                }
            }
            else {
                element.removeAttribute('aria-disabled');
            }
        }
    }
    revertDisabled(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-disabled',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaDisabled = this.getConfig(element, 'aria-disabled');
            if (ariaDisabled) {
                element.ariaDisabled = ariaDisabled;
            }
            else {
                element.removeAttribute('aria-disabled');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
        }
    }
    setExpanded(element, expanded = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-expanded',
                expanded,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (expanded) {
                element.ariaExpanded = expanded;
            }
            else {
                element.removeAttribute('aria-expanded');
            }
        }
    }
    revertExpanded(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-expanded',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaExpanded = this.getConfig(element, 'aria-expanded');
            if (ariaExpanded) {
                element.ariaExpanded = ariaExpanded;
            }
            else {
                element.removeAttribute('aria-expanded');
            }
        }
    }
    setLevel(element, level = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-level',
                level,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (level) {
                element.setAttribute('role', 'heading');
                element.setAttribute('aria-level', level);
            }
            else {
                element.removeAttribute('aria-level');
                element.removeAttribute('role');
            }
        }
    }
    revertLevel(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-level',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaLevel = this.getConfig(element, 'aria-level');
            if (ariaLevel) {
                element.setAttribute('aria-level', ariaLevel);
            }
            else {
                element.removeAttribute('aria-level');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
        }
    }
    setHasPopup(element, haspopup = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-haspopup',
                haspopup,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (haspopup) {
                element.ariaHasPopup = haspopup;
            }
            else {
                element.removeAttribute('aria-haspopup');
            }
        }
    }
    revertHasPopup(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-haspopup',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaHasPopup = this.getConfig(element, 'aria-haspopup');
            if (ariaHasPopup) {
                element.ariaHasPopup = ariaHasPopup;
            }
            else {
                element.removeAttribute('aria-haspopup');
            }
        }
    }
    setHidden(element, hidden = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-hidden',
                hidden,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (hidden) {
                element.ariaHidden = hidden;
            }
            else {
                element.removeAttribute('aria-hidden');
            }
        }
    }
    revertHidden(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-hidden',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaHidden = this.getConfig(element, 'aria-hidden');
            if (ariaHidden) {
                element.ariaHidden = ariaHidden;
            }
            else {
                element.removeAttribute('aria-hidden');
            }
        }
    }
    setInvalid(element, invalid = 'false', role = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-invalid',
                invalid,
                role,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (invalid) {
                element.ariaInvalid = invalid;
                if (role) {
                    element.role = role;
                }
            }
            else {
                element.removeAttribute('aria-invalid');
            }
        }
    }
    revertInvalid(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-invalid',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaInvalid = this.getConfig(element, 'aria-invalid');
            if (ariaInvalid) {
                element.ariaInvalid = ariaInvalid;
            }
            else {
                element.removeAttribute('aria-invalid');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
        }
    }
    setLabel(element, label = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-label',
                label,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (label) {
                element.ariaLabel = label;
            }
            else {
                element.removeAttribute('aria-label');
            }
        }
    }
    revertLabel(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-label',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaLabel = this.getConfig(element, 'aria-label');
            if (ariaLabel) {
                element.ariaLabel = ariaLabel;
            }
            else {
                element.removeAttribute('aria-label');
            }
        }
    }
    setLabelledBy(element, labelledby = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-labelledby',
                labelledby,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (labelledby) {
                element.setAttribute('aria-labelledby', labelledby);
            }
            else {
                element.removeAttribute('aria-labelledby');
            }
        }
    }
    revertLabelledBy(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-labelledby',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaLabelledBy = this.getConfig(element, 'aria-labelledby');
            if (ariaLabelledBy) {
                element.setAttribute('aria-labelledby', ariaLabelledBy);
            }
            else {
                element.removeAttribute('aria-labelledby');
            }
        }
    }
    setLive(element, live = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-live',
                live,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (live) {
                element.ariaLive = live;
            }
            else {
                element.removeAttribute('aria-live');
            }
        }
    }
    revertLive(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-live',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaLive = this.getConfig(element, 'aria-live');
            if (ariaLive) {
                element.ariaLive = ariaLive;
            }
            else {
                element.removeAttribute('aria-live');
            }
        }
    }
    setModal(element, modal = undefined ``, role = undefined, tabindex = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-modal',
                modal,
                role,
                tabindex,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (modal) {
                element.ariaModal = modal;
                if (role) {
                    element.role = role;
                }
                if (tabindex) {
                    element.tabIndex = parseInt(tabindex);
                }
            }
            else {
                element.removeAttribute('aria-modal');
            }
        }
    }
    revertModal(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-modal',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaModal = this.getConfig(element, 'aria-modal');
            if (ariaModal) {
                element.ariaModal = ariaModal;
            }
            else {
                element.removeAttribute('aria-modal');
            }
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
            const tabindex = this.getConfig(element, 'tabindex');
            if (tabindex) {
                element.tabIndex = tabindex;
            }
            else {
                element.removeAttribute('tabindex');
            }
        }
    }
    setPressed(element, pressed = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-pressed',
                pressed,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (pressed) {
                element.ariaPressed = pressed;
            }
            else {
                element.removeAttribute('aria-pressed');
            }
        }
    }
    revertPressed(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-pressed',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaPressed = this.getConfig(element, 'aria-pressed');
            if (ariaPressed) {
                element.ariaPressed = ariaPressed;
            }
            else {
                element.removeAttribute('aria-pressed');
            }
        }
    }
    setRequired(element, required = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-required',
                required,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (required) {
                element.ariaRequired = required;
            }
            else {
                element.removeAttribute('aria-required');
            }
        }
    }
    revertRequired(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-required',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaRequired = this.getConfig(element, 'aria-required');
            if (ariaRequired) {
                element.ariaRequired = ariaRequired;
            }
            else {
                element.removeAttribute('aria-required');
            }
        }
    }
    setRole(element, role = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'role',
                role,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
        }
    }
    revertRole(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'role',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const role = this.getConfig(element, 'role');
            if (role) {
                element.role = role;
            }
            else {
                element.removeAttribute('role');
            }
        }
    }
    setSelected(element, selected = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-selected',
                selected,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (selected) {
                element.ariaSelected = selected;
            }
            else {
                element.removeAttribute('aria-selected');
            }
        }
    }
    revertSelected(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-selected',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaSelected = this.getConfig(element, 'aria-selected');
            if (ariaSelected) {
                element.ariaSelected = ariaSelected;
            }
            else {
                element.removeAttribute('aria-selected');
            }
        }
    }
    setSort(element, sort = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-sort',
                sort,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (sort) {
                element.ariaSort = sort;
            }
            else {
                element.removeAttribute('aria-sort');
            }
        }
    }
    revertSort(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'aria-sort',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const ariaSort = this.getConfig(element, 'aria-sort');
            if (ariaSort) {
                element.ariaSort = ariaSort;
            }
            else {
                element.removeAttribute('aria-sort');
            }
        }
    }
    setTabindex(element, tabindex = undefined) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'tabindex',
                tabindex,
            };
            this.ea.publish(AriaService.ariaSetAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            this.storeConfig(element);
            if (tabindex !== undefined) {
                element.setAttribute('tabindex', tabindex);
                // element.tabIndex = parseInt(tabindex);
            }
            else {
                element.removeAttribute('tabindex');
            }
        }
    }
    revertTabindex(element) {
        if (typeof element === 'string') {
            const message = {
                name: element,
                attribute: 'tabindex',
            };
            this.ea.publish(AriaService.ariaRevertAttributeChannel, message);
        }
        else if (element instanceof HTMLElement) {
            const tabindex = this.getConfig(element, 'tabindex');
            if (tabindex !== undefined) {
                element.setAttribute('tabindex', tabindex);
                // element.tabIndex = parseInt(tabindex);
            }
            else {
                element.removeAttribute('tabindex');
            }
        }
    }
    setByConfig(element, config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        this.storeConfig(element);
        switch (config.attribute) {
            case 'aria-checked':
                this.setChecked(element, (_a = config.checked) !== null && _a !== void 0 ? _a : undefined, (_b = config.role) !== null && _b !== void 0 ? _b : undefined);
                break;
            case 'aria-controls':
                this.setControls(element, (_c = config.controls) !== null && _c !== void 0 ? _c : undefined, (_d = config.role) !== null && _d !== void 0 ? _d : undefined);
                break;
            case 'aria-current':
                this.setCurrent(element, (_e = config.current) !== null && _e !== void 0 ? _e : undefined, (_f = config.role) !== null && _f !== void 0 ? _f : undefined);
                break;
            case 'aria-describedby':
                this.setDescribedBy(element, (_g = config.describedby) !== null && _g !== void 0 ? _g : undefined, (_h = config.role) !== null && _h !== void 0 ? _h : undefined);
                break;
            case 'aria-description':
                this.setDescription(element, (_j = config.description) !== null && _j !== void 0 ? _j : undefined, (_k = config.role) !== null && _k !== void 0 ? _k : undefined);
                break;
            case 'aria-details':
                this.setDetails(element, (_l = config.details) !== null && _l !== void 0 ? _l : undefined, (_m = config.role) !== null && _m !== void 0 ? _m : undefined);
                break;
            case 'aria-disabled':
                this.setDisabled(element, (_o = config.disabled) !== null && _o !== void 0 ? _o : undefined, (_p = config.role) !== null && _p !== void 0 ? _p : undefined);
                break;
            case 'aria-expanded':
                this.setExpanded(element, (_q = config.expanded) !== null && _q !== void 0 ? _q : undefined);
                break;
            case 'aria-hidden':
                this.setHidden(element, (_r = config.hidden) !== null && _r !== void 0 ? _r : undefined);
                break;
            case 'aria-invalid':
                this.setInvalid(element, (_s = config.invalid) !== null && _s !== void 0 ? _s : undefined, (_t = config.role) !== null && _t !== void 0 ? _t : undefined);
                break;
            case 'aria-label':
                this.setLabel(element, (_u = config.label) !== null && _u !== void 0 ? _u : undefined);
                break;
            case 'aria-labelledby':
                this.setLabelledBy(element, (_v = config.labelledby) !== null && _v !== void 0 ? _v : undefined);
                break;
            case 'aria-level':
                this.setLevel(element, (_w = config.level) !== null && _w !== void 0 ? _w : undefined);
                break;
            case 'aria-live':
                this.setLive(element, (_x = config.live) !== null && _x !== void 0 ? _x : undefined);
                break;
            case 'aria-modal':
                this.setModal(element, (_y = config.modal) !== null && _y !== void 0 ? _y : undefined, (_z = config.role) !== null && _z !== void 0 ? _z : undefined, (_0 = config.tabindex) !== null && _0 !== void 0 ? _0 : undefined);
                break;
            case 'aria-pressed':
                this.setPressed(element, (_1 = config.pressed) !== null && _1 !== void 0 ? _1 : undefined);
                break;
            case 'aria-required':
                this.setRequired(element, (_2 = config.required) !== null && _2 !== void 0 ? _2 : undefined);
                break;
            case 'role':
                this.setRole(element, (_3 = config.role) !== null && _3 !== void 0 ? _3 : undefined);
                break;
            case 'aria-selected':
                this.setSelected(element, (_4 = config.selected) !== null && _4 !== void 0 ? _4 : undefined);
                break;
            case 'aria-sort':
                this.setSort(element, (_5 = config.sort) !== null && _5 !== void 0 ? _5 : undefined);
                break;
            case 'tabindex':
                this.setTabindex(element, (_6 = config.tabindex) !== null && _6 !== void 0 ? _6 : undefined);
                break;
            default:
                this.logger.warn('set: unknown attribute', config.attribute);
                break;
        }
    }
    revertByConfig(element, config) {
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
    storeConfig(element) {
        if (!this.elementsInitialConfig.has(element)) {
            const initialAttributes = {};
            Array.from(element.attributes)
                .forEach(attribute => {
                initialAttributes[attribute.name.toLowerCase()] = attribute.value;
            });
            this.elementsInitialConfig.set(element, initialAttributes);
        }
    }
    getConfig(element, attribute) {
        if (this.elementsInitialConfig.has(element)) {
            const initialAttributes = this.elementsInitialConfig.get(element);
            if (initialAttributes[attribute]) {
                return initialAttributes[attribute];
            }
        }
        return undefined;
    }
    restoreConfig(element) {
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
AriaService.trapFocusChannel = 'ARIA_TRAP_FOCUS';
AriaService.ariaSetAttributeChannel = 'ARIA_SET_ATTRIBUTE';
AriaService.ariaRevertAttributeChannel = 'ARIA_REVERT_ATTRIBUTE';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
}
function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
}
function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

let Aria = (() => {
    let _classDecorators = [aurelia.customAttribute('bc-aria')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger).scopeTo('Aria'), ariaService = aurelia.resolve(IAriaService), ea = aurelia.resolve(aurelia.IEventAggregator), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.ariaService = ariaService;
            this.ea = ea;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.disposableSet = __runInitializers(this, _name_extraInitializers);
            this.onSetAria = (evt) => {
                if (evt.name === this.name) {
                    this.logger.debug('onSetAria', evt);
                    this.ariaService.setByConfig(this.element, evt);
                }
            };
            this.onRevertAria = (evt) => {
                if (evt.name === this.name) {
                    this.logger.debug('onRevertAria', evt);
                    this.ariaService.revertByConfig(this.element, evt);
                }
            };
            this.logger.debug('constructor');
        }
        attaching() {
            this.logger.trace('Attaching');
            if (this.name.length > 0) {
                this.disposableSet = this.ea.subscribe(AriaService.ariaSetAttributeChannel, this.onSetAria);
                this.disposableUnset = this.ea.subscribe(AriaService.ariaRevertAttributeChannel, this.onRevertAria);
            }
        }
        attached() {
            this.logger.trace('Attached');
        }
        detaching() {
            this.logger.trace('Detaching');
            if (this.name.length > 0) {
                this.disposableSet.dispose();
                this.disposableUnset.dispose();
            }
        }
    };
    __setFunctionName(_classThis, "Aria");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

const DefaultComponents = [
    Aria,
];
function createAriaConfiguration(options) {
    return {
        register(container) {
            const configClass = container.get(IAriaConfiguration);
            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents);
        },
        configure(options) {
            return createAriaConfiguration(options);
        }
    };
}
const AriaConfiguration = createAriaConfiguration({});

exports.AriaConfiguration = AriaConfiguration;
exports.AriaService = AriaService;
exports.IAriaConfiguration = IAriaConfiguration;
exports.IAriaService = IAriaService;
//# sourceMappingURL=index.js.map
