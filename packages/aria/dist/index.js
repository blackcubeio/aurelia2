'use strict';

var aurelia = require('aurelia');

const IAriaConfiguration = aurelia.DI.createInterface('IAriaConfiguration', x => x.singleton(AriaConfigure));
class AriaConfigure {
    constructor() {
        this._config = {
            focusableElementsQuerySelector: '[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [accesskey], summary, canvas, audio, video, details, iframe, [contenteditable]',
            invalidElementsQuerySelector: '[aria-invalid="true"], :invalid',
            keysMonitored: [
                'Escape',
            ],
            focusDelay: 100,
        };
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
/* global Reflect, Promise, SuppressedError, Symbol */


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
    return Object.defineProperty(f, "name", { configurable: true, value: name });
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

exports.HtmlActions = void 0;
(function (HtmlActions) {
    HtmlActions["define"] = "define";
    HtmlActions["remove"] = "remove";
})(exports.HtmlActions || (exports.HtmlActions = {}));

exports.CurrentChannels = void 0;
(function (CurrentChannels) {
    CurrentChannels["main"] = "aria:current:main";
    CurrentChannels["ended"] = "aria:current:ended";
})(exports.CurrentChannels || (exports.CurrentChannels = {}));
exports.CurrentModes = void 0;
(function (CurrentModes) {
    CurrentModes["page"] = "page";
    CurrentModes["step"] = "step";
    CurrentModes["location"] = "location";
    CurrentModes["date"] = "date";
    CurrentModes["time"] = "time";
    CurrentModes["true"] = "true";
    CurrentModes["false"] = "false";
})(exports.CurrentModes || (exports.CurrentModes = {}));

let AriaCurrent = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-aria-current")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    var AriaCurrent = _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, true));
            this.mode = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _mode_initializers, exports.CurrentModes.false));
            this.disposable = __runInitializers(this, _mode_extraInitializers);
            this.onAriaCurrent = (data) => {
                if (data.name == this.name) {
                    this.logger.trace('onAriaCurrent');
                    this.mode = data.mode;
                    const message = {
                        name: this.name,
                        mode: this.mode,
                        action: data.action
                    };
                    if (data.action === exports.HtmlActions.define) {
                        message.action = this.defineCurrent();
                    }
                    else if (data.action === exports.HtmlActions.remove) {
                        message.action = this.removeCurrent();
                    }
                    else {
                        throw new Error('AriaCurrent: action not supported');
                    }
                    this.platform.taskQueue.queueTask(() => {
                        this.ea.publish(exports.CurrentChannels.ended, message);
                    });
                }
            };
            this.logger = logger.scopeTo('AriaCurrent');
            this.logger.trace('constructor');
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.CurrentChannels.main, this.onAriaCurrent);
            if (this.enabled) {
                this.defineCurrent();
            }
        }
        dispose() {
            this.logger.trace('dispose');
            this.disposable.dispose();
        }
        removeCurrent() {
            this.element.removeAttribute(AriaCurrent.attribute);
            return exports.HtmlActions.remove;
        }
        defineCurrent() {
            if (this.mode === exports.CurrentModes.false) {
                return this.removeCurrent();
            }
            this.element.setAttribute(AriaCurrent.attribute, this.mode);
            return exports.HtmlActions.define;
        }
    };
    __setFunctionName(_classThis, "AriaCurrent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        _enabled_decorators = [aurelia.bindable()];
        _mode_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AriaCurrent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attribute = 'aria-current';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AriaCurrent = _classThis;
})();

exports.ExpandedChannels = void 0;
(function (ExpandedChannels) {
    ExpandedChannels["main"] = "aria:expanded:main";
    ExpandedChannels["ended"] = "aria:expanded:ended";
})(exports.ExpandedChannels || (exports.ExpandedChannels = {}));
exports.ExpandedModes = void 0;
(function (ExpandedModes) {
    ExpandedModes["true"] = "true";
    ExpandedModes["false"] = "false";
})(exports.ExpandedModes || (exports.ExpandedModes = {}));

let AriaExpanded = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-aria-expanded")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    var AriaExpanded = _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, true));
            this.mode = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _mode_initializers, exports.ExpandedModes.false));
            this.disposable = __runInitializers(this, _mode_extraInitializers);
            this.onAriaExpand = (data) => {
                if (data.name == this.name) {
                    this.logger.trace('onAriaExpand');
                    this.mode = data.mode;
                    const message = {
                        name: this.name,
                        mode: this.mode,
                        action: data.action
                    };
                    if (data.action === exports.HtmlActions.define) {
                        message.action = this.defineExpanded();
                    }
                    else if (data.action === exports.HtmlActions.remove) {
                        message.action = this.removeExpanded();
                    }
                    else {
                        throw new Error('AriaExpanded: action not supported');
                    }
                    this.platform.taskQueue.queueTask(() => {
                        this.ea.publish(exports.ExpandedChannels.ended, message);
                    });
                }
            };
            this.logger = logger.scopeTo('AriaExpanded');
            this.logger.trace('constructor');
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.ExpandedChannels.main, this.onAriaExpand);
            if (this.enabled) {
                this.defineExpanded();
            }
        }
        dispose() {
            this.logger.trace('dispose');
            this.disposable.dispose();
        }
        removeExpanded() {
            this.element.removeAttribute(AriaExpanded.attribute);
            return exports.HtmlActions.remove;
        }
        defineExpanded() {
            this.element.setAttribute(AriaExpanded.attribute, this.mode);
            return exports.HtmlActions.define;
        }
    };
    __setFunctionName(_classThis, "AriaExpanded");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        _enabled_decorators = [aurelia.bindable()];
        _mode_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AriaExpanded = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attribute = 'aria-expanded';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AriaExpanded = _classThis;
})();

