import { DI, bindable, customAttribute, ILogger, IEventAggregator, IPlatform, INode } from 'aurelia';

const IAriaConfiguration = DI.createInterface('IAriaConfiguration', x => x.singleton(AriaConfigure));
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


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var HtmlActions;
(function (HtmlActions) {
    HtmlActions["define"] = "define";
    HtmlActions["remove"] = "remove";
})(HtmlActions || (HtmlActions = {}));

var CurrentChannels;
(function (CurrentChannels) {
    CurrentChannels["main"] = "aria:current:main";
    CurrentChannels["ended"] = "aria:current:ended";
})(CurrentChannels || (CurrentChannels = {}));
var CurrentModes;
(function (CurrentModes) {
    CurrentModes["page"] = "page";
    CurrentModes["step"] = "step";
    CurrentModes["location"] = "location";
    CurrentModes["date"] = "date";
    CurrentModes["time"] = "time";
    CurrentModes["true"] = "true";
    CurrentModes["false"] = "false";
})(CurrentModes || (CurrentModes = {}));

var AriaCurrent_1;
let AriaCurrent = AriaCurrent_1 = class AriaCurrent {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.mode = CurrentModes.false;
        this.onAriaCurrent = (data) => {
            if (data.name == this.name) {
                this.logger.trace('onAriaCurrent');
                this.mode = data.mode;
                const message = {
                    name: this.name,
                    mode: this.mode,
                    action: data.action
                };
                if (data.action === HtmlActions.define) {
                    message.action = this.defineCurrent();
                }
                else if (data.action === HtmlActions.remove) {
                    message.action = this.removeCurrent();
                }
                else {
                    throw new Error('AriaCurrent: action not supported');
                }
                this.platform.taskQueue.queueTask(() => {
                    this.ea.publish(CurrentChannels.ended, message);
                });
            }
        };
        this.logger = logger.scopeTo('AriaCurrent');
        this.logger.trace('constructor');
    }
    attached() {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(CurrentChannels.main, this.onAriaCurrent);
        if (this.enabled) {
            this.defineCurrent();
        }
    }
    dispose() {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }
    removeCurrent() {
        this.element.removeAttribute(AriaCurrent_1.attribute);
        return HtmlActions.remove;
    }
    defineCurrent() {
        if (this.mode === CurrentModes.false) {
            return this.removeCurrent();
        }
        this.element.setAttribute(AriaCurrent_1.attribute, this.mode);
        return HtmlActions.define;
    }
};
AriaCurrent.attribute = 'aria-current';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], AriaCurrent.prototype, "name", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], AriaCurrent.prototype, "enabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], AriaCurrent.prototype, "mode", void 0);
AriaCurrent = AriaCurrent_1 = __decorate([
    customAttribute("bc-aria-current"),
    __param(0, ILogger),
    __param(1, IEventAggregator),
    __param(2, IPlatform),
    __param(3, INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], AriaCurrent);

var ExpandedChannels;
(function (ExpandedChannels) {
    ExpandedChannels["main"] = "aria:expanded:main";
    ExpandedChannels["ended"] = "aria:expanded:ended";
})(ExpandedChannels || (ExpandedChannels = {}));
var ExpandedModes;
(function (ExpandedModes) {
    ExpandedModes["true"] = "true";
    ExpandedModes["false"] = "false";
})(ExpandedModes || (ExpandedModes = {}));

var AriaExpanded_1;
let AriaExpanded = AriaExpanded_1 = class AriaExpanded {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.mode = ExpandedModes.false;
        this.onAriaExpand = (data) => {
            if (data.name == this.name) {
                this.logger.trace('onAriaExpand');
                this.mode = data.mode;
                const message = {
                    name: this.name,
                    mode: this.mode,
                    action: data.action
                };
                if (data.action === HtmlActions.define) {
                    message.action = this.defineExpanded();
                }
                else if (data.action === HtmlActions.remove) {
                    message.action = this.removeExpanded();
                }
                else {
                    throw new Error('AriaExpanded: action not supported');
                }
                this.platform.taskQueue.queueTask(() => {
                    this.ea.publish(ExpandedChannels.ended, message);
                });
            }
        };
        this.logger = logger.scopeTo('AriaExpanded');
        this.logger.trace('constructor');
    }
    attached() {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(ExpandedChannels.main, this.onAriaExpand);
        if (this.enabled) {
            this.defineExpanded();
        }
    }
    dispose() {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }
    removeExpanded() {
        this.element.removeAttribute(AriaExpanded_1.attribute);
        return HtmlActions.remove;
    }
    defineExpanded() {
        this.element.setAttribute(AriaExpanded_1.attribute, this.mode);
        return HtmlActions.define;
    }
};
AriaExpanded.attribute = 'aria-expanded';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], AriaExpanded.prototype, "name", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], AriaExpanded.prototype, "enabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], AriaExpanded.prototype, "mode", void 0);
AriaExpanded = AriaExpanded_1 = __decorate([
    customAttribute("bc-aria-expanded"),
    __param(0, ILogger),
    __param(1, IEventAggregator),
    __param(2, IPlatform),
    __param(3, INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], AriaExpanded);

var HiddenChannels;
(function (HiddenChannels) {
    HiddenChannels["main"] = "aria:hidden:main";
    HiddenChannels["ended"] = "aria:hidden:ended";
})(HiddenChannels || (HiddenChannels = {}));
var HiddenModes;
(function (HiddenModes) {
    HiddenModes["true"] = "true";
    HiddenModes["false"] = "false";
})(HiddenModes || (HiddenModes = {}));

var AriaHidden_1;
let AriaHidden = AriaHidden_1 = class AriaHidden {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.mode = HiddenModes.true;
        this.onAriaHidden = (data) => {
            if (data.name == this.name) {
                this.logger.trace('onAriaHidden');
                this.mode = data.mode;
                const message = {
                    name: this.name,
                    mode: this.mode,
                    action: data.action
                };
                if (data.action === HtmlActions.define) {
                    message.action = this.defineHidden();
                }
                else if (data.action === HtmlActions.remove) {
                    message.action = this.removeHidden();
                }
                else {
                    throw new Error('AriaHidden: action not supported');
                }
                this.platform.taskQueue.queueTask(() => {
                    this.ea.publish(HiddenChannels.ended, message);
                });
            }
        };
        this.logger = logger.scopeTo('AriaHidden');
        this.logger.trace('constructor');
    }
    attached() {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(HiddenChannels.main, this.onAriaHidden);
        if (this.enabled) {
            this.defineHidden();
        }
    }
    dispose() {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }
    removeHidden() {
        this.element.removeAttribute(AriaHidden_1.attribute);
        return HtmlActions.remove;
    }
    defineHidden() {
        if (this.mode === HiddenModes.true) {
            this.element.setAttribute(AriaHidden_1.attribute, this.mode);
            return HtmlActions.define;
        }
        else if (this.mode === HiddenModes.false) {
            return this.removeHidden();
        }
        throw new Error('AriaHidden: mode not supported');
    }
};
AriaHidden.attribute = 'aria-hidden';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], AriaHidden.prototype, "name", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], AriaHidden.prototype, "enabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], AriaHidden.prototype, "mode", void 0);
AriaHidden = AriaHidden_1 = __decorate([
    customAttribute("bc-aria-hidden"),
    __param(0, ILogger),
    __param(1, IEventAggregator),
    __param(2, IPlatform),
    __param(3, INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], AriaHidden);

var InvalidChannels;
(function (InvalidChannels) {
    InvalidChannels["main"] = "aria:invalid:main";
    InvalidChannels["ended"] = "aria:invalid:ended";
})(InvalidChannels || (InvalidChannels = {}));
var InvalidModes;
(function (InvalidModes) {
    InvalidModes["true"] = "true";
    InvalidModes["false"] = "false";
})(InvalidModes || (InvalidModes = {}));

var AriaInvalid_1;
let AriaInvalid = AriaInvalid_1 = class AriaInvalid {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.mode = InvalidModes.false;
        this.describedByEnabled = true;
        this.labelledByEnabled = false;
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
                            if (previousValue.mode === InvalidModes.true || currentValue.mode === InvalidModes.true) {
                                finalValue.mode = InvalidModes.true;
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
                if (reducedData.action === HtmlActions.define) {
                    message.action = this.defineInvalid();
                }
                else if (reducedData.action === HtmlActions.remove) {
                    message.action = this.removeInvalid();
                }
                else {
                    throw new Error('AriaInvalid: action not supported');
                }
                this.platform.taskQueue.queueTask(() => {
                    this.ea.publish(InvalidChannels.ended, message);
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
                    mode: result.valid ? InvalidModes.false : InvalidModes.true,
                    action: HtmlActions.define
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
        this.disposable = this.ea.subscribe(InvalidChannels.main, this.onAriaInvalid);
        const describedById = this.element.getAttribute(AriaInvalid_1.describedByAttribute);
        if (describedById !== null && describedById !== '') {
            this.describedById = describedById;
        }
        else {
            this.describedById = this.name;
        }
        const labelledById = this.element.getAttribute(AriaInvalid_1.labelledByAttribute);
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
        this.element.removeAttribute(AriaInvalid_1.attribute);
        this.element.removeAttribute(AriaInvalid_1.describedByAttribute);
        this.element.removeAttribute(AriaInvalid_1.labelledByAttribute);
        return HtmlActions.remove;
    }
    defineInvalid() {
        if (this.mode === InvalidModes.true) {
            this.element.setAttribute(AriaInvalid_1.attribute, this.mode);
            if (this.describedByEnabled) {
                this.element.setAttribute(AriaInvalid_1.describedByAttribute, this.describedById);
            }
            else {
                this.element.removeAttribute(AriaInvalid_1.describedByAttribute);
            }
            if (this.labelledByEnabled) {
                this.element.setAttribute(AriaInvalid_1.labelledByAttribute, this.labelledById);
            }
            else {
                this.element.removeAttribute(AriaInvalid_1.labelledByAttribute);
            }
            return HtmlActions.define;
        }
        else if (this.mode === InvalidModes.false) {
            return this.removeInvalid();
        }
        throw new Error('AriaInvalid: mode not supported');
    }
};
AriaInvalid.attribute = 'aria-invalid';
AriaInvalid.describedByAttribute = 'aria-describedby';
AriaInvalid.labelledByAttribute = 'aria-labelledby';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], AriaInvalid.prototype, "name", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], AriaInvalid.prototype, "enabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], AriaInvalid.prototype, "mode", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], AriaInvalid.prototype, "describedByEnabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], AriaInvalid.prototype, "describedById", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], AriaInvalid.prototype, "labelledByEnabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], AriaInvalid.prototype, "labelledById", void 0);
AriaInvalid = AriaInvalid_1 = __decorate([
    customAttribute("bc-aria-invalid"),
    __param(0, ILogger),
    __param(1, IEventAggregator),
    __param(2, IPlatform),
    __param(3, INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], AriaInvalid);

var LabelChannels;
(function (LabelChannels) {
    LabelChannels["main"] = "aria:label:main";
    LabelChannels["ended"] = "aria:label:ended";
})(LabelChannels || (LabelChannels = {}));

var AriaLabel_1;
let AriaLabel = AriaLabel_1 = class AriaLabel {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.label = '';
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
                if (data.action === HtmlActions.define) {
                    message.action = this.defineLabel();
                }
                else if (data.action === HtmlActions.remove) {
                    message.action = this.removeLabel();
                }
                else {
                    throw new Error('AriaLabel: action not supported');
                }
                this.platform.taskQueue.queueTask(() => {
                    this.ea.publish(LabelChannels.ended, message);
                });
            }
        };
        this.logger = logger.scopeTo('AriaLabel');
        this.logger.trace('constructor');
    }
    attached() {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(LabelChannels.main, this.onAriaLabel);
        if (this.enabled) {
            this.defineLabel();
        }
    }
    dispose() {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }
    removeLabel() {
        this.element.removeAttribute(AriaLabel_1.attribute);
        return HtmlActions.remove;
    }
    defineLabel() {
        if (this.label !== '') {
            this.element.setAttribute(AriaLabel_1.attribute, this.label);
            return HtmlActions.define;
        }
        else {
            return this.removeLabel();
        }
    }
};
AriaLabel.attribute = 'aria-label';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], AriaLabel.prototype, "name", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], AriaLabel.prototype, "enabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], AriaLabel.prototype, "label", void 0);
AriaLabel = AriaLabel_1 = __decorate([
    customAttribute("bc-aria-label"),
    __param(0, ILogger),
    __param(1, IEventAggregator),
    __param(2, IPlatform),
    __param(3, INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], AriaLabel);

var LiveChannels;
(function (LiveChannels) {
    LiveChannels["main"] = "aria:live:main";
    LiveChannels["ended"] = "aria:live:ended";
})(LiveChannels || (LiveChannels = {}));
var LiveModes;
(function (LiveModes) {
    LiveModes["off"] = "off";
    LiveModes["polite"] = "polite";
    LiveModes["assertive"] = "assertive";
})(LiveModes || (LiveModes = {}));

var AriaLive_1;
let AriaLive = AriaLive_1 = class AriaLive {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.mode = LiveModes.polite;
        this.enabled = true;
        this.onAriaLive = (data) => {
            if (data.name === this.name) {
                this.mode = data.mode;
                const message = {
                    name: this.name,
                    mode: this.mode,
                    action: data.action
                };
                if (data.action === HtmlActions.define) {
                    message.action = this.defineLive();
                }
                else if (data.action === HtmlActions.remove) {
                    message.action = this.removeLive();
                }
                else {
                    throw new Error('AriaLive: action not supported');
                }
                this.platform.taskQueue.queueTask(() => {
                    this.ea.publish(LiveChannels.ended, message);
                });
            }
        };
        this.logger = logger.scopeTo('AriaLive');
        this.logger.trace('constructor');
    }
    attached() {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(LiveChannels.main, this.onAriaLive);
        if (this.enabled) {
            if (this.mode !== LiveModes.off) {
                this.element.setAttribute(AriaLive_1.attribute, this.mode);
            }
            else {
                this.element.removeAttribute(AriaLive_1.attribute);
            }
        }
    }
    dispose() {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }
    removeLive() {
        this.element.removeAttribute(AriaLive_1.attribute);
        return HtmlActions.remove;
    }
    defineLive() {
        if (this.mode !== LiveModes.off) {
            this.element.setAttribute(AriaLive_1.attribute, this.mode);
            return HtmlActions.define;
        }
        else {
            return this.removeLive();
        }
    }
};
AriaLive.attribute = 'aria-live';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], AriaLive.prototype, "name", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], AriaLive.prototype, "mode", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], AriaLive.prototype, "enabled", void 0);
AriaLive = AriaLive_1 = __decorate([
    customAttribute("bc-aria-live"),
    __param(0, ILogger),
    __param(1, IEventAggregator),
    __param(2, IPlatform),
    __param(3, INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], AriaLive);

var ModalChannels;
(function (ModalChannels) {
    ModalChannels["main"] = "aria:modal:main";
    ModalChannels["ended"] = "aria:modal:ended";
})(ModalChannels || (ModalChannels = {}));
var ModalModes;
(function (ModalModes) {
    ModalModes["true"] = "true";
    ModalModes["false"] = "false";
})(ModalModes || (ModalModes = {}));
var ModalRoles;
(function (ModalRoles) {
    ModalRoles["dialog"] = "dialog";
    ModalRoles["alertdialog"] = "alertdialog";
})(ModalRoles || (ModalRoles = {}));

var AriaModal_1;
let AriaModal = AriaModal_1 = class AriaModal {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.tabindexEnabled = false;
        this.mode = ModalModes.false;
        this.role = ModalRoles.dialog;
        this.defaultTabindex = '';
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
                if (data.action === HtmlActions.define) {
                    message.action = this.defineModal();
                }
                else if (data.action === HtmlActions.remove) {
                    message.action = this.removeModal();
                }
                else {
                    throw new Error('AriaModal: action not supported');
                }
                this.platform.taskQueue.queueTask(() => {
                    this.ea.publish(ModalChannels.ended, message);
                });
            }
        };
        this.logger = logger.scopeTo('AriaModal');
        this.logger.trace('constructor');
    }
    attached() {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(ModalChannels.main, this.onAriaModal);
        const currentRole = this.element.getAttribute(AriaModal_1.roleAttribute);
        if (currentRole !== null && Object.values(ModalRoles).includes(currentRole)) {
            this.role = currentRole;
        }
        if (this.tabindexEnabled) {
            const currentTabindex = this.element.getAttribute(AriaModal_1.tabindexAttribute);
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
        this.element.removeAttribute(AriaModal_1.attribute);
        this.element.removeAttribute(AriaModal_1.roleAttribute);
        if (this.tabindexEnabled) {
            this.element.setAttribute(AriaModal_1.tabindexAttribute, '-1');
        }
        return HtmlActions.remove;
    }
    defineModal() {
        if (this.mode === ModalModes.true) {
            this.element.setAttribute(AriaModal_1.attribute, this.mode);
            this.element.setAttribute(AriaModal_1.roleAttribute, this.role);
            if (this.tabindexEnabled) {
                if (this.defaultTabindex && this.defaultTabindex !== '') {
                    this.element.setAttribute(AriaModal_1.tabindexAttribute, this.defaultTabindex);
                }
                else {
                    this.element.removeAttribute(AriaModal_1.tabindexAttribute);
                }
            }
            return HtmlActions.define;
        }
        else if (this.mode === ModalModes.false) {
            return this.removeModal();
        }
        throw new Error('AriaModal: mode not supported');
    }
};
AriaModal.attribute = 'aria-modal';
AriaModal.roleAttribute = 'role';
AriaModal.tabindexAttribute = 'tabindex';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], AriaModal.prototype, "name", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], AriaModal.prototype, "enabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], AriaModal.prototype, "tabindexEnabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], AriaModal.prototype, "mode", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], AriaModal.prototype, "role", void 0);
AriaModal = AriaModal_1 = __decorate([
    customAttribute("bc-aria-modal"),
    __param(0, ILogger),
    __param(1, IEventAggregator),
    __param(2, IPlatform),
    __param(3, INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], AriaModal);

var SelectedChannels;
(function (SelectedChannels) {
    SelectedChannels["main"] = "aria:selected:main";
    SelectedChannels["ended"] = "aria:selected:ended";
})(SelectedChannels || (SelectedChannels = {}));
var SelectedModes;
(function (SelectedModes) {
    SelectedModes["true"] = "true";
    SelectedModes["false"] = "false";
})(SelectedModes || (SelectedModes = {}));

var AriaSelected_1;
let AriaSelected = AriaSelected_1 = class AriaSelected {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.mode = SelectedModes.false;
        this.onAriaSelected = (data) => {
            if (data.name == this.name) {
                this.logger.trace('onAriaSelected');
                this.mode = data.mode;
                const message = {
                    name: this.name,
                    mode: this.mode,
                    action: data.action
                };
                if (data.action === HtmlActions.define) {
                    message.action = this.defineSelected();
                }
                else if (data.action === HtmlActions.remove) {
                    message.action = this.removeSelected();
                }
                else {
                    throw new Error('AriaSelected: action not supported');
                }
                this.platform.taskQueue.queueTask(() => {
                    this.ea.publish(SelectedChannels.ended, message);
                });
            }
        };
        this.logger = logger.scopeTo('AriaSelected');
        this.logger.trace('constructor');
    }
    attached() {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(SelectedChannels.main, this.onAriaSelected);
        if (this.enabled) {
            this.defineSelected();
        }
    }
    dispose() {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }
    removeSelected() {
        this.element.removeAttribute(AriaSelected_1.attribute);
        return HtmlActions.remove;
    }
    defineSelected() {
        if (this.mode === SelectedModes.false) {
            return this.removeSelected();
        }
        this.element.setAttribute(AriaSelected_1.attribute, this.mode);
        return HtmlActions.define;
    }
};
AriaSelected.attribute = 'aria-selected';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], AriaSelected.prototype, "name", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], AriaSelected.prototype, "enabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], AriaSelected.prototype, "mode", void 0);
AriaSelected = AriaSelected_1 = __decorate([
    customAttribute("bc-aria-selected"),
    __param(0, ILogger),
    __param(1, IEventAggregator),
    __param(2, IPlatform),
    __param(3, INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], AriaSelected);

var FocusChannels;
(function (FocusChannels) {
    FocusChannels["main"] = "html:focus:main";
    FocusChannels["ended"] = "html:focus:ended";
})(FocusChannels || (FocusChannels = {}));

let Focus = class Focus {
    constructor(logger, options, ea, platform, element) {
        this.logger = logger;
        this.options = options;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = false;
        this.onFocus = (data) => {
            if (data.name === this.name) {
                const message = {
                    name: this.name,
                    action: data.action
                };
                if (data.action === HtmlActions.define) {
                    message.action = this.defineFocus();
                }
                else if (data.action === HtmlActions.remove) {
                    message.action = this.removeFocus();
                }
                this.ea.publish(FocusChannels.ended, message);
            }
        };
        this.logger = logger.scopeTo('Focus');
        this.logger.trace('constructor');
        this.focusDelay = this.options.get('focusDelay');
    }
    attached() {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(FocusChannels.main, this.onFocus);
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
        return HtmlActions.remove;
    }
    defineFocus() {
        this.platform.taskQueue.queueTask(() => {
            this.platform.requestAnimationFrame(() => {
                this.element.focus();
            });
        }, { delay: this.focusDelay });
        return HtmlActions.define;
    }
};
Focus.attribute = 'focus';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], Focus.prototype, "name", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], Focus.prototype, "enabled", void 0);
Focus = __decorate([
    customAttribute("bc-focus"),
    __param(0, ILogger),
    __param(1, IAriaConfiguration),
    __param(2, IEventAggregator),
    __param(3, IPlatform),
    __param(4, INode),
    __metadata("design:paramtypes", [Object, Object, Object, Object, HTMLElement])
], Focus);

