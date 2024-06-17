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

let Recaptcha = class Recaptcha {
    constructor(logger, platform, element, options) {
        this.logger = logger;
        this.platform = platform;
        this.element = element;
        this.options = options;
        this.form = null;
        this.recaptchaIsValid = false;
        this.errorClass = 'grecaptcha-error';
        this.badge = 'none';
        this.size = 'invisible';
        this.theme = 'light';
        this.event = 'submit';
        this.recaptchaCallback = (token) => {
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
        };
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
__decorate([
    aurelia.bindable({ mode: aurelia.BindingMode.oneTime }),
    __metadata("design:type", String)
], Recaptcha.prototype, "badge", void 0);
__decorate([
    aurelia.bindable({ mode: aurelia.BindingMode.oneTime }),
    __metadata("design:type", String)
], Recaptcha.prototype, "size", void 0);
__decorate([
    aurelia.bindable({ mode: aurelia.BindingMode.oneTime }),
    __metadata("design:type", String)
], Recaptcha.prototype, "theme", void 0);
__decorate([
    aurelia.bindable({ primary: true, mode: aurelia.BindingMode.oneTime }),
    __metadata("design:type", String)
], Recaptcha.prototype, "event", void 0);
Recaptcha = __decorate([
    aurelia.customAttribute("bc-recaptcha"),
    __param(0, aurelia.ILogger),
    __param(1, aurelia.IPlatform),
    __param(2, aurelia.INode),
    __param(3, IRecaptchaConfiguration),
    __metadata("design:paramtypes", [Object, Object, HTMLElement, Object])
], Recaptcha);

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