exports.HiddenChannels = void 0;
(function (HiddenChannels) {
    HiddenChannels["main"] = "aria:hidden:main";
    HiddenChannels["ended"] = "aria:hidden:ended";
})(exports.HiddenChannels || (exports.HiddenChannels = {}));
exports.HiddenModes = void 0;
(function (HiddenModes) {
    HiddenModes["true"] = "true";
    HiddenModes["false"] = "false";
})(exports.HiddenModes || (exports.HiddenModes = {}));

let AriaHidden = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-aria-hidden")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    var AriaHidden = _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, true));
            this.mode = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _mode_initializers, exports.HiddenModes.true));
            this.disposable = __runInitializers(this, _mode_extraInitializers);
            this.onAriaHidden = (data) => {
                if (data.name == this.name) {
                    this.logger.trace('onAriaHidden');
                    this.mode = data.mode;
                    const message = {
                        name: this.name,
                        mode: this.mode,
                        action: data.action
                    };
                    if (data.action === exports.HtmlActions.define) {
                        message.action = this.defineHidden();
                    }
                    else if (data.action === exports.HtmlActions.remove) {
                        message.action = this.removeHidden();
                    }
                    else {
                        throw new Error('AriaHidden: action not supported');
                    }
                    this.platform.taskQueue.queueTask(() => {
                        this.ea.publish(exports.HiddenChannels.ended, message);
                    });
                }
            };
            this.logger = logger.scopeTo('AriaHidden');
            this.logger.trace('constructor');
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.HiddenChannels.main, this.onAriaHidden);
            if (this.enabled) {
                this.defineHidden();
            }
        }
        dispose() {
            this.logger.trace('dispose');
            this.disposable.dispose();
        }
        removeHidden() {
            this.element.removeAttribute(AriaHidden.attribute);
            return exports.HtmlActions.remove;
        }
        defineHidden() {
            if (this.mode === exports.HiddenModes.true) {
                this.element.setAttribute(AriaHidden.attribute, this.mode);
                return exports.HtmlActions.define;
            }
            else if (this.mode === exports.HiddenModes.false) {
                return this.removeHidden();
            }
            throw new Error('AriaHidden: mode not supported');
        }
    };
    __setFunctionName(_classThis, "AriaHidden");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        _enabled_decorators = [aurelia.bindable()];
        _mode_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AriaHidden = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attribute = 'aria-hidden';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AriaHidden = _classThis;
})();

exports.InvalidChannels = void 0;
(function (InvalidChannels) {
    InvalidChannels["main"] = "aria:invalid:main";
    InvalidChannels["ended"] = "aria:invalid:ended";
})(exports.InvalidChannels || (exports.InvalidChannels = {}));
exports.InvalidModes = void 0;
(function (InvalidModes) {
    InvalidModes["true"] = "true";
    InvalidModes["false"] = "false";
})(exports.InvalidModes || (exports.InvalidModes = {}));

