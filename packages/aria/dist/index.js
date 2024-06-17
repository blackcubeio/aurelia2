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

var AriaCurrent_1;
exports.AriaCurrent = AriaCurrent_1 = class AriaCurrent {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.mode = exports.CurrentModes.false;
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
        this.element.removeAttribute(AriaCurrent_1.attribute);
        return exports.HtmlActions.remove;
    }
    defineCurrent() {
        if (this.mode === exports.CurrentModes.false) {
            return this.removeCurrent();
        }
        this.element.setAttribute(AriaCurrent_1.attribute, this.mode);
        return exports.HtmlActions.define;
    }
};
exports.AriaCurrent.attribute = 'aria-current';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.AriaCurrent.prototype, "name", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.AriaCurrent.prototype, "enabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.AriaCurrent.prototype, "mode", void 0);
exports.AriaCurrent = AriaCurrent_1 = __decorate([
    aurelia.customAttribute("bc-aria-current"),
    __param(0, aurelia.ILogger),
    __param(1, aurelia.IEventAggregator),
    __param(2, aurelia.IPlatform),
    __param(3, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], exports.AriaCurrent);

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

var AriaExpanded_1;
exports.AriaExpanded = AriaExpanded_1 = class AriaExpanded {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.mode = exports.ExpandedModes.false;
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
        this.element.removeAttribute(AriaExpanded_1.attribute);
        return exports.HtmlActions.remove;
    }
    defineExpanded() {
        this.element.setAttribute(AriaExpanded_1.attribute, this.mode);
        return exports.HtmlActions.define;
    }
};
exports.AriaExpanded.attribute = 'aria-expanded';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.AriaExpanded.prototype, "name", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.AriaExpanded.prototype, "enabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.AriaExpanded.prototype, "mode", void 0);
exports.AriaExpanded = AriaExpanded_1 = __decorate([
    aurelia.customAttribute("bc-aria-expanded"),
    __param(0, aurelia.ILogger),
    __param(1, aurelia.IEventAggregator),
    __param(2, aurelia.IPlatform),
    __param(3, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], exports.AriaExpanded);

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

var AriaHidden_1;
exports.AriaHidden = AriaHidden_1 = class AriaHidden {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.mode = exports.HiddenModes.true;
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
        this.element.removeAttribute(AriaHidden_1.attribute);
        return exports.HtmlActions.remove;
    }
    defineHidden() {
        if (this.mode === exports.HiddenModes.true) {
            this.element.setAttribute(AriaHidden_1.attribute, this.mode);
            return exports.HtmlActions.define;
        }
        else if (this.mode === exports.HiddenModes.false) {
            return this.removeHidden();
        }
        throw new Error('AriaHidden: mode not supported');
    }
};
exports.AriaHidden.attribute = 'aria-hidden';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.AriaHidden.prototype, "name", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.AriaHidden.prototype, "enabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.AriaHidden.prototype, "mode", void 0);
exports.AriaHidden = AriaHidden_1 = __decorate([
    aurelia.customAttribute("bc-aria-hidden"),
    __param(0, aurelia.ILogger),
    __param(1, aurelia.IEventAggregator),
    __param(2, aurelia.IPlatform),
    __param(3, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], exports.AriaHidden);

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

var AriaInvalid_1;
exports.AriaInvalid = AriaInvalid_1 = class AriaInvalid {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.mode = exports.InvalidModes.false;
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
        return exports.HtmlActions.remove;
    }
    defineInvalid() {
        if (this.mode === exports.InvalidModes.true) {
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
            return exports.HtmlActions.define;
        }
        else if (this.mode === exports.InvalidModes.false) {
            return this.removeInvalid();
        }
        throw new Error('AriaInvalid: mode not supported');
    }
};
exports.AriaInvalid.attribute = 'aria-invalid';
exports.AriaInvalid.describedByAttribute = 'aria-describedby';
exports.AriaInvalid.labelledByAttribute = 'aria-labelledby';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.AriaInvalid.prototype, "name", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.AriaInvalid.prototype, "enabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.AriaInvalid.prototype, "mode", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.AriaInvalid.prototype, "describedByEnabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.AriaInvalid.prototype, "describedById", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.AriaInvalid.prototype, "labelledByEnabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.AriaInvalid.prototype, "labelledById", void 0);
exports.AriaInvalid = AriaInvalid_1 = __decorate([
    aurelia.customAttribute("bc-aria-invalid"),
    __param(0, aurelia.ILogger),
    __param(1, aurelia.IEventAggregator),
    __param(2, aurelia.IPlatform),
    __param(3, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], exports.AriaInvalid);

exports.LabelChannels = void 0;
(function (LabelChannels) {
    LabelChannels["main"] = "aria:label:main";
    LabelChannels["ended"] = "aria:label:ended";
})(exports.LabelChannels || (exports.LabelChannels = {}));

var AriaLabel_1;
exports.AriaLabel = AriaLabel_1 = class AriaLabel {
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
        this.element.removeAttribute(AriaLabel_1.attribute);
        return exports.HtmlActions.remove;
    }
    defineLabel() {
        if (this.label !== '') {
            this.element.setAttribute(AriaLabel_1.attribute, this.label);
            return exports.HtmlActions.define;
        }
        else {
            return this.removeLabel();
        }
    }
};
exports.AriaLabel.attribute = 'aria-label';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.AriaLabel.prototype, "name", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.AriaLabel.prototype, "enabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.AriaLabel.prototype, "label", void 0);
exports.AriaLabel = AriaLabel_1 = __decorate([
    aurelia.customAttribute("bc-aria-label"),
    __param(0, aurelia.ILogger),
    __param(1, aurelia.IEventAggregator),
    __param(2, aurelia.IPlatform),
    __param(3, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], exports.AriaLabel);

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

var AriaLive_1;
exports.AriaLive = AriaLive_1 = class AriaLive {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.mode = exports.LiveModes.polite;
        this.enabled = true;
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
        return exports.HtmlActions.remove;
    }
    defineLive() {
        if (this.mode !== exports.LiveModes.off) {
            this.element.setAttribute(AriaLive_1.attribute, this.mode);
            return exports.HtmlActions.define;
        }
        else {
            return this.removeLive();
        }
    }
};
exports.AriaLive.attribute = 'aria-live';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.AriaLive.prototype, "name", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.AriaLive.prototype, "mode", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.AriaLive.prototype, "enabled", void 0);
exports.AriaLive = AriaLive_1 = __decorate([
    aurelia.customAttribute("bc-aria-live"),
    __param(0, aurelia.ILogger),
    __param(1, aurelia.IEventAggregator),
    __param(2, aurelia.IPlatform),
    __param(3, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], exports.AriaLive);

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

var AriaModal_1;
exports.AriaModal = AriaModal_1 = class AriaModal {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.tabindexEnabled = false;
        this.mode = exports.ModalModes.false;
        this.role = exports.ModalRoles.dialog;
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
        const currentRole = this.element.getAttribute(AriaModal_1.roleAttribute);
        if (currentRole !== null && Object.values(exports.ModalRoles).includes(currentRole)) {
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
        return exports.HtmlActions.remove;
    }
    defineModal() {
        if (this.mode === exports.ModalModes.true) {
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
            return exports.HtmlActions.define;
        }
        else if (this.mode === exports.ModalModes.false) {
            return this.removeModal();
        }
        throw new Error('AriaModal: mode not supported');
    }
};
exports.AriaModal.attribute = 'aria-modal';
exports.AriaModal.roleAttribute = 'role';
exports.AriaModal.tabindexAttribute = 'tabindex';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.AriaModal.prototype, "name", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.AriaModal.prototype, "enabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.AriaModal.prototype, "tabindexEnabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.AriaModal.prototype, "mode", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.AriaModal.prototype, "role", void 0);
exports.AriaModal = AriaModal_1 = __decorate([
    aurelia.customAttribute("bc-aria-modal"),
    __param(0, aurelia.ILogger),
    __param(1, aurelia.IEventAggregator),
    __param(2, aurelia.IPlatform),
    __param(3, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], exports.AriaModal);

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

var AriaSelected_1;
exports.AriaSelected = AriaSelected_1 = class AriaSelected {
    constructor(logger, ea, platform, element) {
        this.logger = logger;
        this.ea = ea;
        this.platform = platform;
        this.element = element;
        this.enabled = true;
        this.mode = exports.SelectedModes.false;
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
        this.element.removeAttribute(AriaSelected_1.attribute);
        return exports.HtmlActions.remove;
    }
    defineSelected() {
        if (this.mode === exports.SelectedModes.false) {
            return this.removeSelected();
        }
        this.element.setAttribute(AriaSelected_1.attribute, this.mode);
        return exports.HtmlActions.define;
    }
};
exports.AriaSelected.attribute = 'aria-selected';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.AriaSelected.prototype, "name", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.AriaSelected.prototype, "enabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.AriaSelected.prototype, "mode", void 0);
exports.AriaSelected = AriaSelected_1 = __decorate([
    aurelia.customAttribute("bc-aria-selected"),
    __param(0, aurelia.ILogger),
    __param(1, aurelia.IEventAggregator),
    __param(2, aurelia.IPlatform),
    __param(3, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], exports.AriaSelected);

exports.FocusChannels = void 0;
(function (FocusChannels) {
    FocusChannels["main"] = "html:focus:main";
    FocusChannels["ended"] = "html:focus:ended";
})(exports.FocusChannels || (exports.FocusChannels = {}));

exports.Focus = class Focus {
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
exports.Focus.attribute = 'focus';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.Focus.prototype, "name", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.Focus.prototype, "enabled", void 0);
exports.Focus = __decorate([
    aurelia.customAttribute("bc-focus"),
    __param(0, aurelia.ILogger),
    __param(1, IAriaConfiguration),
    __param(2, aurelia.IEventAggregator),
    __param(3, aurelia.IPlatform),
    __param(4, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, Object, HTMLElement])
], exports.Focus);

exports.TabindexChannels = void 0;
(function (TabindexChannels) {
    TabindexChannels["main"] = "html:tabindex:main";
    TabindexChannels["ended"] = "html:tabindex:ended";
})(exports.TabindexChannels || (exports.TabindexChannels = {}));

var Tabindex_1;
exports.Tabindex = Tabindex_1 = class Tabindex {
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
        return exports.HtmlActions.remove;
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
        return exports.HtmlActions.define;
    }
};
exports.Tabindex.attribute = 'tabindex';
exports.Tabindex.disabledAttribute = 'aria-disabled';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.Tabindex.prototype, "name", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.Tabindex.prototype, "enabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.Tabindex.prototype, "enabledDisabled", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", String)
], exports.Tabindex.prototype, "value", void 0);
exports.Tabindex = Tabindex_1 = __decorate([
    aurelia.customAttribute("bc-tabindex"),
    __param(0, aurelia.ILogger),
    __param(1, aurelia.IEventAggregator),
    __param(2, aurelia.IPlatform),
    __param(3, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, HTMLElement])
], exports.Tabindex);