var TabindexChannels;
(function (TabindexChannels) {
    TabindexChannels["main"] = "html:tabindex:main";
    TabindexChannels["ended"] = "html:tabindex:ended";
})(TabindexChannels || (TabindexChannels = {}));

var Tabindex_1;
let Tabindex = Tabindex_1 = class Tabindex {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.enabledDisabled = false;
        this.value = '';
        this.previousValue = '';
        this.onTabindex = (data) => {
            if (data.name === this.name) {
                const message = {
                    name: this.name,
                    action: data.action,
                    value: data.value,
                };
                if (data.action === HtmlActions.define) {
                    this.rotateTabindex(data.value);
                }
                else if (data.action === HtmlActions.remove) {
                    this.rotateTabindex('');
                }
                message.value = this.value;
                if (this.value !== '' && HtmlActions.define === data.action) {
                    message.action = this.defineTabindex();
                }
                else if (this.value === '' || HtmlActions.remove === data.action) {
                    message.action = this.removeTabindex();
                }
                this.platform.taskQueue.queueTask(() => {
                    this.ea.publish(TabindexChannels.ended, message);
                });
            }
        };
        this.logger = logger.scopeTo('AriaTabindexDisabled');
        this.logger.trace('constructor');
    }
    attached() {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(TabindexChannels.main, this.onTabindex);
        if (this.element.hasAttribute(Tabindex_1.attribute)) {
            this.value = this.element.getAttribute(Tabindex_1.attribute);
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
        this.element.removeAttribute(Tabindex_1.attribute);
        if (this.enabledDisabled) {
            this.element.removeAttribute(Tabindex_1.disabledAttribute);
        }
        return HtmlActions.remove;
    }
    defineTabindex() {
        if (this.value === '') {
            return this.removeTabindex();
        }
        else if (this.value === '-1') {
            this.element.setAttribute(Tabindex_1.attribute, this.value);
            if (this.enabledDisabled) {
                this.element.setAttribute(Tabindex_1.disabledAttribute, 'true');
            }
        }
        else {
            this.element.setAttribute(Tabindex_1.attribute, this.value);
            if (this.enabledDisabled) {
                this.element.removeAttribute(Tabindex_1.disabledAttribute);
            }
        }
        return HtmlActions.define;
    }
};
Tabindex.attribute = 'tabindex';
Tabindex.disabledAttribute = 'aria-disabled';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], Tabindex.prototype, "name", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], Tabindex.prototype, "enabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], Tabindex.prototype, "enabledDisabled", void 0);
__decorate([
    bindable(),
    __metadata("design:type", String)
], Tabindex.prototype, "value", void 0);
Tabindex = Tabindex_1 = __decorate([
    customAttribute("bc-tabindex"),
    __param(0, ILogger),
    __param(1, IEventAggregator),
    __param(2, IPlatform),
    __param(3, INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], Tabindex);

var TrapFocusChannels;
(function (TrapFocusChannels) {
    TrapFocusChannels["main"] = "html:trapfocus:main";
    TrapFocusChannels["ended"] = "html:trapfocus:ended";
    TrapFocusChannels["keydown"] = "html:trapfocus:keydown";
})(TrapFocusChannels || (TrapFocusChannels = {}));

var TrapFocus_1;
let TrapFocus = TrapFocus_1 = class TrapFocus {
    constructor(options, logger, ea, platform, element) {
        this.options = options;
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = false;
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
                this.ea.publish(TrapFocusChannels.keydown, message);
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
                if (data.action === HtmlActions.define) {
                    message.action = this.defineTrapFocus();
                }
                else if (data.action === HtmlActions.remove) {
                    message.action = this.removeTrapFocus();
                }
                else {
                    throw new Error('TrapFocus: action not supported');
                }
                this.ea.publish(TrapFocusChannels.ended, message);
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
            return this.enabled ? HtmlActions.define : HtmlActions.remove;
        };
        this.removeTrapFocus = () => {
            this.enabled = false;
            this.focusableElements = [];
            this.currentFocusedIndex = 0;
            this.resetGroups();
            return HtmlActions.remove;
        };
        this.logger = logger.scopeTo('TrapFocus');
        this.logger.trace('constructor');
        this.keysMonitored = this.options.get('keysMonitored');
        this.focusDelay = this.options.get('focusDelay');
        this.focusableElementsQuerySelector = this.options.get('focusableElementsQuerySelector');
    }
    attached() {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(TrapFocusChannels.main, this.onTrapFocus);
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
                const elementGroups = element.getAttribute(TrapFocus_1.attributeGroup);
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
            const groupsString = element.getAttribute(TrapFocus_1.attributeGroup);
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
TrapFocus.attributeGroup = 'trap-focus-group';
TrapFocus.attribute = 'trap-focus';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], TrapFocus.prototype, "name", void 0);
__decorate([
    bindable(),
    __metadata("design:type", Boolean)
], TrapFocus.prototype, "enabled", void 0);
TrapFocus = TrapFocus_1 = __decorate([
    customAttribute("bc-trap-focus"),
    __param(0, IAriaConfiguration),
    __param(1, ILogger),
    __param(2, IEventAggregator),
    __param(3, IPlatform),
    __param(4, INode),
    __metadata("design:paramtypes", [Object, Object, Object, Object, HTMLElement])
], TrapFocus);