let AriaInvalid = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-aria-invalid")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _describedByEnabled_decorators;
    let _describedByEnabled_initializers = [];
    let _describedByEnabled_extraInitializers = [];
    let _describedById_decorators;
    let _describedById_initializers = [];
    let _describedById_extraInitializers = [];
    let _labelledByEnabled_decorators;
    let _labelledByEnabled_initializers = [];
    let _labelledByEnabled_extraInitializers = [];
    let _labelledById_decorators;
    let _labelledById_initializers = [];
    let _labelledById_extraInitializers = [];
    var AriaInvalid = _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, true));
            this.mode = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _mode_initializers, exports.InvalidModes.false));
            this.describedByEnabled = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _describedByEnabled_initializers, true));
            this.describedById = (__runInitializers(this, _describedByEnabled_extraInitializers), __runInitializers(this, _describedById_initializers, void 0));
            this.labelledByEnabled = (__runInitializers(this, _describedById_extraInitializers), __runInitializers(this, _labelledByEnabled_initializers, false));
            this.labelledById = (__runInitializers(this, _labelledByEnabled_extraInitializers), __runInitializers(this, _labelledById_initializers, void 0));
            this.form = __runInitializers(this, _labelledById_extraInitializers);
            this.onAriaInvalid = (data) => {
                let reducedData;
                let form = null;
                if (Array.isArray(data)) {
                    form = data.reduce((previousValue, currentValue, currentIndex) => {
                        if (previousValue === null && currentValue.form instanceof HTMLFormElement) {
                            return currentValue.form;
                        }
                        else {
                            return previousValue;
                        }
                    }, null);
                    reducedData = data.reduce((previousValue, currentValue, currentIndex) => {
                        if (currentValue.name === this.name) {
                            if (previousValue === undefined) {
                                return currentValue;
                            }
                            else {
                                if (previousValue.action !== currentValue.action) {
                                    throw new Error('AriaInvalid: multiple actions defined for the same name');
                                }
                                let finalValue = currentValue;
                                if (previousValue.mode === exports.InvalidModes.true || currentValue.mode === exports.InvalidModes.true) {
                                    finalValue.mode = exports.InvalidModes.true;
                                }
                                return finalValue;
                            }
                        }
                        else {
                            return previousValue;
                        }
                    }, undefined);
                }
                else {
                    if (data.form instanceof HTMLFormElement) {
                        form = data.form;
                    }
                    reducedData = data;
                }
                // if we are in form and the form is identical to the one that triggered the event
                if (reducedData !== undefined && reducedData.name == this.name && (form !== null && form === this.form)) {
                    this.logger.trace('onAriaInvalid');
                    this.mode = reducedData.mode;
                    const message = {
                        name: this.name,
                        mode: reducedData.mode,
                        action: reducedData.action
                    };
                    if (reducedData.action === exports.HtmlActions.define) {
                        message.action = this.defineInvalid();
                    }
                    else if (reducedData.action === exports.HtmlActions.remove) {
                        message.action = this.removeInvalid();
                    }
                    else {
                        throw new Error('AriaInvalid: action not supported');
                    }
                    this.platform.taskQueue.queueTask(() => {
                        this.ea.publish(exports.InvalidChannels.ended, message);
                    });
                }
            };
            this.logger = logger.scopeTo('AriaInvalid');
            this.logger.trace('constructor');
        }
        static convertErrors(resuts, form = null) {
            const errors = [];
            resuts.forEach((result) => {
                let propertyName = undefined;
                if (typeof (result.propertyName) === 'string') {
                    propertyName = result.propertyName;
                }
                else if (typeof (result.propertyName) === 'number') {
                    propertyName = result.propertyName.toString();
                }
                if (propertyName) {
                    const error = {
                        name: propertyName,
                        mode: result.valid ? exports.InvalidModes.false : exports.InvalidModes.true,
                        action: exports.HtmlActions.define
                    };
                    if (form !== null && form instanceof HTMLFormElement) {
                        error.form = form;
                    }
                    errors.push(error);
                }
            });
            return errors;
        }
        attached() {
            this.logger.trace('attached');
            this.form = this.element.closest('form');
            this.disposable = this.ea.subscribe(exports.InvalidChannels.main, this.onAriaInvalid);
            const describedById = this.element.getAttribute(AriaInvalid.describedByAttribute);
            if (describedById !== null && describedById !== '') {
                this.describedById = describedById;
            }
            else {
                this.describedById = this.name;
            }
            const labelledById = this.element.getAttribute(AriaInvalid.labelledByAttribute);
            if (labelledById !== null && labelledById !== '') {
                this.labelledById = labelledById;
            }
            else {
                this.labelledById = this.name + 'Label';
            }
            if (this.enabled) {
                this.defineInvalid();
            }
        }
        dispose() {
            this.logger.trace('dispose');
            if (this.disposable) {
                this.disposable.dispose();
            }
        }
        removeInvalid() {
            this.element.removeAttribute(AriaInvalid.attribute);
            this.element.removeAttribute(AriaInvalid.describedByAttribute);
            this.element.removeAttribute(AriaInvalid.labelledByAttribute);
            return exports.HtmlActions.remove;
        }
        defineInvalid() {
            if (this.mode === exports.InvalidModes.true) {
                this.element.setAttribute(AriaInvalid.attribute, this.mode);
                if (this.describedByEnabled) {
                    this.element.setAttribute(AriaInvalid.describedByAttribute, this.describedById);
                }
                else {
                    this.element.removeAttribute(AriaInvalid.describedByAttribute);
                }
                if (this.labelledByEnabled) {
                    this.element.setAttribute(AriaInvalid.labelledByAttribute, this.labelledById);
                }
                else {
                    this.element.removeAttribute(AriaInvalid.labelledByAttribute);
                }
                return exports.HtmlActions.define;
            }
            else if (this.mode === exports.InvalidModes.false) {
                return this.removeInvalid();
            }
            throw new Error('AriaInvalid: mode not supported');
        }
    };
    __setFunctionName(_classThis, "AriaInvalid");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        _enabled_decorators = [aurelia.bindable()];
        _mode_decorators = [aurelia.bindable()];
        _describedByEnabled_decorators = [aurelia.bindable()];
        _describedById_decorators = [aurelia.bindable()];
        _labelledByEnabled_decorators = [aurelia.bindable()];
        _labelledById_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
        __esDecorate(null, null, _describedByEnabled_decorators, { kind: "field", name: "describedByEnabled", static: false, private: false, access: { has: obj => "describedByEnabled" in obj, get: obj => obj.describedByEnabled, set: (obj, value) => { obj.describedByEnabled = value; } }, metadata: _metadata }, _describedByEnabled_initializers, _describedByEnabled_extraInitializers);
        __esDecorate(null, null, _describedById_decorators, { kind: "field", name: "describedById", static: false, private: false, access: { has: obj => "describedById" in obj, get: obj => obj.describedById, set: (obj, value) => { obj.describedById = value; } }, metadata: _metadata }, _describedById_initializers, _describedById_extraInitializers);
        __esDecorate(null, null, _labelledByEnabled_decorators, { kind: "field", name: "labelledByEnabled", static: false, private: false, access: { has: obj => "labelledByEnabled" in obj, get: obj => obj.labelledByEnabled, set: (obj, value) => { obj.labelledByEnabled = value; } }, metadata: _metadata }, _labelledByEnabled_initializers, _labelledByEnabled_extraInitializers);
        __esDecorate(null, null, _labelledById_decorators, { kind: "field", name: "labelledById", static: false, private: false, access: { has: obj => "labelledById" in obj, get: obj => obj.labelledById, set: (obj, value) => { obj.labelledById = value; } }, metadata: _metadata }, _labelledById_initializers, _labelledById_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AriaInvalid = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attribute = 'aria-invalid';
    _classThis.describedByAttribute = 'aria-describedby';
    _classThis.labelledByAttribute = 'aria-labelledby';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AriaInvalid = _classThis;
})();

exports.LabelChannels = void 0;
(function (LabelChannels) {
    LabelChannels["main"] = "aria:label:main";
    LabelChannels["ended"] = "aria:label:ended";
})(exports.LabelChannels || (exports.LabelChannels = {}));

