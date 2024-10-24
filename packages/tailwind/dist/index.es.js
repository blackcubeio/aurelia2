import { DI, customAttribute, resolve, ILogger, IPlatform, INode, IEventAggregator } from 'aurelia';
import { ITransitionService } from '@blackcube/aurelia2-transition';
import { IAriaService, AriaService } from '@blackcube/aurelia2-aria';

const ITailwindConfiguration = DI.createInterface('ITailwindConfiguration', x => x.singleton(Configure));
class Configure {
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

let MenuMobile = (() => {
    let _classDecorators = [customAttribute('bc-tw-menu-mobile')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    _classThis = class {
        constructor(logger = resolve(ILogger).scopeTo('MenuMobile'), transitionService = resolve(ITransitionService), platform = resolve(IPlatform), element = resolve(INode)) {
            this.logger = logger;
            this.transitionService = transitionService;
            this.platform = platform;
            this.element = element;
            this.closeButtonTransition = {
                from: 'opacity-0',
                to: 'opacity-100',
                transition: 'transition-opacity ease-in-out duration-300',
                show: 'inherit',
                hide: 'none'
            };
            this.overlayTransition = {
                from: 'opacity-0',
                to: 'opacity-100',
                transition: 'transition-opacity ease-linear duration-300',
                show: 'inherit',
                hide: 'none'
            };
            this.offcanvasTransition = {
                from: '-translate-x-full',
                to: 'translate-x-0',
                transition: 'transition ease-in-out duration-300 transform',
                show: 'inherit',
                hide: 'none'
            };
            this.isClosed = true;
            this.onOpenMobileMenu = (evt) => {
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
            };
            this.onCloseMobileMenu = (evt) => {
                evt.preventDefault();
                this.logger.trace('Close mobile menu');
                const promises = [];
                promises.push(this.transitionService.leave(this.closeButtonPanel, this.closeButtonTransition));
                promises.push(this.transitionService.leave(this.overlayPanel, this.overlayTransition));
                promises.push(this.transitionService.leave(this.offcanvasPanel, this.offcanvasTransition));
                Promise.all(promises).then(() => {
                    this.isClosed = true;
                    this.element.style.display = 'none';
                    this.isClosed = true;
                    return Promise.resolve();
                });
            };
        }
        attaching() {
            this.logger.trace('Attaching');
            this.openButton = this.platform.document.querySelector('[data-menu-mobile="open"]');
            this.closeButton = this.element.querySelector('[data-menu-mobile="close"]');
            this.closeButtonPanel = this.closeButton.parentElement;
            this.overlayPanel = this.element.querySelector('[data-menu-mobile="overlay"]');
            this.offcanvasPanel = this.element.querySelector('[data-menu-mobile="offcanvas"]');
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
        attached() {
            this.logger.trace('Attached');
            this.openButton.addEventListener('click', this.onOpenMobileMenu);
            this.closeButton.addEventListener('click', this.onCloseMobileMenu);
        }
        detaching() {
            this.logger.trace('Detached');
            this.openButton.removeEventListener('click', this.onOpenMobileMenu);
            this.closeButton.removeEventListener('click', this.onCloseMobileMenu);
        }
    };
    __setFunctionName(_classThis, "MenuMobile");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

const IStorageService = DI.createInterface('IStorageService', (x) => x.singleton(StorageService));
class StorageService {
    constructor(logger = resolve(ILogger).scopeTo('StorageService')) {
        this.logger = logger;
        this.storage = localStorage;
        this.logger.trace('Construct');
    }
    get(key) {
        return this.storage.getItem(key);
    }
    set(key, value) {
        this.storage.setItem(key, value);
    }
}

const ISidebarService = DI.createInterface('ISidebarService', (x) => x.singleton(SidebarService));
class SidebarService {
    constructor(logger = resolve(ILogger).scopeTo('SidebarService'), storageService = resolve(IStorageService)) {
        this.logger = logger;
        this.storageService = storageService;
        this.KEY = 'sidebar:';
        this.logger.trace('Construct');
    }
    getStatus(key) {
        const status = this.storageService.get(this.KEY + key);
        return status === '1';
    }
    setStatus(key, status) {
        if (status) {
            this.storageService.set(this.KEY + key, '1');
        }
        else {
            this.storageService.set(this.KEY + key, '0');
        }
    }
}

let MenuSidebar = (() => {
    let _classDecorators = [customAttribute('bc-tw-menu-sidebar')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    _classThis = class {
        constructor(logger = resolve(ILogger).scopeTo('MenuSidebar'), transitionService = resolve(ITransitionService), sidebarService = resolve(ISidebarService), ariaService = resolve(IAriaService), platform = resolve(IPlatform), element = resolve(INode)) {
            this.logger = logger;
            this.transitionService = transitionService;
            this.sidebarService = sidebarService;
            this.ariaService = ariaService;
            this.platform = platform;
            this.element = element;
            this.svgTransition = {
                from: 'text-gray-400',
                to: 'text-gray-500 rotate-90',
                transition: 'transition-transform ease-in-out duration-150',
            };
            this.onClick = (evt) => {
                this.logger.trace('Click');
                evt.stopPropagation();
                const button = evt.target;
                const menuName = button.dataset.menuSidebar;
                const svg = button.querySelector('svg[data-menu-sidebar="arrow"]');
                const submenu = button.nextElementSibling;
                if (submenu.classList.contains('hidden')) {
                    this.transitionService.enter(svg, this.svgTransition);
                    submenu.classList.remove('hidden');
                    this.ariaService.setExpanded(button, 'true');
                    this.ariaService.setHidden(submenu, 'false');
                    submenu.classList.remove('hidden');
                    if (menuName.length > 0) {
                        this.sidebarService.setStatus(menuName, true);
                    }
                }
                else {
                    this.transitionService.leave(svg, this.svgTransition);
                    submenu.classList.add('hidden');
                    this.ariaService.setExpanded(button, 'false');
                    this.ariaService.setHidden(submenu, 'true');
                    submenu.classList.add('hidden');
                    if (menuName.length > 0) {
                        this.sidebarService.setStatus(menuName, false);
                    }
                }
            };
        }
        attaching() {
            this.logger.trace('Attaching');
            this.buttons = this.element.querySelectorAll('button[type="button"]');
            this.initSidebar();
        }
        attached() {
            this.logger.trace('Attached');
            this.buttons.forEach((button) => button.addEventListener('click', this.onClick));
        }
        detaching() {
            this.logger.trace('Detached');
            this.buttons.forEach((button) => button.removeEventListener('click', this.onClick));
        }
        initSidebar() {
            this.buttons.forEach((button) => {
                const menuName = button.dataset.menuSidebar;
                if (menuName.length > 0) {
                    const svg = button.querySelector('svg[data-menu-sidebar="arrow"]');
                    const submenu = button.nextElementSibling;
                    const state = this.sidebarService.getStatus(menuName);
                    if (state) {
                        this.transitionService.enter(svg, this.svgTransition, true);
                        this.ariaService.setExpanded(button, 'true');
                        this.ariaService.setHidden(submenu, 'false');
                        submenu.classList.remove('hidden');
                    }
                    else {
                        this.transitionService.leave(svg, this.svgTransition, undefined, true);
                        this.ariaService.setExpanded(button, 'false');
                        this.ariaService.setHidden(submenu, 'true');
                        submenu.classList.add('hidden');
                    }
                }
            });
        }
    };
    __setFunctionName(_classThis, "MenuSidebar");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

let DropdownMenu = (() => {
    let _classDecorators = [customAttribute('bc-tw-dropdown-menu')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    _classThis = class {
        constructor(logger = resolve(ILogger).scopeTo('DropdownMenu'), platform = resolve(IPlatform), transitionService = resolve(ITransitionService), ariaService = resolve(IAriaService), ea = resolve(IEventAggregator), element = resolve(INode)) {
            this.logger = logger;
            this.platform = platform;
            this.transitionService = transitionService;
            this.ariaService = ariaService;
            this.ea = ea;
            this.element = element;
            this.isClosed = true;
            this.menuTransition = {
                from: 'transform opacity-0 scale-95',
                to: 'transform opacity-100 scale-100',
                transition: 'ease-out duration-100',
                transitionLeaving: 'ease-in duration-75',
                show: 'inherit',
                hide: 'none'
            };
            this.onTrapFocus = (evt) => {
                this.logger.debug('onTrapFocus', evt);
                if (evt.trapElement === this.menu && this.isClosed === false) {
                    this.transitionService.leave(this.menu, this.menuTransition)
                        .then(() => {
                        this.isClosed = true;
                        this.ariaService.setExpanded(this.button, 'false');
                        this.ariaService.setHidden(this.menu, 'true');
                        this.platform.requestAnimationFrame(() => { var _a; return (_a = evt.rollbackFocusElement) === null || _a === void 0 ? void 0 : _a.focus(); });
                    });
                }
            };
            this.onToggle = (evt) => {
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
                }
            };
            this.onFocusOut = (evt) => {
                if (evt.relatedTarget === null || !this.menu.contains(evt.relatedTarget)) {
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
            };
            this.logger.debug('constructor');
        }
        attaching() {
            this.logger.trace('Attaching');
            this.button = this.element.querySelector('button');
            this.menu = this.element.querySelector('div');
            this.transitionService.leave(this.menu, this.menuTransition, undefined, true)
                .then(() => {
                this.isClosed = true;
                this.ariaService.setExpanded(this.button, 'false');
                this.ariaService.setHidden(this.menu, 'true');
                this.ariaService.untrapFocus();
            });
            this.disposable = this.ea.subscribe(AriaService.trapFocusChannel, this.onTrapFocus);
        }
        attached() {
            this.logger.trace('Attached');
            this.button.addEventListener('click', this.onToggle);
        }
        detaching() {
            this.logger.trace('Detaching');
            this.button.removeEventListener('click', this.onToggle);
            this.disposable.dispose();
        }
    };
    __setFunctionName(_classThis, "DropdownMenu");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

let FormDropdown = (() => {
    let _classDecorators = [customAttribute('bc-tw-form-dropdown')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    _classThis = class {
        constructor(logger = resolve(ILogger).scopeTo('FormDropdown'), platform = resolve(IPlatform), element = resolve(INode), ea = resolve(IEventAggregator), ariaService = resolve(IAriaService)) {
            this.logger = logger;
            this.platform = platform;
            this.element = element;
            this.ea = ea;
            this.ariaService = ariaService;
            this.onTrapFocusKeydown = (evt) => {
                if (evt.escape && evt.trapElement === this.list) {
                    this.list.classList.add('hidden');
                    this.input.value = this.select.options[this.select.selectedIndex].text;
                }
            };
            this.onKeyPress = (evt) => {
                if (evt.key === 'Tab' && !this.list.classList.contains('hidden')) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.ariaService.trapFocus(this.list, this.input);
                }
                else if (evt.key === 'Escape' && !this.list.classList.contains('hidden')) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.list.classList.add('hidden');
                    this.ariaService.untrapFocus();
                    this.input.value = this.select.options[this.select.selectedIndex].text;
                }
            };
            this.onFocusOut = (evt) => {
                this.logger.trace('Focus out');
            };
            this.onToggleList = (evt) => {
                this.logger.trace('Toggle list');
                if (this.list.classList.contains('hidden')) {
                    this.updateList(true);
                    this.list.classList.remove('hidden');
                    this.ariaService.trapFocus(this.list, this.input);
                }
                else {
                    this.input.value = this.select.options[this.select.selectedIndex].text;
                    this.list.classList.add('hidden');
                    this.ariaService.untrapFocus();
                }
            };
            this.onSelectChange = (evt) => {
                this.logger.trace('Select changed');
                this.updateList();
            };
            this.onInputChange = (evt) => {
                this.logger.trace('Input changed');
                this.updateList();
                this.list.classList.remove('hidden');
            };
            this.onSelectElement = (evt) => {
                const button = evt.target.closest('button');
                if (this.list.contains(button)) {
                    evt.stopPropagation();
                    this.logger.trace('Element selected');
                    const id = button.dataset['optionid'];
                    Array.from(this.select.options).forEach((option) => {
                        if (option.value === id) {
                            this.select.value = id;
                        }
                    });
                    const span = button.querySelector('span');
                    this.input.value = span.textContent;
                    this.select.dispatchEvent(new Event('change'));
                    this.list.classList.add('hidden');
                    this.ariaService.setExpanded(this.input, 'false');
                    this.ariaService.untrapFocus();
                    this.input.focus();
                }
            };
            this.generatedId = 'listbox-' + Math.random().toString(36).substring(2, 7);
        }
        attaching() {
            this.logger.trace('Attaching');
            this.disposable = this.ea.subscribe(AriaService.trapFocusChannel, this.onTrapFocusKeydown);
            this.button = this.element.querySelector('button');
            this.input = this.element.querySelector('input');
            this.input.id = this.generatedId;
            this.ariaService.setExpanded(this.input, 'false');
            this.ariaService.setHasPopup(this.input, 'listbox');
            this.label = this.element.querySelector('label');
            this.label.htmlFor = this.generatedId;
            this.select = this.element.querySelector('select');
            const tpl = this.element.querySelector('template');
            this.optionTemplate = tpl.content.firstElementChild;
            tpl === null || tpl === void 0 ? void 0 : tpl.remove();
            this.list = this.element.querySelector('ul');
            this.list.id = this.generatedId + '-list';
            // this.list.classList.remove('hidden');
            this.initList();
        }
        initList() {
            this.list.querySelectorAll('li').forEach((li) => {
                li.remove();
            });
            Array.from(this.select.options)
                .forEach((option) => {
                const li = this.optionTemplate.cloneNode(true);
                const button = li.querySelector('button');
                this.ariaService.setRole(button, 'option');
                button.dataset['optionid'] = option.value;
                li.dataset['searchValue'] = option.text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const textElement = li.querySelector('[data-value]');
                textElement.textContent = option.text;
                const check = li.querySelector('[data-selected]');
                check.dataset['selected'] = option.selected ? 'true' : 'false';
                if (option.selected) {
                    this.ariaService.setSelected(button, 'true');
                    check.classList.remove('hidden');
                    this.input.value = option.text;
                }
                else {
                    this.ariaService.setSelected(button, 'false');
                    check.classList.add('hidden');
                }
                this.list.appendChild(li);
            });
            this.logger.trace('List inited');
        }
        updateList(nofilter = false) {
            const searchValue = this.input.value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
            Array.from(this.select.options)
                .forEach((option) => {
                const button = this.list.querySelector('button[data-optionid="' + option.value + '"]');
                const li = button.closest('li');
                const searchableValue = li.dataset['searchValue'].trim();
                if ((nofilter === true) || (searchValue === '') || searchableValue.includes(searchValue)) {
                    li.classList.remove('hidden');
                }
                else {
                    li.classList.add('hidden');
                }
                const check = li.querySelector('[data-selected]');
                check.dataset['selected'] = option.selected ? 'true' : 'false';
                if (option.selected) {
                    this.ariaService.setSelected(button, 'true');
                    check.classList.remove('hidden');
                }
                else {
                    this.ariaService.setSelected(button, 'false');
                    check.classList.add('hidden');
                }
            });
        }
        attached() {
            this.logger.trace('Attached');
            this.select.addEventListener('change', this.onSelectChange);
            this.list.addEventListener('click', this.onSelectElement);
            this.input.addEventListener('input', this.onInputChange);
            this.button.addEventListener('click', this.onToggleList);
            this.input.addEventListener('focusout', this.onFocusOut);
            this.input.addEventListener('keydown', this.onKeyPress);
        }
        detaching() {
            this.logger.trace('Detached');
            this.select.removeEventListener('change', this.onSelectChange);
            this.list.removeEventListener('click', this.onSelectElement);
            this.input.removeEventListener('input', this.onInputChange);
            this.button.removeEventListener('click', this.onToggleList);
            this.input.removeEventListener('focusout', this.onFocusOut);
            this.input.removeEventListener('keydown', this.onKeyPress);
        }
    };
    __setFunctionName(_classThis, "FormDropdown");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

const DefaultComponents = [
    DropdownMenu,
    FormDropdown,
    MenuMobile,
    MenuSidebar,
];
function createTailwindConfiguration(options) {
    return {
        register(container) {
            const configClass = container.get(ITailwindConfiguration);
            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents);
        },
        configure(options) {
            return createTailwindConfiguration(options);
        }
    };
}
const TailwindConfiguration = createTailwindConfiguration({});

export { DropdownMenu, FormDropdown, ISidebarService, IStorageService, ITailwindConfiguration, MenuMobile, MenuSidebar, TailwindConfiguration };
//# sourceMappingURL=index.es.js.map