exports.TrapFocusChannels = void 0;
(function (TrapFocusChannels) {
    TrapFocusChannels["main"] = "html:trapfocus:main";
    TrapFocusChannels["ended"] = "html:trapfocus:ended";
    TrapFocusChannels["keydown"] = "html:trapfocus:keydown";
})(exports.TrapFocusChannels || (exports.TrapFocusChannels = {}));

var TrapFocus_1;
exports.TrapFocus = TrapFocus_1 = class TrapFocus {
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
exports.TrapFocus.attributeGroup = 'trap-focus-group';
exports.TrapFocus.attribute = 'trap-focus';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.TrapFocus.prototype, "name", void 0);
__decorate([
    aurelia.bindable(),
    __metadata("design:type", Boolean)
], exports.TrapFocus.prototype, "enabled", void 0);
exports.TrapFocus = TrapFocus_1 = __decorate([
    aurelia.customAttribute("bc-trap-focus"),
    __param(0, IAriaConfiguration),
    __param(1, aurelia.ILogger),
    __param(2, aurelia.IEventAggregator),
    __param(3, aurelia.IPlatform),
    __param(4, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, Object, HTMLElement])
], exports.TrapFocus);

exports.InvalidFocusChannels = void 0;
(function (InvalidFocusChannels) {
    InvalidFocusChannels["main"] = "html:invalidfocus:main";
    InvalidFocusChannels["ended"] = "html:invalidfocus:ended";
})(exports.InvalidFocusChannels || (exports.InvalidFocusChannels = {}));