let AriaLabel = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-aria-label")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _label_decorators;
    let _label_initializers = [];
    let _label_extraInitializers = [];
    var AriaLabel = _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, true));
            this.label = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _label_initializers, ''));
            this.disposable = __runInitializers(this, _label_extraInitializers);
            this.onAriaLabel = (data) => {
                if (data.name === this.name) {
                    const message = {
                        name: this.name,
                        action: data.action
                    };
                    if (data.label && data.label !== '') {
                        message.label = data.label;
                        this.label = data.label;
                    }
                    else {
                        this.label = '';
                    }
                    if (data.action === exports.HtmlActions.define) {
                        message.action = this.defineLabel();
                    }
                    else if (data.action === exports.HtmlActions.remove) {
                        message.action = this.removeLabel();
                    }
                    else {
                        throw new Error('AriaLabel: action not supported');
                    }
                    this.platform.taskQueue.queueTask(() => {
                        this.ea.publish(exports.LabelChannels.ended, message);
                    });
                }
            };
            this.logger = logger.scopeTo('AriaLabel');
            this.logger.trace('constructor');
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.LabelChannels.main, this.onAriaLabel);
            if (this.enabled) {
                this.defineLabel();
            }
        }
        dispose() {
            this.logger.trace('dispose');
            this.disposable.dispose();
        }
        removeLabel() {
            this.element.removeAttribute(AriaLabel.attribute);
            return exports.HtmlActions.remove;
        }
        defineLabel() {
            if (this.label !== '') {
                this.element.setAttribute(AriaLabel.attribute, this.label);
                return exports.HtmlActions.define;
            }
            else {
                return this.removeLabel();
            }
        }
    };
    __setFunctionName(_classThis, "AriaLabel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        _enabled_decorators = [aurelia.bindable()];
        _label_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _label_decorators, { kind: "field", name: "label", static: false, private: false, access: { has: obj => "label" in obj, get: obj => obj.label, set: (obj, value) => { obj.label = value; } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AriaLabel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attribute = 'aria-label';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AriaLabel = _classThis;
})();

exports.LiveChannels = void 0;
(function (LiveChannels) {
    LiveChannels["main"] = "aria:live:main";
    LiveChannels["ended"] = "aria:live:ended";
})(exports.LiveChannels || (exports.LiveChannels = {}));
exports.LiveModes = void 0;
(function (LiveModes) {
    LiveModes["off"] = "off";
    LiveModes["polite"] = "polite";
    LiveModes["assertive"] = "assertive";
})(exports.LiveModes || (exports.LiveModes = {}));

let AriaLive = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-aria-live")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    var AriaLive = _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.mode = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _mode_initializers, exports.LiveModes.polite));
            this.enabled = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _enabled_initializers, true));
            this.disposable = __runInitializers(this, _enabled_extraInitializers);
            this.onAriaLive = (data) => {
                if (data.name === this.name) {
                    this.mode = data.mode;
                    const message = {
                        name: this.name,
                        mode: this.mode,
                        action: data.action
                    };
                    if (data.action === exports.HtmlActions.define) {
                        message.action = this.defineLive();
                    }
                    else if (data.action === exports.HtmlActions.remove) {
                        message.action = this.removeLive();
                    }
                    else {
                        throw new Error('AriaLive: action not supported');
                    }
                    this.platform.taskQueue.queueTask(() => {
                        this.ea.publish(exports.LiveChannels.ended, message);
                    });
                }
            };
            this.logger = logger.scopeTo('AriaLive');
            this.logger.trace('constructor');
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.LiveChannels.main, this.onAriaLive);
            if (this.enabled) {
                if (this.mode !== exports.LiveModes.off) {
                    this.element.setAttribute(AriaLive.attribute, this.mode);
                }
                else {
                    this.element.removeAttribute(AriaLive.attribute);
                }
            }
        }
        dispose() {
            this.logger.trace('dispose');
            this.disposable.dispose();
        }
        removeLive() {
            this.element.removeAttribute(AriaLive.attribute);
            return exports.HtmlActions.remove;
        }
        defineLive() {
            if (this.mode !== exports.LiveModes.off) {
                this.element.setAttribute(AriaLive.attribute, this.mode);
                return exports.HtmlActions.define;
            }
            else {
                return this.removeLive();
            }
        }
    };
    __setFunctionName(_classThis, "AriaLive");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        _mode_decorators = [aurelia.bindable()];
        _enabled_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AriaLive = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attribute = 'aria-live';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AriaLive = _classThis;
})();

exports.ModalChannels = void 0;
(function (ModalChannels) {
    ModalChannels["main"] = "aria:modal:main";
    ModalChannels["ended"] = "aria:modal:ended";
})(exports.ModalChannels || (exports.ModalChannels = {}));
exports.ModalModes = void 0;
(function (ModalModes) {
    ModalModes["true"] = "true";
    ModalModes["false"] = "false";
})(exports.ModalModes || (exports.ModalModes = {}));
exports.ModalRoles = void 0;
(function (ModalRoles) {
    ModalRoles["dialog"] = "dialog";
    ModalRoles["alertdialog"] = "alertdialog";
})(exports.ModalRoles || (exports.ModalRoles = {}));

