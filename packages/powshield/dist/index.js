'use strict';

var aurelia = require('aurelia');
var fetchClient = require('@aurelia/fetch-client');

const IPowshieldConfiguration = aurelia.DI.createInterface('IPowshieldConfiguration', x => x.singleton(PowshieldConfigure));
class PowshieldConfigure {
    constructor() {
        this._config = {
            generateChallengeUrl: '/powshield/generate-challenge',
            verifySolutionUrl: '/powshield/verify-solution',
            solutionInputSelector: '#powshieldSolution'
        };
        console.log('PowshieldConfigure constructor');
    }
    configure(incoming = undefined) {
        if (incoming) {
            Object.assign(this._config, incoming);
        }
        console.log('PowshieldConfigure configure', incoming);
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

const IHttpService = aurelia.DI.createInterface('IHttpService', (x) => x.singleton(exports.HttpService));
exports.HttpService = class HttpService {
    constructor(httpClient, ea) {
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
};
exports.HttpService = __decorate([
    __param(0, fetchClient.IHttpClient),
    __param(1, aurelia.IEventAggregator),
    __metadata("design:paramtypes", [Object, Object])
], exports.HttpService);

const IPowshieldService = aurelia.DI.createInterface('IPowshieldService', (x) => x.singleton(exports.PowshieldService));
exports.PowshieldService = class PowshieldService {
    constructor(logger, httpService, options) {
        this.logger = logger;
        this.httpService = httpService;
        this.options = options;
        this.encoder = new TextEncoder();
        this.logger = logger.scopeTo('PowshieldService');
        this.logger.trace('constructor');
        this.generateChallengeUrl = this.options.get('generateChallengeUrl');
        this.verifySolutionUrl = this.options.get('verifySolutionUrl');
    }
    getChallenge() {
        return this.httpService.getJson(this.generateChallengeUrl)
            .then((response) => {
            if (response.status !== 200) {
                throw new Error('Failed to get challenge');
            }
            let bytes = atob(response.data);
            let decoded = JSON.parse(bytes);
            return decoded;
        });
    }
    verifySolution(solution) {
        const payload = { payload: btoa(JSON.stringify(solution)) };
        return this.httpService.postJson(this.verifySolutionUrl, payload)
            .then((response) => {
            if (response.status !== 200) {
                throw new Error('Failed to verify solution');
            }
            return response.data;
        });
    }
    solveChallenge(challenge) {
        const searchSecretNumber = async () => {
            for (let secretNumber = challenge.start; secretNumber <= challenge.max; secretNumber += 1) {
                const t = await this.hashHex(challenge.algorithm, challenge.salt + secretNumber + challenge.timestamp);
                if (t === challenge.challenge) {
                    const solution = Object.assign(Object.assign({}, challenge), { number: secretNumber });
                    return solution;
                }
            }
            return null;
        };
        return searchSecretNumber();
    }
    ab2hex(ab) {
        return [...new Uint8Array(ab)]
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('');
    }
    async hash(algorithm, data) {
        return crypto.subtle.digest(algorithm.toUpperCase(), typeof data === 'string' ? this.encoder.encode(data) : new Uint8Array(data));
    }
    async hashHex(algorithm, data) {
        return this.ab2hex(await this.hash(algorithm, data));
    }
};
exports.PowshieldService = __decorate([
    __param(0, aurelia.ILogger),
    __param(1, IHttpService),
    __param(2, IPowshieldConfiguration),
    __metadata("design:paramtypes", [Object, Object, Object])
], exports.PowshieldService);

exports.Powshield = class Powshield {
    constructor(element, logger, options, powshieldService, platform) {
        this.element = element;
        this.logger = logger;
        this.options = options;
        this.powshieldService = powshieldService;
        this.platform = platform;
        this.onSubmit = (event) => {
            event.preventDefault();
            this.powshieldService.getChallenge()
                .then((challenge) => {
                return this.powshieldService.solveChallenge(challenge);
            })
                .then((solution) => {
                if (!solution) {
                    throw new Error('Failed to solve challenge');
                }
                const promises = [];
                promises.push(solution);
                promises.push(this.powshieldService.verifySolution(solution));
                return Promise.all(promises);
            })
                .then((response) => {
                if (!response[1]) {
                    throw new Error('Failed to verify solution');
                }
                const solutionBase64 = btoa(JSON.stringify(response[0]));
                const input = this.element.querySelector(this.solutionInputSelector);
                if (!input) {
                    throw new Error('Failed to find solution input');
                }
                input.value = solutionBase64;
                this.element.submit();
            })
                .catch((error) => {
                this.logger.error(error, 'should retry');
            });
        };
        this.logger = logger.scopeTo('Powshield');
        this.logger.trace('constructor');
    }
    binding() {
        this.logger.trace('binding');
        if (!this.solutionInputSelector) {
            this.solutionInputSelector = this.options.get('solutionInputSelector');
        }
    }
    attached() {
        this.logger.trace('attached');
        this.element.addEventListener('submit', this.onSubmit);
    }
};
__decorate([
    aurelia.bindable({ primary: true }),
    __metadata("design:type", String)
], exports.Powshield.prototype, "solutionInputSelector", void 0);
exports.Powshield = __decorate([
    aurelia.customAttribute("bc-powshield"),
    __param(0, aurelia.INode),
    __param(1, aurelia.ILogger),
    __param(2, IPowshieldConfiguration),
    __param(3, IPowshieldService),
    __param(4, aurelia.IPlatform),
    __metadata("design:paramtypes", [HTMLFormElement, Object, Object, Object, Object])
], exports.Powshield);

const DefaultComponents = [
    exports.Powshield,
];
function createPowshieldConfiguration(options) {
    return {
        register(container) {
            const configClass = container.get(IPowshieldConfiguration);
            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents);
        },
        configure(options) {
            return createPowshieldConfiguration(options);
        }
    };
}
const PowshieldConfiguration = createPowshieldConfiguration({});

exports.IHttpService = IHttpService;
exports.IPowshieldConfiguration = IPowshieldConfiguration;
exports.IPowshieldService = IPowshieldService;
exports.PowshieldConfiguration = PowshieldConfiguration;
//# sourceMappingURL=index.js.map