var InvalidFocusChannels;
(function (InvalidFocusChannels) {
    InvalidFocusChannels["main"] = "html:invalidfocus:main";
    InvalidFocusChannels["ended"] = "html:invalidfocus:ended";
})(InvalidFocusChannels || (InvalidFocusChannels = {}));

let InvalidFocus = class InvalidFocus {
    constructor(options, logger, ea, platform, element) {
        this.options = options;
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.invalidElementsQuerySelector = '';
        this.onInvalidFocus = (data) => {
            if (data.name === this.name) {
                const message = {
                    name: this.name,
                    action: data.action,
                };
                this.platform.taskQueue.queueTask(() => {
                    if (data.action === HtmlActions.define) {
                        message.action = this.defineInvalidFocus();
                    }
                    else if (data.action === HtmlActions.remove) {
                        message.action = this.removeInvalidFocus();
                    }
                    else {
                        throw new Error('InvalidFocus: action not supported');
                    }
                    this.ea.publish(InvalidFocusChannels.ended, message);
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
        this.disposable = this.ea.subscribe(InvalidFocusChannels.main, this.onInvalidFocus);
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
        return HtmlActions.remove;
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
        return HtmlActions.define;
    }
};
InvalidFocus.attribute = 'invalid-focus';
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], InvalidFocus.prototype, "name", void 0);
InvalidFocus = __decorate([
    customAttribute("bc-invalid-focus"),
    __param(0, IAriaConfiguration),
    __param(1, ILogger),
    __param(2, IEventAggregator),
    __param(3, IPlatform),
    __param(4, INode),
    __metadata("design:paramtypes", [Object, Object, Object, Object, HTMLElement])
], InvalidFocus);

var RollbackFocusChannels;
(function (RollbackFocusChannels) {
    RollbackFocusChannels["main"] = "html:rollbackFocus:main";
    RollbackFocusChannels["change"] = "html:rollbackFocus:change";
    RollbackFocusChannels["ended"] = "html:rollbackFocus:ended";
})(RollbackFocusChannels || (RollbackFocusChannels = {}));

let RollbackFocus = class RollbackFocus {
    constructor(element, logger, ea) {
        this.element = element;
        this.logger = logger;
        this.ea = ea;
        this.event = 'click';
        this.subscriptionListenRollbackFocus = null;
        this.subscriptionChangeRollbackFocus = null;
        this.onEvent = (event) => {
            this.logger.trace('onClick', event);
            const message = {
                element: this.element,
            };
            this.ea.publish(RollbackFocusChannels.change, message);
            this.subscriptionListenRollbackFocus = this.ea.subscribe(RollbackFocusChannels.main, this.onRollbackFocus);
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
            this.ea.publish(RollbackFocusChannels.ended, message);
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
        this.subscriptionChangeRollbackFocus = this.ea.subscribe(RollbackFocusChannels.change, this.onRollbackFocusChangeCurrent);
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
__decorate([
    bindable({ primary: true }),
    __metadata("design:type", String)
], RollbackFocus.prototype, "event", void 0);
RollbackFocus = __decorate([
    customAttribute("bc-rollback-focus"),
    __param(0, INode),
    __param(1, ILogger),
    __param(2, IEventAggregator),
    __metadata("design:paramtypes", [Object, Object, Object])
], RollbackFocus);

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

export { AriaConfiguration, AriaCurrent, AriaExpanded, AriaHidden, AriaInvalid, AriaLabel, AriaLive, AriaModal, AriaSelected, CurrentChannels, CurrentModes, ExpandedChannels, ExpandedModes, Focus, FocusChannels, HiddenChannels, HiddenModes, HtmlActions, IAriaConfiguration, InvalidChannels, InvalidFocus, InvalidFocusChannels, InvalidModes, LabelChannels, LiveChannels, LiveModes, ModalChannels, ModalModes, ModalRoles, RollbackFocus, RollbackFocusChannels, SelectedChannels, SelectedModes, Tabindex, TabindexChannels, TrapFocus, TrapFocusChannels };
//# sourceMappingURL=index.es.js.map