let AriaModal = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-aria-modal")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _tabindexEnabled_decorators;
    let _tabindexEnabled_initializers = [];
    let _tabindexEnabled_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    var AriaModal = _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, true));
            this.tabindexEnabled = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _tabindexEnabled_initializers, false));
            this.mode = (__runInitializers(this, _tabindexEnabled_extraInitializers), __runInitializers(this, _mode_initializers, exports.ModalModes.false));
            this.role = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _role_initializers, exports.ModalRoles.dialog));
            this.defaultTabindex = (__runInitializers(this, _role_extraInitializers), '');
            this.onAriaModal = (data) => {
                if (data.name == this.name) {
                    this.logger.trace('onAriaModal');
                    this.mode = data.mode;
                    if (data.role) {
                        this.role = data.role;
                    }
                    const message = {
                        name: this.name,
                        mode: this.mode,
                        action: data.action,
                        role: this.role
                    };
                    if (data.action === exports.HtmlActions.define) {
                        message.action = this.defineModal();
                    }
                    else if (data.action === exports.HtmlActions.remove) {
                        message.action = this.removeModal();
                    }
                    else {
                        throw new Error('AriaModal: action not supported');
                    }
                    this.platform.taskQueue.queueTask(() => {
                        this.ea.publish(exports.ModalChannels.ended, message);
                    });
                }
            };
            this.logger = logger.scopeTo('AriaModal');
            this.logger.trace('constructor');
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.ModalChannels.main, this.onAriaModal);
            const currentRole = this.element.getAttribute(AriaModal.roleAttribute);
            if (currentRole !== null && Object.values(exports.ModalRoles).includes(currentRole)) {
                this.role = currentRole;
            }
            if (this.tabindexEnabled) {
                const currentTabindex = this.element.getAttribute(AriaModal.tabindexAttribute);
                if (currentTabindex !== null) {
                    this.defaultTabindex = currentTabindex;
                }
            }
            if (this.enabled) {
                this.defineModal();
            }
        }
        dispose() {
            this.logger.trace('dispose');
            this.disposable.dispose();
        }
        removeModal() {
            this.element.removeAttribute(AriaModal.attribute);
            this.element.removeAttribute(AriaModal.roleAttribute);
            if (this.tabindexEnabled) {
                this.element.setAttribute(AriaModal.tabindexAttribute, '-1');
            }
            return exports.HtmlActions.remove;
        }
        defineModal() {
            if (this.mode === exports.ModalModes.true) {
                this.element.setAttribute(AriaModal.attribute, this.mode);
                this.element.setAttribute(AriaModal.roleAttribute, this.role);
                if (this.tabindexEnabled) {
                    if (this.defaultTabindex && this.defaultTabindex !== '') {
                        this.element.setAttribute(AriaModal.tabindexAttribute, this.defaultTabindex);
                    }
                    else {
                        this.element.removeAttribute(AriaModal.tabindexAttribute);
                    }
                }
                return exports.HtmlActions.define;
            }
            else if (this.mode === exports.ModalModes.false) {
                return this.removeModal();
            }
            throw new Error('AriaModal: mode not supported');
        }
    };
    __setFunctionName(_classThis, "AriaModal");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        _enabled_decorators = [aurelia.bindable()];
        _tabindexEnabled_decorators = [aurelia.bindable()];
        _mode_decorators = [aurelia.bindable()];
        _role_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _tabindexEnabled_decorators, { kind: "field", name: "tabindexEnabled", static: false, private: false, access: { has: obj => "tabindexEnabled" in obj, get: obj => obj.tabindexEnabled, set: (obj, value) => { obj.tabindexEnabled = value; } }, metadata: _metadata }, _tabindexEnabled_initializers, _tabindexEnabled_extraInitializers);
        __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AriaModal = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attribute = 'aria-modal';
    _classThis.roleAttribute = 'role';
    _classThis.tabindexAttribute = 'tabindex';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AriaModal = _classThis;
})();

exports.SelectedChannels = void 0;
(function (SelectedChannels) {
    SelectedChannels["main"] = "aria:selected:main";
    SelectedChannels["ended"] = "aria:selected:ended";
})(exports.SelectedChannels || (exports.SelectedChannels = {}));
exports.SelectedModes = void 0;
(function (SelectedModes) {
    SelectedModes["true"] = "true";
    SelectedModes["false"] = "false";
})(exports.SelectedModes || (exports.SelectedModes = {}));

let AriaSelected = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-aria-selected")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    var AriaSelected = _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, true));
            this.mode = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _mode_initializers, exports.SelectedModes.false));
            this.disposable = __runInitializers(this, _mode_extraInitializers);
            this.onAriaSelected = (data) => {
                if (data.name == this.name) {
                    this.logger.trace('onAriaSelected');
                    this.mode = data.mode;
                    const message = {
                        name: this.name,
                        mode: this.mode,
                        action: data.action
                    };
                    if (data.action === exports.HtmlActions.define) {
                        message.action = this.defineSelected();
                    }
                    else if (data.action === exports.HtmlActions.remove) {
                        message.action = this.removeSelected();
                    }
                    else {
                        throw new Error('AriaSelected: action not supported');
                    }
                    this.platform.taskQueue.queueTask(() => {
                        this.ea.publish(exports.SelectedChannels.ended, message);
                    });
                }
            };
            this.logger = logger.scopeTo('AriaSelected');
            this.logger.trace('constructor');
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.SelectedChannels.main, this.onAriaSelected);
            if (this.enabled) {
                this.defineSelected();
            }
        }
        dispose() {
            this.logger.trace('dispose');
            this.disposable.dispose();
        }
        removeSelected() {
            this.element.removeAttribute(AriaSelected.attribute);
            return exports.HtmlActions.remove;
        }
        defineSelected() {
            if (this.mode === exports.SelectedModes.false) {
                return this.removeSelected();
            }
            this.element.setAttribute(AriaSelected.attribute, this.mode);
            return exports.HtmlActions.define;
        }
    };
    __setFunctionName(_classThis, "AriaSelected");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        _enabled_decorators = [aurelia.bindable()];
        _mode_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AriaSelected = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attribute = 'aria-selected';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AriaSelected = _classThis;
})();

exports.FocusChannels = void 0;
(function (FocusChannels) {
    FocusChannels["main"] = "html:focus:main";
    FocusChannels["ended"] = "html:focus:ended";
})(exports.FocusChannels || (exports.FocusChannels = {}));

let Focus = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-focus")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger), options = aurelia.resolve(IAriaConfiguration), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.options = options;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, false));
            this.disposable = __runInitializers(this, _enabled_extraInitializers);
            this.onFocus = (data) => {
                if (data.name === this.name) {
                    const message = {
                        name: this.name,
                        action: data.action
                    };
                    if (data.action === exports.HtmlActions.define) {
                        message.action = this.defineFocus();
                    }
                    else if (data.action === exports.HtmlActions.remove) {
                        message.action = this.removeFocus();
                    }
                    this.ea.publish(exports.FocusChannels.ended, message);
                }
            };
            this.logger = logger.scopeTo('Focus');
            this.logger.trace('constructor');
            this.focusDelay = this.options.get('focusDelay');
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.FocusChannels.main, this.onFocus);
            if (this.enabled) {
                this.platform.taskQueue.queueTask(() => {
                    this.platform.requestAnimationFrame(() => {
                        this.element.focus();
                    });
                }, { delay: this.focusDelay });
            }
        }
        detached() {
            this.logger.trace('detached');
        }
        dispose() {
            this.logger.trace('dispose');
            this.disposable.dispose();
        }
        removeFocus() {
            this.platform.taskQueue.queueTask(() => {
                this.platform.requestAnimationFrame(() => {
                    this.element.blur();
                });
            }, { delay: this.focusDelay });
            return exports.HtmlActions.remove;
        }
        defineFocus() {
            this.platform.taskQueue.queueTask(() => {
                this.platform.requestAnimationFrame(() => {
                    this.element.focus();
                });
            }, { delay: this.focusDelay });
            return exports.HtmlActions.define;
        }
    };
    __setFunctionName(_classThis, "Focus");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        _enabled_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attribute = 'focus';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

