'use strict';

var fetchClient = require('@aurelia/fetch-client');
var aurelia = require('aurelia');
var router = require('@aurelia/router');

const IHttpService = aurelia.DI.createInterface('IHttpService', (x) => x.singleton(HttpService));
class HttpService {
    constructor(httpClient = aurelia.resolve(fetchClient.IHttpClient), ea = aurelia.resolve(aurelia.IEventAggregator)) {
        this.httpClient = httpClient;
        this.ea = ea;
        this.apiBaseUrl = '';
        if (window.apiBaseUrl) {
            this.apiBaseUrl = window.apiBaseUrl.replace(/\/$/, '');
        }
        this.httpClient.configure((config) => {
            config.withDefaults({
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include'
            });
            return config;
        });
    }
    getJson(url, requestInit = null) {
        requestInit = requestInit || {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        requestInit.method = 'GET';
        return this.fetch(url, null, requestInit);
    }
    postJson(url, payload, requestInit = null) {
        requestInit = requestInit || {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        requestInit.method = 'POST';
        return this.fetch(url, payload, requestInit);
    }
    fetch(url, payload = null, requestInit) {
        requestInit.headers = requestInit.headers || {};
        // @ts-ignore
        requestInit.headers['Accept'] = requestInit.headers['Accept'] || 'application/json';
        // @ts-ignore
        requestInit.headers['Content-Type'] = requestInit.headers['Content-Type'] || 'application/json';
        if (payload != null) {
            requestInit.body = JSON.stringify(payload);
        }
        const fullUrl = this.apiBaseUrl + url;
        return this.httpClient.fetch(fullUrl, requestInit)
            .then((response) => {
            const headers = response.headers;
            const status = response.status;
            const statusText = response.statusText;
            const contentType = headers.get('Content-Type');
            let data = response;
            if (contentType.indexOf('json') !== -1) {
                data = response.json();
            }
            else if (contentType.indexOf('text') !== -1) {
                data = response.text();
            }
            else {
                data = response.blob();
            }
            return Promise.all([status, statusText, headers, data]);
        })
            .then(([status, statusText, headers, data]) => {
            const response = {
                status,
                statusText,
                headers,
                data
            };
            if (status >= 200 && status < 300) {
                return response;
            }
            else {
                return Promise.reject(response);
            }
        });
    }
}

const IWebauthnConfiguration = aurelia.DI.createInterface('IWebauthnConfiguration', x => x.singleton(WebauthnConfigure));
class WebauthnConfigure {
    constructor() {
        this._config = {
            prepareAttachDeviceUrl: '/webauthn/prepare-register-user-device',
            prepareRegisterDeviceUrl: '/webauthn/prepare-register-device',
            validateRegisterUrl: '/webauthn/register-validate',
            prepareLoginUrl: '/webauthn/prepare-login-user-device',
            prepareLoginDeviceUrl: '/webauthn/prepare-login-device',
            validateLoginUrl: '/webauthn/login-validate'
        };
        console.log('WebauthnConfiguration constructor');
    }
    configure(incoming = undefined) {
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

const IWebauthnService = aurelia.DI.createInterface('IWebauthnService', (x) => x.singleton(WebauthnService));
class WebauthnService {
    constructor(logger = aurelia.resolve(aurelia.ILogger).scopeTo('WebauthnService'), platform = aurelia.resolve(aurelia.IPlatform), options = aurelia.resolve(IWebauthnConfiguration), httpService = aurelia.resolve(IHttpService)) {
        this.logger = logger;
        this.platform = platform;
        this.options = options;
        this.httpService = httpService;
        this.logger.debug('Construct');
    }
    isAvailable() {
        if (this.platform.window.window.PublicKeyCredential) {
            return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
                .then((available) => {
                if (available) {
                    this.logger.debug("WebAuthn supported, Platform Authenticator supported.");
                    return true;
                }
                else {
                    this.logger.debug("WebAuthn supported, Platform Authenticator *not* supported.");
                    return false;
                }
            })
                .catch((err) => {
                this.logger.debug("WebAuthn Something went wrong.");
                return Promise.reject(err);
            });
        }
        else {
            this.logger.debug("WebAuthn not supported.");
            return Promise.reject("WebAuthn not supported.");
        }
    }
    registerDevice(email, name = null) {
        const data = {
            email
        };
        if (name && name.length > 0) {
            data.displayName = name;
        }
        return this.httpService.postJson(this.options.get('prepareRegisterDeviceUrl'), data)
            .then((response) => {
            var _a;
            if (response.status !== 200) {
                throw new Error('Failed to get credential');
            }
            const data = response.data;
            data.challenge = this.convertStringToBuffer(this.base64UrlDecode(data.challenge));
            if ((_a = data.user) === null || _a === void 0 ? void 0 : _a.id) {
                data.user.id = this.convertStringToBuffer(this.base64UrlDecode(data.user.id));
            }
            return this.platform.window.navigator.credentials
                .create({ publicKey: data });
        })
            .then((credential) => {
            this.logger.debug('Register response', credential);
            const data = {
                id: credential.id,
                rawId: this.base64UrlEncode(credential.rawId),
                response: {
                    // @ts-ignore
                    attestationObject: this.base64UrlEncode(credential.response.attestationObject),
                    clientDataJSON: this.base64UrlEncode(credential.response.clientDataJSON)
                },
                type: credential.type
            };
            return data;
        })
            .then((data) => {
            return this.httpService.postJson(this.options.get('validateRegisterUrl'), data);
        })
            .then((response) => {
            this.logger.debug('Register response', response);
            return response.status === 200;
        })
            .catch((err) => {
            this.logger.error('Register response', err);
            return false;
        });
    }
    attachDevice() {
        return this.httpService.postJson(this.options.get('prepareAttachDeviceUrl'), {})
            .then((response) => {
            if (response.status !== 200) {
                throw new Error('Failed to get credential');
            }
            const data = response.data;
            data.challenge = this.convertStringToBuffer(this.base64UrlDecode(data.challenge));
            data.user.id = this.convertStringToBuffer(this.base64UrlDecode(data.user.id));
            return this.platform.window.navigator.credentials.create({ publicKey: data });
        })
            .then((credential) => {
            this.logger.debug('Register response', credential);
            const data = {
                id: credential.id,
                rawId: this.base64UrlEncode(credential.rawId),
                response: {
                    // @ts-ignore
                    attestationObject: this.base64UrlEncode(credential.response.attestationObject),
                    clientDataJSON: this.base64UrlEncode(credential.response.clientDataJSON)
                },
                type: credential.type
            };
            return this.httpService.postJson(this.options.get('validateRegisterUrl'), data);
        })
            .then((response) => {
            this.logger.debug('Register response', response);
            return response.status === 200;
        })
            .catch((err) => {
            return false;
        });
    }
    login(email) {
        return this.httpService.postJson(this.options.get('prepareLoginUrl'), { name: email })
            .then((response) => {
            if (response.status !== 200) {
                throw new Error('Failed to get credential');
            }
            const data = response.data;
            data.challenge = this.convertStringToBuffer(this.base64UrlDecode(data.challenge));
            data.allowCredentials = data.allowCredentials.map((cred) => {
                cred.id = this.convertStringToBuffer(this.base64UrlDecode(cred.id));
                return cred;
            });
            return this.platform.window.navigator.credentials.get({ publicKey: data });
        })
            .then((credential) => {
            this.logger.debug('Login response', credential);
            const data = {
                id: credential.id,
                rawId: this.base64UrlEncode(credential.rawId),
                authenticatorAttachment: credential.authenticatorAttachment,
                response: {
                    // @ts-ignore
                    authenticatorData: this.base64UrlEncode(credential.response.authenticatorData),
                    clientDataJSON: this.base64UrlEncode(credential.response.clientDataJSON),
                    // @ts-ignore
                    signature: this.base64UrlEncode(credential.response.signature),
                    // @ts-ignore
                    userHandle: this.base64UrlEncode(credential.response.userHandle)
                },
                type: credential.type
            };
            return this.httpService.postJson(this.options.get('validateLoginUrl'), data);
        })
            .then((response) => {
            this.logger.debug('Login response', response);
            return response.status === 200;
        })
            .catch((err) => {
            return false;
        });
    }
    loginDevice() {
        return this.httpService.postJson(this.options.get('prepareLoginDeviceUrl'), {})
            .then((response) => {
            if (response.status !== 200) {
                throw new Error('Failed to get credential');
            }
            const data = response.data;
            data.challenge = this.convertStringToBuffer(this.base64UrlDecode(data.challenge));
            data.allowCredentials = data.allowCredentials.map((cred) => {
                cred.id = this.convertStringToBuffer(this.base64UrlDecode(cred.id));
                return cred;
            });
            return this.platform.window.navigator.credentials
                .get({ publicKey: data });
        })
            .then((credential) => {
            this.logger.debug('Login response', credential);
            const data = {
                id: credential.id,
                rawId: this.base64UrlEncode(credential.rawId),
                authenticatorAttachment: credential.authenticatorAttachment,
                response: {
                    // @ts-ignore
                    authenticatorData: this.base64UrlEncode(credential.response.authenticatorData),
                    clientDataJSON: this.base64UrlEncode(credential.response.clientDataJSON),
                    // @ts-ignore
                    signature: this.base64UrlEncode(credential.response.signature),
                    // @ts-ignore
                    userHandle: this.base64UrlEncode(credential.response.userHandle)
                },
                type: credential.type
            };
            return this.httpService.postJson(this.options.get('validateLoginUrl'), data);
        })
            .then((response) => {
            this.logger.debug('Login response', response);
            return response.status === 200;
        })
            .catch((err) => {
            this.logger.error('Login response', err);
            return false;
        });
    }
    convertStringToBuffer(str) {
        if (typeof str === 'string') {
            const id = Uint8Array.from(str, c => c.charCodeAt(0));
            return id.buffer;
        }
        return str;
    }
    base64UrlDecode(input) {
        input = input
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const pad = input.length % 4;
        if (pad) {
            if (pad === 1) {
                throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
            }
            input += new Array(5 - pad).join('=');
        }
        return atob(input);
    }
    base64UrlEncode(a) {
        let data;
        if (a instanceof ArrayBuffer) {
            data = new Uint8Array(a);
        }
        else {
            data = a;
        }
        const str = btoa(String.fromCharCode(...data));
        return str
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
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

var template$1 = `<template>
    <div class="flex p-1">
        <input if.bind="user" id="webauthn-email" type="text" placeholder="E-Mail" value.bind="email" class="flex-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>

        <button click.trigger="onSubmitLogin($event)" type="button" class="flex-none w-10 rounded p-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" class.bind="error?'text-red-600':''">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
            </svg>
        </button>
    </div>
</template>`;

let WebauthnLogin = (() => {
    let _classDecorators = [aurelia.customElement({ name: 'bc-webauthn-login', template: template$1 })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _route_decorators;
    let _route_initializers = [];
    let _route_extraInitializers = [];
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _user_decorators;
    let _user_initializers = [];
    let _user_extraInitializers = [];
    _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger).scopeTo('WebauthnLogin'), webauthnService = aurelia.resolve(IWebauthnService), router$1 = aurelia.resolve(router.IRouter), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.webauthnService = webauthnService;
            this.router = router$1;
            this.platform = platform;
            this.element = element;
            this.route = __runInitializers(this, _route_initializers, '');
            this.url = (__runInitializers(this, _route_extraInitializers), __runInitializers(this, _url_initializers, ''));
            this.user = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _user_initializers, false));
            this.error = (__runInitializers(this, _user_extraInitializers), false);
            this.email = '';
            this.logger.debug('Constructor');
        }
        attached() {
            this.logger.debug('Attached');
            this.webauthnService.isAvailable().then((available) => {
                if (available) {
                    this.logger.debug('WebAuthn is available');
                }
                else {
                    this.logger.debug('WebAuthn is not available');
                    this.element.remove();
                }
            });
        }
        onSubmitLogin(evt) {
            evt.preventDefault();
            this.logger.debug('Login');
            const webauthnRequest = this.user ? this.webauthnService.login(this.email) : this.webauthnService.loginDevice();
            webauthnRequest.then((status) => {
                if (status) {
                    this.logger.debug('Login success');
                    this.error = false;
                    if (this.route !== '') {
                        this.logger.debug('Navigate to ' + this.route);
                        this.router.load(this.route);
                    }
                    else if (this.url !== '') {
                        this.logger.debug('Navigate to ' + this.url);
                        this.platform.window.location.href = this.url;
                    }
                }
                else {
                    this.error = true;
                    this.logger.error('Login failed');
                }
            })
                .catch((err) => {
                this.error = true;
                this.logger.error('Service failed');
            });
        }
    };
    __setFunctionName(_classThis, "WebauthnLogin");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _route_decorators = [aurelia.bindable()];
        _url_decorators = [aurelia.bindable()];
        _user_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _route_decorators, { kind: "field", name: "route", static: false, private: false, access: { has: obj => "route" in obj, get: obj => obj.route, set: (obj, value) => { obj.route = value; } }, metadata: _metadata }, _route_initializers, _route_extraInitializers);
        __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: obj => "user" in obj, get: obj => obj.user, set: (obj, value) => { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

var template = `<template>
    <div class="flex p-1" >
        <div if.bind="user" class="flex-1">
            <input id="webauthn-email" type="text" placeholder="E-Mail" value.bind="email" class="block w-full rounded-md border-0 pb-1.5 my-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            <input id="webauthn-name" type="text" placeholder="Name" value.bind="name" class="block w-full rounded-md border-0 pt-1.5 my-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
        <button click.trigger="onSubmitRegister($event)" type="button" class="flex-none w-10 rounded px-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600" class.bind="error?'text-red-600':''">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
            </svg>
        </button>
    </div>
</template>`;

let WebauthnRegister = (() => {
    let _classDecorators = [aurelia.customElement({ name: 'bc-webauthn-register', template })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _route_decorators;
    let _route_initializers = [];
    let _route_extraInitializers = [];
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _user_decorators;
    let _user_initializers = [];
    let _user_extraInitializers = [];
    _classThis = class {
        constructor(logger = aurelia.resolve(aurelia.ILogger).scopeTo('WebauthnRegister'), webauthnService = aurelia.resolve(IWebauthnService), router$1 = aurelia.resolve(router.IRouter), platform = aurelia.resolve(aurelia.IPlatform), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.webauthnService = webauthnService;
            this.router = router$1;
            this.platform = platform;
            this.element = element;
            this.route = __runInitializers(this, _route_initializers, '');
            this.url = (__runInitializers(this, _route_extraInitializers), __runInitializers(this, _url_initializers, ''));
            this.user = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _user_initializers, false));
            this.error = (__runInitializers(this, _user_extraInitializers), false);
            this.email = '';
            this.name = '';
            this.logger.debug('Constructor');
        }
        attached() {
            this.logger.debug('Attached');
            this.webauthnService.isAvailable().then((available) => {
                if (available) {
                    this.logger.debug('WebAuthn is available');
                }
                else {
                    this.logger.debug('WebAuthn is not available');
                    this.element.remove();
                }
            });
        }
        onSubmitRegister(evt) {
            evt.preventDefault();
            this.logger.debug('Register');
            const webauthnRequest = this.user ? this.webauthnService.registerDevice(this.email, this.name) : this.webauthnService.attachDevice();
            webauthnRequest.then((status) => {
                if (status) {
                    this.logger.debug('Register success');
                    this.error = false;
                    if (this.route !== '') {
                        this.logger.debug('Navigate to ' + this.route);
                        this.router.load(this.route);
                    }
                    else if (this.url !== '') {
                        this.logger.debug('Navigate to ' + this.url);
                        this.platform.window.location.href = this.url;
                    }
                }
                else {
                    this.error = true;
                    this.logger.error('Register failed');
                }
            })
                .catch((err) => {
                this.error = true;
                this.logger.error('Service failed');
            });
        }
    };
    __setFunctionName(_classThis, "WebauthnRegister");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _route_decorators = [aurelia.bindable()];
        _url_decorators = [aurelia.bindable()];
        _user_decorators = [aurelia.bindable()];
        __esDecorate(null, null, _route_decorators, { kind: "field", name: "route", static: false, private: false, access: { has: obj => "route" in obj, get: obj => obj.route, set: (obj, value) => { obj.route = value; } }, metadata: _metadata }, _route_initializers, _route_extraInitializers);
        __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: obj => "user" in obj, get: obj => obj.user, set: (obj, value) => { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

const DefaultComponents = [
    WebauthnLogin,
    WebauthnRegister,
];
function createWebauthnConfiguration(options) {
    return {
        register(container) {
            const configClass = container.get(IWebauthnConfiguration);
            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents);
        },
        configure(options) {
            return createWebauthnConfiguration(options);
        }
    };
}
const WebauthnConfiguration = createWebauthnConfiguration({});

exports.HttpService = HttpService;
exports.IHttpService = IHttpService;
exports.IWebauthnConfiguration = IWebauthnConfiguration;
exports.IWebauthnService = IWebauthnService;
exports.WebauthnConfiguration = WebauthnConfiguration;
exports.WebauthnLogin = WebauthnLogin;
exports.WebauthnRegister = WebauthnRegister;
exports.WebauthnService = WebauthnService;
//# sourceMappingURL=index.js.map
