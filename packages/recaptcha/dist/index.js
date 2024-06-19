'use strict';

var aurelia = require('aurelia');

const IRecaptchaConfiguration = aurelia.DI.createInterface('IRecaptchaConfiguration', x => x.singleton(RecaptchaConfigure));
class RecaptchaConfigure {
    constructor() {
        this._config = {
            apiUrl: 'https://www.google.com/recaptcha/api.js',
            size: 'invisible',
            badge: 'none',
            theme: 'light',
        };
        if (googleRecaptchaApiKey) {
            this._config.apiKey = googleRecaptchaApiKey;
        }
    }
    configure(incoming = null) {
        if (incoming) {
            Object.assign(this._config, incoming);
        }
        return this;
    }
    getOptions() {
        return this._config;
    }
    options(obj) {
        Object.assign(this._config, obj);
    }
    get(key) {
        // @ts-ignore
        return this._config[key];
    }
    set(key, val) {
        // @ts-ignore
        this._config[key] = val;
        // @ts-ignore
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
    return Object.defineProperty(f, "name", { configurable: true, value: name });
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

let Recaptcha = (() => {
    let _classDecorators = [aurelia.customAttribute("bc-recaptcha")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _badge_decorators;
    let _badge_initializers = [];
    let _badge_extraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _size_extraInitializers = [];
    let _theme_decorators;
    let _theme_initializers = [];
    let _theme_extraInitializers = [];
    let _event_decorators;
    let _event_initializers = [];
    let _event_extraInitializers = [];
    _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode), options = aurelia.resolve(IRecaptchaConfiguration)) {
            this.logger = logger;
            this.platform = platform;
            this.element = element;
            this.options = options;
            this.form = null;
            this.recaptchaIsValid = false;
            this.errorClass = 'grecaptcha-error';
            this.badge = __runInitializers(this, _badge_initializers, 'none');
            this.size = (__runInitializers(this, _badge_extraInitializers), __runInitializers(this, _size_initializers, 'invisible'));
            this.theme = (__runInitializers(this, _size_extraInitializers), __runInitializers(this, _theme_initializers, 'light'));
            this.event = (__runInitializers(this, _theme_extraInitializers), __runInitializers(this, _event_initializers, 'submit'));
            this.recaptchaCallback = (__runInitializers(this, _event_extraInitializers), (token) => {
                var _a, _b, _c;
                this.logger.debug('recaptchaCallback', token);
                if (token !== null) {
                    // do fetch
                    // reset on success
                    if (!!this.verifyUrl) {
                        fetch(this.verifyUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                token,
                            })
                        }).then((response) => {
                            if (response.ok && response.status === 200) {
                                return response.json();
                            }
                            else {
                                throw new Error('Verify URL ' + this.verifyUrl + ' is not valid');
                            }
                        })
                            .then((data) => {
                            var _a, _b;
                            if (data.success) {
                                if (this.form) {
                                    (_a = this.form) === null || _a === void 0 ? void 0 : _a.classList.remove(this.errorClass);
                                }
                                else {
                                    this.element.classList.remove(this.errorClass);
                                }
                                this.recaptchaIsValid = true;
                                if (this.event === 'submit' && this.size === 'invisible') {
                                    (_b = this.form) === null || _b === void 0 ? void 0 : _b.submit();
                                    grecaptcha.reset(this.widgetId);
                                }
                                else if (this.event === 'click') {
                                    this.element.click();
                                    grecaptcha.reset(this.widgetId);
                                }
                            }
                            else {
                                throw new Error('Recaptcha is not valid');
                            }
                        })
                            .catch((error) => {
                            var _a;
                            this.logger.error(error);
                            if (this.form) {
                                (_a = this.form) === null || _a === void 0 ? void 0 : _a.classList.add(this.errorClass);
                            }
                            else {
                                this.element.classList.add(this.errorClass);
                            }
                            this.recaptchaIsValid = false;
                        });
                    }
                    else {
                        if (this.form) {
                            (_a = this.form) === null || _a === void 0 ? void 0 : _a.classList.remove(this.errorClass);
                        }
                        else {
                            this.element.classList.remove(this.errorClass);
                        }
                        this.recaptchaIsValid = true;
                        if (this.event === 'submit' && this.size === 'invisible') {
                            (_b = this.form) === null || _b === void 0 ? void 0 : _b.submit();
                            grecaptcha.reset(this.widgetId);
                        }
                        else if (this.event === 'click') {
                            this.element.click();
                            grecaptcha.reset(this.widgetId);
                        }
                    }
                }
                else {
                    if (this.form) {
                        (_c = this.form) === null || _c === void 0 ? void 0 : _c.classList.remove(this.errorClass);
                    }
                    else {
                        this.element.classList.remove(this.errorClass);
                    }
                    this.recaptchaIsValid = false;
                }
            });
            this.onEvent = (event) => {
                this.logger.trace('onEvent');
                if (this.recaptchaIsValid === false) {
                    this.logger.debug('recaptchaIsValid', this.recaptchaIsValid);
                    event.preventDefault();
                    if (this.size === 'invisible') {
                        grecaptcha.execute(this.widgetId);
                    }
                }
                else {
                    this.logger.debug('recaptchaIsValid', this.recaptchaIsValid);
                    this.recaptchaIsValid = false;
                }
            };
            this.logger = logger.scopeTo('Recaptcha');
            this.logger.trace('constructor');
            try {
                this.apiKey = this.options.get('apiKey');
            }
            catch (e) {
                this.logger.error('API key is mandatory');
            }
            this.apiUrl = this.options.get('apiUrl');
            this.verifyUrl = this.options.get('verifyUrl');
            this.badge = this.options.get('badge');
            this.size = this.options.get('size');
            this.theme = this.options.get('theme');
        }
        binding() {
            this.logger.trace('binding');
            if (this.event === '') {
                this.event = 'submit';
            }
        }
        attaching() {
            var _a;
            this.logger.trace('attaching');
            this.form = this.element.closest('form');
            if (this.form === null) {
                this.logger.error('No form found');
            }
            if (this.event === 'submit') {
                (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener(this.event, this.onEvent);
            }
            else if (this.event === 'click') {
                this.element.addEventListener(this.event, this.onEvent);
            }
            return this.recaptchaReady();
        }
        attached() {
            var _a;
            this.formId = this.generateid();
            this.renderElement = this.platform.document.createElement('div');
            // @ts-ignore
            this.renderElement.id = this.formId;
            (_a = this.form) === null || _a === void 0 ? void 0 : _a.appendChild(this.renderElement);
            this.widgetId = grecaptcha.render(this.renderElement, {
                sitekey: this.apiKey,
                theme: this.theme,
                badge: this.badge, // 'bottomright
                size: this.size, // 'normal',
                callback: this.recaptchaCallback,
            });
        }
        detaching() {
            var _a;
            if (this.event === 'submit') {
                (_a = this.form) === null || _a === void 0 ? void 0 : _a.removeEventListener(this.event, this.onEvent);
            }
            else if (this.event === 'click') {
                this.element.removeEventListener(this.event, this.onEvent);
            }
        }
        recaptchaReady() {
            const promise = new Promise((resolve) => {
                this.installScript()
                    .then(() => {
                    this.logger.debug('script installed');
                    const interval = this.platform.setInterval(() => {
                        if (typeof grecaptcha !== 'undefined') {
                            this.platform.clearInterval(interval);
                            grecaptcha.ready(() => {
                                resolve(true);
                            });
                        }
                    }, 100);
                });
            });
            return promise;
        }
        isScriptInstalled() {
            const el = this.platform.document.head.querySelector(`script[src="${this.apiUrl}"]`);
            return el !== null;
        }
        installScript() {
            const promise = new Promise((resolve) => {
                if (this.isScriptInstalled() === false) {
                    const script = this.platform.document.createElement('script');
                    script.src = this.apiUrl;
                    script.async = true;
                    script.defer = true;
                    this.platform.document.head.appendChild(script);
                    script.addEventListener('load', () => {
                        this.logger.debug('script loaded');
                        resolve(true);
                    });
                    // script.setAttribute('data-sitekey', this.siteKey);
                }
                else {
                    resolve(true);
                }
            });
            return promise;
        }
        generateid(length = 5) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            return result;
        }
    };
    __setFunctionName(_classThis, "Recaptcha");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _badge_decorators = [aurelia.bindable({ mode: aurelia.BindingMode.oneTime })];
        _size_decorators = [aurelia.bindable({ mode: aurelia.BindingMode.oneTime })];
        _theme_decorators = [aurelia.bindable({ mode: aurelia.BindingMode.oneTime })];
        _event_decorators = [aurelia.bindable({ primary: true, mode: aurelia.BindingMode.oneTime })];
        __esDecorate(null, null, _badge_decorators, { kind: "field", name: "badge", static: false, private: false, access: { has: obj => "badge" in obj, get: obj => obj.badge, set: (obj, value) => { obj.badge = value; } }, metadata: _metadata }, _badge_initializers, _badge_extraInitializers);
        __esDecorate(null, null, _size_decorators, { kind: "field", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
        __esDecorate(null, null, _theme_decorators, { kind: "field", name: "theme", static: false, private: false, access: { has: obj => "theme" in obj, get: obj => obj.theme, set: (obj, value) => { obj.theme = value; } }, metadata: _metadata }, _theme_initializers, _theme_extraInitializers);
        __esDecorate(null, null, _event_decorators, { kind: "field", name: "event", static: false, private: false, access: { has: obj => "event" in obj, get: obj => obj.event, set: (obj, value) => { obj.event = value; } }, metadata: _metadata }, _event_initializers, _event_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

const RecaptchaDefaultComponents = [
    Recaptcha,
];
function createRecaptchaConfiguration(options) {
    return {
        register(container) {
            const configClass = container.get(IRecaptchaConfiguration);
            // @ts-ignore
            configClass.options(options);
            return container.register(...RecaptchaDefaultComponents);
        },
        configure(options) {
            return createRecaptchaConfiguration(options);
        }
    };
}
const RecaptchaConfiguration = createRecaptchaConfiguration({});

exports.IRecaptchaConfiguration = IRecaptchaConfiguration;
exports.RecaptchaConfiguration = RecaptchaConfiguration;
//# sourceMappingURL=index.js.map