exports.TabindexChannels = void 0;
(function (TabindexChannels) {
    TabindexChannels["main"] = "html:tabindex:main";
    TabindexChannels["ended"] = "html:tabindex:ended";
})(exports.TabindexChannels || (exports.TabindexChannels = {}));

let Tabindex = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-tabindex")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _enabledDisabled_decorators;
    let _enabledDisabled_initializers = [];
    let _enabledDisabled_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    var Tabindex = _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, true));
            this.enabledDisabled = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _enabledDisabled_initializers, false));
            this.value = (__runInitializers(this, _enabledDisabled_extraInitializers), __runInitializers(this, _value_initializers, ''));
            this.disposable = __runInitializers(this, _value_extraInitializers);
            this.previousValue = '';
            this.onTabindex = (data) => {
                if (data.name === this.name) {
                    const message = {
                        name: this.name,
                        action: data.action,
                        value: data.value,
                    };
                    if (data.action === exports.HtmlActions.define) {
                        this.rotateTabindex(data.value);
                    }
                    else if (data.action === exports.HtmlActions.remove) {
                        this.rotateTabindex('');
                    }
                    message.value = this.value;
                    if (this.value !== '' && exports.HtmlActions.define === data.action) {
                        message.action = this.defineTabindex();
                    }
                    else if (this.value === '' || exports.HtmlActions.remove === data.action) {
                        message.action = this.removeTabindex();
                    }
                    this.platform.taskQueue.queueTask(() => {
                        this.ea.publish(exports.TabindexChannels.ended, message);
                    });
                }
            };
            this.logger = logger.scopeTo('AriaTabindexDisabled');
            this.logger.trace('constructor');
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.TabindexChannels.main, this.onTabindex);
            if (this.element.hasAttribute(Tabindex.attribute)) {
                this.value = this.element.getAttribute(Tabindex.attribute);
            }
            if (this.enabled) {
                this.defineTabindex();
            }
        }
        dispose() {
            this.logger.trace('dispose');
            this.disposable.dispose();
        }
        rotateTabindex(value) {
            if (value === 'revert' || value === '') {
                [this.previousValue, this.value] = [this.value, this.previousValue];
            }
            else if (value !== '') {
                [this.previousValue, this.value] = [this.value, value];
            }
        }
        removeTabindex() {
            this.element.removeAttribute(Tabindex.attribute);
            if (this.enabledDisabled) {
                this.element.removeAttribute(Tabindex.disabledAttribute);
            }
            return exports.HtmlActions.remove;
        }
        defineTabindex() {
            if (this.value === '') {
                return this.removeTabindex();
            }
            else if (this.value === '-1') {
                this.element.setAttribute(Tabindex.attribute, this.value);
                if (this.enabledDisabled) {
                    this.element.setAttribute(Tabindex.disabledAttribute, 'true');
                }
            }
            else {
                this.element.setAttribute(Tabindex.attribute, this.value);
                if (this.enabledDisabled) {
                    this.element.removeAttribute(Tabindex.disabledAttribute);
                }
            }
            return exports.HtmlActions.define;
        }
    };
    __setFunctionName(_classThis, "Tabindex");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        _enabled_decorators = [aurelia.bindable()];
        _enabledDisabled_decorators = [aurelia.bindable()];
        _value_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _enabledDisabled_decorators, { kind: "field", name: "enabledDisabled", static: false, private: false, access: { has: obj => "enabledDisabled" in obj, get: obj => obj.enabledDisabled, set: (obj, value) => { obj.enabledDisabled = value; } }, metadata: _metadata }, _enabledDisabled_initializers, _enabledDisabled_extraInitializers);
        __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Tabindex = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attribute = 'tabindex';
    _classThis.disabledAttribute = 'aria-disabled';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Tabindex = _classThis;
})();

exports.TrapFocusChannels = void 0;
(function (TrapFocusChannels) {
    TrapFocusChannels["main"] = "html:trapfocus:main";
    TrapFocusChannels["ended"] = "html:trapfocus:ended";
    TrapFocusChannels["keydown"] = "html:trapfocus:keydown";
})(exports.TrapFocusChannels || (exports.TrapFocusChannels = {}));

