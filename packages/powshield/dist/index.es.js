import { DI, resolve, IEventAggregator, ILogger, IPlatform, customAttribute, bindable, watch, INode } from 'aurelia';
import { IHttpClient } from '@aurelia/fetch-client';

const IPowshieldConfiguration = DI.createInterface('IPowshieldConfiguration', x => x.singleton(PowshieldConfigure));
class PowshieldConfigure {
    constructor() {
        this._config = {
            generateChallengeUrl: '/powshield/generate-challenge',
            verifySolutionUrl: '/powshield/verify-solution',
            solutionInputSelector: '#powshieldSolution',
            workers: navigator.hardwareConcurrency || 10,
            timeValidity: 300
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

const IHttpService = DI.createInterface('IHttpService', (x) => x.singleton(HttpService));
class HttpService {
    constructor(httpClient = resolve(IHttpClient), ea = resolve(IEventAggregator)) {
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

class InlineWorker {
    constructor() {
        this.status = InlineWorkerState.INITIALIZED;
        this.run = (job) => {
            return new Promise((resolve, reject) => {
                this.worker.onmessage = (ev) => {
                    job.statistics.ended = Date.now();
                    this.status = ev.data.status;
                    ev.data.statistics = job.statistics;
                    resolve(ev.data);
                };
                this.worker.onerror = (err) => {
                    job.statistics.ended = Date.now();
                    this.status = InlineWorkerState.FAILED;
                    reject({
                        status: InlineWorkerState.FAILED,
                        message: err,
                        statistics: job.statistics
                    });
                };
                job.statistics.started = Date.now();
                this.worker.postMessage({
                    command: 'run',
                    args: [this.convertJobToObj(job)]
                });
            });
        };
        // creates an worker that runs a job
        this.blobURL = URL.createObjectURL(new Blob([
            this.getWorkerScript()
        ], {
            type: 'application/javascript'
        }));
        this.worker = new Worker(this.blobURL);
    }
    convertJobToObj(job) {
        return {
            id: job.id,
            args: job.args,
            doFunction: job.doFunction.toString()
        };
    }
    /**
     * destroys the Taskmanager if not needed anymore.
     */
    destroy() {
        this.worker.terminate();
        URL.revokeObjectURL(this.blobURL);
    }
    getWorkerScript() {
        return `var job = null;
var base = self;

onmessage = function (msg) {
    var data = msg.data;
    var command = data.command;
    var args = data.args;

    switch (command) {
        case("run"):
            base.job = args[0];
            var func = new Function("return " + base.job.doFunction)();
            func(base.job.args).then(function (result) {
                base.postMessage({
                    status: "finished",
                    result: result
                });
            }).catch(function (error) {
                base.postMessage({
                    type: "failed",
                    message: error
                });
            });
            break;
        default:
            base.postMessage({
                status: "failed",
                message: "invalid command"
            });
            break;
    }
}`;
    }
}
var InlineWorkerState;
(function (InlineWorkerState) {
    InlineWorkerState["INITIALIZED"] = "initialized";
    InlineWorkerState["RUNNING"] = "running";
    InlineWorkerState["FINISHED"] = "finished";
    InlineWorkerState["FAILED"] = "failed";
    InlineWorkerState["STOPPED"] = "stopped";
})(InlineWorkerState || (InlineWorkerState = {}));
class InlineWorkerJob {
    get statistics() {
        return this._statistics;
    }
    set statistics(value) {
        this._statistics = value;
    }
    get args() {
        return this._args;
    }
    get id() {
        return this._id;
    }
    constructor(doFunction, args) {
        this._args = [];
        this._statistics = {
            started: -1,
            ended: -1
        };
        this.doFunction = (args) => {
            return new Promise((resolve, reject) => {
                reject('not implemented');
            });
        };
        this._id = ++InlineWorkerJob.jobIDCounter;
        this.doFunction = doFunction;
        this._args = args;
    }
}
InlineWorkerJob.jobIDCounter = 0;

const solveChallenge = (challenge) => {
    const encoder = new TextEncoder();
    const ab2hex = (ab) => {
        return [...new Uint8Array(ab)]
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('');
    };
    const hash = async (algorithm, data) => {
        return crypto.subtle.digest(algorithm.toUpperCase(), typeof data === 'string' ? encoder.encode(data) : new Uint8Array(data));
    };
    const hashHex = async (algorithm, data) => {
        return ab2hex(await hash(algorithm, data));
    };
    const searchSecretNumber = async () => {
        for (let secretNumber = challenge.start; secretNumber <= challenge.max; secretNumber += 1) {
            const t = await hashHex(challenge.algorithm, challenge.salt + secretNumber + challenge.timestamp);
            if (t === challenge.challenge) {
                const solution = Object.assign(Object.assign({}, challenge), { number: secretNumber });
                return solution;
            }
        }
        return null;
    };
    return searchSecretNumber();
};

const IPowshieldService = DI.createInterface('IPowshieldService', (x) => x.singleton(PowshieldService));
class PowshieldService {
    constructor(logger = resolve(ILogger), httpService = resolve(IHttpService), options = resolve(IPowshieldConfiguration), platform = resolve(IPlatform)) {
        this.logger = logger;
        this.httpService = httpService;
        this.options = options;
        this.platform = platform;
        this.encoder = new TextEncoder();
        this.workers = 1;
        this.workersPool = new Set();
        this.logger = logger.scopeTo('PowshieldService');
        this.logger.trace('constructor');
        this.generateChallengeUrl = this.options.get('generateChallengeUrl');
        this.verifySolutionUrl = this.options.get('verifySolutionUrl');
        if (typeof (Worker) !== "undefined") {
            this.workers = this.options.get('workers');
        }
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
    solve(challenge) {
        if (this.workers > 1) {
            return this.solveWorkerChallenge(challenge);
        }
        else {
            return solveChallenge(challenge);
        }
    }
    solveWorkerChallenge(challenge) {
        const promises = [];
        for (let i = 0; i < this.workers; i++) {
            const batchSize = Math.ceil((challenge.max - challenge.start) / this.workers);
            const subChallenge = Object.assign(Object.assign({}, challenge), { start: batchSize * i, max: batchSize * (i + 1) });
            const inlineWorker = new InlineWorker();
            this.workersPool.add(inlineWorker);
            const inlineWorkerJob = new InlineWorkerJob((args) => {
                const subChallenge = args[0];
                const solveChallenge = (challenge) => {
                    const encoder = new TextEncoder();
                    const ab2hex = (ab) => {
                        return [...new Uint8Array(ab)]
                            .map((x) => x.toString(16).padStart(2, '0'))
                            .join('');
                    };
                    const hash = async (algorithm, data) => {
                        return crypto.subtle.digest(algorithm.toUpperCase(), typeof data === 'string' ? encoder.encode(data) : new Uint8Array(data));
                    };
                    const hashHex = async (algorithm, data) => {
                        return ab2hex(await hash(algorithm, data));
                    };
                    const searchSecretNumber = async () => {
                        for (let secretNumber = challenge.start; secretNumber <= challenge.max; secretNumber += 1) {
                            const t = await hashHex(challenge.algorithm, challenge.salt + secretNumber + challenge.timestamp);
                            if (t === challenge.challenge) {
                                const solution = Object.assign(Object.assign({}, challenge), { number: secretNumber });
                                return solution;
                            }
                        }
                        return null;
                    };
                    return searchSecretNumber();
                };
                return solveChallenge(subChallenge);
            }, [subChallenge]);
            promises.push(inlineWorker.run(inlineWorkerJob).then((ev) => {
                // finished
                (ev.statistics.ended - ev.statistics.started) / 1000;
                //console.log(`the result is ${ev.result}`);
                //console.log(`time left for calculation: ${secondsLeft}`);
                return ev.result;
            }).catch((error) => {
                // error
                // console.log(`error`);
                // console.error(error);
                return null;
            }));
        }
        return Promise.all(promises)
            .then((results) => {
            return results.reduce((acc, val) => {
                return val !== null ? val : acc;
            }, null);
        })
            .then((solution) => {
            this.workersPool.forEach((worker) => {
                this.logger.trace('destroy worker');
                worker.destroy();
                this.workersPool.delete(worker);
            });
            return solution;
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

let Powshield = (() => {
    let _classDecorators = [customAttribute("bc-powshield")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _solutionInputSelector_decorators;
    let _solutionInputSelector_initializers = [];
    let _solutionInputSelector_extraInitializers = [];
    let _solutionReadyChanged_decorators;
    _classThis = class {
        constructor(element = resolve(INode), logger = resolve(ILogger).scopeTo('Powshield'), options = resolve(IPowshieldConfiguration), powshieldService = resolve(IPowshieldService), platform = resolve(IPlatform)) {
            this.element = (__runInitializers(this, _instanceExtraInitializers), element);
            this.logger = logger;
            this.options = options;
            this.powshieldService = powshieldService;
            this.platform = platform;
            this.solutionInputSelector = __runInitializers(this, _solutionInputSelector_initializers, void 0);
            this.solutionReady = (__runInitializers(this, _solutionInputSelector_extraInitializers), false);
            this.timeValidity = 300;
            this.disableButton = () => {
                this.submitButton.disabled = true;
                this.submitButton.style.opacity = '0.5';
            };
            this.enableButton = () => {
                this.submitButton.disabled = false;
                this.submitButton.style.opacity = '1';
            };
            this.computeSolution = () => {
                if (this.solutionReady === false) {
                    let date = Date.now();
                    this.powshieldService.getChallenge()
                        .then((challenge) => {
                        return this.powshieldService.solve(challenge);
                        // return this.powshieldService.solveChallenge(challenge);
                    })
                        .then((solution) => {
                        date = Date.now() - date;
                        if (!solution) {
                            throw new Error('Failed to solve challenge');
                        }
                        this.logger.trace('solution', solution.number, 'in', date, 'ms');
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
                        this.solutionReady = true;
                    })
                        .catch((error) => {
                        this.solutionReady = false;
                        this.logger.error(error, 'should retry');
                    });
                }
            };
            this.logger.trace('constructor');
            this.timeValidity = this.options.get('timeValidity');
        }
        binding() {
            this.logger.trace('binding');
            if (!this.solutionInputSelector) {
                this.solutionInputSelector = this.options.get('solutionInputSelector');
            }
        }
        attached() {
            this.logger.trace('attached');
            this.submitButton = this.element.querySelector('[type="submit"]');
            this.disableButton();
            this.computeSolution();
            this.interval = this.platform.setInterval(() => {
                this.logger.trace('interval');
                this.solutionReady = false;
                this.computeSolution();
            }, this.timeValidity * 1000);
        }
        detached() {
            this.logger.trace('detached');
            if (this.interval) {
                this.solutionReady = false;
                this.platform.clearInterval(this.interval);
            }
        }
        solutionReadyChanged(newState, oldState) {
            this.logger.trace('solutionReadyChanged', this.solutionReady);
            if (newState === true) {
                this.enableButton();
            }
            else {
                this.disableButton();
            }
        }
    };
    __setFunctionName(_classThis, "Powshield");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _solutionInputSelector_decorators = [bindable({ primary: true })];
        _solutionReadyChanged_decorators = [watch('solutionReady')];
        __esDecorate(_classThis, null, _solutionReadyChanged_decorators, { kind: "method", name: "solutionReadyChanged", static: false, private: false, access: { has: obj => "solutionReadyChanged" in obj, get: obj => obj.solutionReadyChanged }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _solutionInputSelector_decorators, { kind: "field", name: "solutionInputSelector", static: false, private: false, access: { has: obj => "solutionInputSelector" in obj, get: obj => obj.solutionInputSelector, set: (obj, value) => { obj.solutionInputSelector = value; } }, metadata: _metadata }, _solutionInputSelector_initializers, _solutionInputSelector_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

const DefaultComponents = [
    Powshield,
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

export { HttpService, IHttpService, IPowshieldConfiguration, IPowshieldService, Powshield, PowshieldConfiguration, PowshieldService };
//# sourceMappingURL=index.es.js.map