exports.InvalidFocus = class InvalidFocus {
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
exports.InvalidFocus.attribute = 'invalid-focus';
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.InvalidFocus.prototype, "name", void 0);
exports.InvalidFocus = __decorate([
    aurelia.customAttribute("bc-invalid-focus"),
    __param(0, IAriaConfiguration),
    __param(1, aurelia.ILogger),
    __param(2, aurelia.IEventAggregator),
    __param(3, aurelia.IPlatform),
    __param(4, aurelia.INode),
    __metadata("design:paramtypes", [Object, Object, Object, Object, HTMLElement])
], exports.InvalidFocus);

exports.RollbackFocusChannels = void 0;
(function (RollbackFocusChannels) {
    RollbackFocusChannels["main"] = "html:rollbackFocus:main";
    RollbackFocusChannels["change"] = "html:rollbackFocus:change";
    RollbackFocusChannels["ended"] = "html:rollbackFocus:ended";
})(exports.RollbackFocusChannels || (exports.RollbackFocusChannels = {}));

exports.RollbackFocus = class RollbackFocus {
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
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.RollbackFocus.prototype, "event", void 0);
exports.RollbackFocus = __decorate([
    aurelia.customAttribute("bc-rollback-focus"),
    __param(0, aurelia.INode),
    __param(1, aurelia.ILogger),
    __param(2, aurelia.IEventAggregator),
    __metadata("design:paramtypes", [Object, Object, Object])
], exports.RollbackFocus);

const DefaultComponents = [
    exports.AriaCurrent,
    exports.AriaExpanded,
    exports.AriaHidden,
    exports.AriaInvalid,
    exports.AriaLabel,
    exports.AriaLive,
    exports.AriaModal,
    exports.AriaSelected,
    exports.Focus,
    exports.Tabindex,
    exports.TrapFocus,
    exports.InvalidFocus,
    exports.RollbackFocus,
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
exports.IAriaConfiguration = IAriaConfiguration;
//# sourceMappingURL=index.js.map