let TrapFocus = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-trap-focus")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    var TrapFocus = _classThis = class {
        constructor(options = aurelia.resolve(IAriaConfiguration), logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.options = options;
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, false));
            this.disposable = __runInitializers(this, _enabled_extraInitializers);
            this.focusableElements = [];
            this.currentFocusedIndex = 0;
            this.currentGroups = [];
            this.availableGroups = [];
            this.keysMonitored = [];
            this.focusableElementsQuerySelector = '';
            this.lastFocusedElement = null;
            this.keepFocus = false;
            this.onFocusIn = (event) => {
                if (this.enabled) {
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
                }
            };
            this.onKeyDown = (event) => {
                if (event.key === 'Tab') {
                    if (this.enabled) {
                        this.logger.trace('onKeyDown: handle Tab key');
                        event.preventDefault();
                        if (event.shiftKey) {
                            this.currentFocusedIndex--;
                            if (this.currentFocusedIndex < 0) {
                                this.currentFocusedIndex = this.focusableElements.length - 1;
                            }
                        }
                        else {
                            this.currentFocusedIndex++;
                            if (this.currentFocusedIndex >= this.focusableElements.length) {
                                this.currentFocusedIndex = 0;
                            }
                        }
                        this.focusElementByIndex(this.currentFocusedIndex);
                    }
                }
                else if (this.keysMonitored.includes(event.key)) {
                    event.preventDefault();
                    const message = {
                        name: this.name,
                        code: event.code,
                        shiftKey: event.shiftKey,
                        group: this.getGroups()
                    };
                    this.ea.publish(exports.TrapFocusChannels.keydown, message);
                }
            };
            this.onTrapFocus = (data) => {
                if (data.name === this.name) {
                    const message = {
                        name: this.name,
                        action: data.action,
                    };
                    if (this.handleGroups()) {
                        if (typeof data.groups === 'string') {
                            this.setGroups(data.groups);
                        }
                        else if (data.groups === false) {
                            this.resetGroups();
                        }
                        message.groups = this.getGroups();
                        if (data.keepFocus && data.keepFocus === true) {
                            // get first goup of the list
                            this.keepFocus = true;
                        }
                    }
                    if (data.action === exports.HtmlActions.define) {
                        message.action = this.defineTrapFocus();
                    }
                    else if (data.action === exports.HtmlActions.remove) {
                        message.action = this.removeTrapFocus();
                    }
                    else {
                        throw new Error('TrapFocus: action not supported');
                    }
                    this.ea.publish(exports.TrapFocusChannels.ended, message);
                }
            };
            this.defineTrapFocus = () => {
                this.initFocusableElementsList();
                // focusable elements list is ready
                if (this.handleGroups()) {
                    if (this.keepFocus) {
                        if (this.lastFocusedElement) {
                            const previousFocusedElementIndex = this.getFocusableElementIndex(this.lastFocusedElement);
                            if (previousFocusedElementIndex !== -1) {
                                this.currentFocusedIndex = previousFocusedElementIndex;
                            }
                        }
                        this.keepFocus = false;
                    }
                }
                this.focusElementByIndex(this.currentFocusedIndex);
                return this.enabled ? exports.HtmlActions.define : exports.HtmlActions.remove;
            };
            this.removeTrapFocus = () => {
                this.enabled = false;
                this.focusableElements = [];
                this.currentFocusedIndex = 0;
                this.resetGroups();
                return exports.HtmlActions.remove;
            };
            this.logger = logger.scopeTo('TrapFocus');
            this.logger.trace('constructor');
            this.keysMonitored = this.options.get('keysMonitored');
            this.focusDelay = this.options.get('focusDelay');
            this.focusableElementsQuerySelector = this.options.get('focusableElementsQuerySelector');
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.TrapFocusChannels.main, this.onTrapFocus);
            this.initAvailableGroups();
            this.element.addEventListener('keydown', this.onKeyDown);
            this.element.addEventListener('focusin', this.onFocusIn);
        }
        detached() {
            this.logger.trace('detached');
            this.element.removeEventListener('keydown', this.onKeyDown);
            this.element.removeEventListener('focusin', this.onFocusIn);
            this.removeTrapFocus();
        }
        dispose() {
            this.logger.trace('dispose');
            this.disposable.dispose();
        }
        initFocusableElementsList() {
            this.logger.trace('initFocusableElementsList');
            this.focusableElements = [];
            this.currentFocusedIndex = 0;
            const focusableElements = this.element.querySelectorAll(this.focusableElementsQuerySelector);
            focusableElements.forEach((element) => {
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
        focusElementByIndex(elementIndex) {
            if (elementIndex >= 0 && elementIndex < this.focusableElements.length) {
                this.enabled = true;
                this.platform.taskQueue.queueTask(() => {
                    this.platform.requestAnimationFrame(() => {
                        this.logger.trace('focusElementByIndex', elementIndex);
                        this.focusableElements[elementIndex].focus();
                    });
                }, { delay: this.focusDelay });
            }
        }
        getFocusableElementIndex(element) {
            return this.focusableElements.indexOf(element);
        }
        extractGroups(groups) {
            return groups.split(/\s+/);
        }
        getGroups() {
            if (this.currentGroups.length === 0) {
                return false;
            }
            else {
                return this.currentGroups.join(' ');
            }
        }
        setGroups(groupsString) {
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
        hasGroups(groupsString) {
            if (this.handleGroups()) {
                if (this.currentGroups.length === 0) {
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
        resetGroups() {
            if (this.handleGroups()) {
                this.currentGroups = [];
            }
        }
        initAvailableGroups() {
            const focusableElements = this.element.querySelectorAll(this.focusableElementsQuerySelector);
            focusableElements.forEach((element) => {
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
        handleGroups() {
            return this.availableGroups.length > 0;
        }
    };
    __setFunctionName(_classThis, "TrapFocus");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        _enabled_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrapFocus = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attributeGroup = 'trap-focus-group';
    _classThis.attribute = 'trap-focus';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrapFocus = _classThis;
})();

exports.InvalidFocusChannels = void 0;
(function (InvalidFocusChannels) {
    InvalidFocusChannels["main"] = "html:invalidfocus:main";
    InvalidFocusChannels["ended"] = "html:invalidfocus:ended";
})(exports.InvalidFocusChannels || (exports.InvalidFocusChannels = {}));

let InvalidFocus = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-invalid-focus")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    _classThis = class {
        constructor(options = aurelia.resolve(IAriaConfiguration), logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.options = options;
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.disposable = __runInitializers(this, _name_extraInitializers);
            this.invalidElementsQuerySelector = '';
            this.onInvalidFocus = (data) => {
                if (data.name === this.name) {
                    const message = {
                        name: this.name,
                        action: data.action,
                    };
                    this.platform.taskQueue.queueTask(() => {
                        if (data.action === exports.HtmlActions.define) {
                            message.action = this.defineInvalidFocus();
                        }
                        else if (data.action === exports.HtmlActions.remove) {
                            message.action = this.removeInvalidFocus();
                        }
                        else {
                            throw new Error('InvalidFocus: action not supported');
                        }
                        this.ea.publish(exports.InvalidFocusChannels.ended, message);
                    }, { delay: 100 });
                }
            };
            this.logger = logger.scopeTo('InvalidFocus');
            this.logger.trace('constructor');
            this.invalidElementsQuerySelector = this.options.get('invalidElementsQuerySelector');
            this.focusDelay = this.options.get('focusDelay');
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.InvalidFocusChannels.main, this.onInvalidFocus);
        }
        detached() {
            this.logger.trace('detached');
        }
        dispose() {
            this.logger.trace('dispose');
            this.disposable.dispose();
        }
        removeInvalidFocus() {
            const targetElement = this.element.querySelector(':focus');
            if (targetElement !== null) {
                this.platform.taskQueue.queueTask(() => {
                    this.platform.requestAnimationFrame(() => {
                        targetElement.blur();
                    });
                }, { delay: this.focusDelay });
            }
            return exports.HtmlActions.remove;
        }
        defineInvalidFocus() {
            const targetElement = this.element.querySelector(this.invalidElementsQuerySelector);
            if (targetElement !== null) {
                this.platform.taskQueue.queueTask(() => {
                    this.platform.requestAnimationFrame(() => {
                        targetElement.focus();
                    });
                }, { delay: this.focusDelay });
            }
            return exports.HtmlActions.define;
        }
    };
    __setFunctionName(_classThis, "InvalidFocus");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [aurelia.bindable({ primary: true })];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.attribute = 'invalid-focus';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

exports.RollbackFocusChannels = void 0;
(function (RollbackFocusChannels) {
    RollbackFocusChannels["main"] = "html:rollbackFocus:main";
    RollbackFocusChannels["change"] = "html:rollbackFocus:change";
    RollbackFocusChannels["ended"] = "html:rollbackFocus:ended";
})(exports.RollbackFocusChannels || (exports.RollbackFocusChannels = {}));

let RollbackFocus = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-rollback-focus")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _event_decorators;
    let _event_initializers = [];
    let _event_extraInitializers = [];
    _classThis = class {
        constructor(element = aurelia.resolve(aurelia.INode), logger = aurelia.resolve(aurelia.ILogger), ea = aurelia.resolve(aurelia.IEventAggregator)) {
            this.element = element;
            this.logger = logger;
            this.ea = ea;
            this.event = __runInitializers(this, _event_initializers, 'click');
            this.subscriptionListenRollbackFocus = (__runInitializers(this, _event_extraInitializers), null);
            this.subscriptionChangeRollbackFocus = null;
            this.onEvent = (event) => {
                this.logger.trace('onClick', event);
                const message = {
                    element: this.element,
                };
                this.ea.publish(exports.RollbackFocusChannels.change, message);
                this.subscriptionListenRollbackFocus = this.ea.subscribe(exports.RollbackFocusChannels.main, this.onRollbackFocus);
            };
            this.onRollbackFocus = (data) => {
                var _a;
                this.logger.trace('onRollbackFocus', data);
                // @ts-ignore
                this.element.focus();
                (_a = this.subscriptionListenRollbackFocus) === null || _a === void 0 ? void 0 : _a.dispose();
                this.subscriptionListenRollbackFocus = null;
                const message = {
                    element: this.element,
                };
                this.ea.publish(exports.RollbackFocusChannels.ended, message);
            };
            this.onRollbackFocusChangeCurrent = (data) => {
                var _a;
                this.logger.trace('onRollbackFocusChangeCurrent', data);
                // if this element is not the current element, we dispose the subscription
                if (data.element && data.element !== this.element) {
                    this.logger.trace('onRollbackFocusCurrent Dispose', data);
                    (_a = this.subscriptionListenRollbackFocus) === null || _a === void 0 ? void 0 : _a.dispose();
                    this.subscriptionListenRollbackFocus = null;
                }
            };
            this.logger = logger.scopeTo('RollbackFocus');
            this.logger.trace('constructor');
        }
        attaching() {
            this.logger.trace('attaching');
            if (this.event === '') {
                this.event = 'click';
            }
        }
        attached() {
            this.logger.trace('attached');
            this.element.addEventListener(this.event, this.onEvent);
            this.subscriptionChangeRollbackFocus = this.ea.subscribe(exports.RollbackFocusChannels.change, this.onRollbackFocusChangeCurrent);
        }
        detached() {
            var _a;
            this.logger.trace('detached');
            this.element.removeEventListener(this.event, this.onEvent);
            (_a = this.subscriptionChangeRollbackFocus) === null || _a === void 0 ? void 0 : _a.dispose();
        }
        dispose() {
            var _a, _b;
            this.logger.trace('dispose');
            (_a = this.subscriptionListenRollbackFocus) === null || _a === void 0 ? void 0 : _a.dispose();
            this.subscriptionListenRollbackFocus = null;
            (_b = this.subscriptionChangeRollbackFocus) === null || _b === void 0 ? void 0 : _b.dispose();
            this.subscriptionChangeRollbackFocus = null;
        }
    };
    __setFunctionName(_classThis, "RollbackFocus");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _event_decorators = [aurelia.bindable({ primary: true })];
        __esDecorate(null, null, _event_decorators, { kind: "field", name: "event", static: false, private: false, access: { has: obj => "event" in obj, get: obj => obj.event, set: (obj, value) => { obj.event = value; } }, metadata: _metadata }, _event_initializers, _event_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

const DefaultComponents = [
    AriaCurrent,
    AriaExpanded,
    AriaHidden,
    AriaInvalid,
    AriaLabel,
    AriaLive,
    AriaModal,
    AriaSelected,
    Focus,
    Tabindex,
    TrapFocus,
    InvalidFocus,
    RollbackFocus,
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
exports.AriaCurrent = AriaCurrent;
exports.AriaExpanded = AriaExpanded;
exports.AriaHidden = AriaHidden;
exports.AriaInvalid = AriaInvalid;
exports.AriaLabel = AriaLabel;
exports.AriaLive = AriaLive;
exports.AriaModal = AriaModal;
exports.AriaSelected = AriaSelected;
exports.Focus = Focus;
exports.IAriaConfiguration = IAriaConfiguration;
exports.InvalidFocus = InvalidFocus;
exports.RollbackFocus = RollbackFocus;
exports.Tabindex = Tabindex;
exports.TrapFocus = TrapFocus;
//# sourceMappingURL=index.js.map
