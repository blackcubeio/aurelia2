'use strict';

var aurelia = require('aurelia');

const ITransitionConfiguration = aurelia.DI.createInterface('ITransitionConfiguration', x => x.singleton(TransitionConfigure));
class TransitionConfigure {
    constructor() {
        this._config = {};
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
        return this._config[key];
    }
    set(key, val) {
        this._config[key] = val;
        return this._config[key];
    }
}

exports.TransitionChannels = void 0;
(function (TransitionChannels) {
    TransitionChannels["main"] = "transition:main";
    TransitionChannels["ended"] = "transition:ended";
    TransitionChannels["progress"] = "transition:progress";
})(exports.TransitionChannels || (exports.TransitionChannels = {}));
exports.TransitionModes = void 0;
(function (TransitionModes) {
    TransitionModes["enter"] = "enter";
    TransitionModes["leave"] = "leave";
})(exports.TransitionModes || (exports.TransitionModes = {}));
exports.TransitionStatus = void 0;
(function (TransitionStatus) {
    TransitionStatus[TransitionStatus["ENTERING"] = 0] = "ENTERING";
    TransitionStatus[TransitionStatus["ENTERED"] = 1] = "ENTERED";
    TransitionStatus[TransitionStatus["LEAVING"] = 2] = "LEAVING";
    TransitionStatus[TransitionStatus["LEFT"] = 3] = "LEFT";
})(exports.TransitionStatus || (exports.TransitionStatus = {}));

const ITransitionService = aurelia.DI.createInterface('ITransitionService', (x) => x.singleton(TransitionService));
class TransitionService {
    constructor(logger = aurelia.resolve(aurelia.ILogger).scopeTo('TransitionService'), platform = aurelia.resolve(aurelia.IPlatform), ea = aurelia.resolve(aurelia.IEventAggregator)) {
        this.logger = logger;
        this.platform = platform;
        this.ea = ea;
        this.logger.trace('Constructing');
    }
    enter(element, transition, eventName = undefined, noTransition = false) {
        if (noTransition) {
            return this.enterWithoutTransition(element, transition, eventName);
        }
        else {
            return this.enterWithTransition(element, transition, eventName);
        }
    }
    leave(element, transition, eventName = undefined, noTransition = false) {
        if (noTransition) {
            return this.leaveWithoutTransition(element, transition, eventName);
        }
        else {
            return this.leaveWithTransition(element, transition, eventName);
        }
    }
    enterWithTransition(element, transition, eventName = undefined) {
        if (eventName) {
            this.ea.publish(exports.TransitionChannels.progress, {
                name: eventName,
                status: exports.TransitionStatus.ENTERING
            });
        }
        let transitionRunningTimeout;
        let transitionFinished = false;
        const onTransitionEnterRun = (evt) => {
            if (evt.target === element) {
                evt.stopPropagation();
                element.removeEventListener('transitionrun', onTransitionEnterRun);
                if (transitionRunningTimeout) {
                    this.platform.clearTimeout(transitionRunningTimeout);
                    transitionRunningTimeout = undefined;
                }
                return Promise.resolve();
            }
        };
        const onTransitionEnterEnd = (evt) => {
            if (evt.target === element) {
                evt.stopPropagation();
                element.removeEventListener('transitionend', onTransitionEnterEnd);
                element.removeEventListener('transitioncancel', onTransitionEnterEnd);
                transition.transition.split(/\s+/)
                    .forEach((className) => element.classList.remove(className));
                transitionFinished = true;
                return Promise.resolve();
            }
        };
        element.addEventListener('transitionend', onTransitionEnterEnd);
        element.addEventListener('transitioncancel', onTransitionEnterEnd);
        element.addEventListener('transitionrun', onTransitionEnterRun);
        return this.cleanupTransition(element, transition)
            .then(() => {
            if (transition.show) {
                element.style.display = transition.show;
                return this.waitAnimationFrame();
            }
            else {
                return Promise.resolve();
            }
        })
            .then(() => {
            transition.transition.split(/\s+/)
                .forEach((className) => element.classList.add(className));
            return Promise.resolve();
        })
            .then(() => {
            return this.waitAnimationFrame();
        })
            .then(() => {
            transitionRunningTimeout = this.platform.setTimeout(() => {
                this.logger.warn('Transition timeout - Detach events handler and cleanup');
                element.removeEventListener('transitionend', onTransitionEnterEnd);
                element.removeEventListener('transitioncancel', onTransitionEnterEnd);
                element.removeEventListener('transitionrun', onTransitionEnterRun);
                transition.transition.split(/\s+/)
                    .forEach((className) => element.classList.remove(className));
            }, 250);
            transition.from.split(/\s+/)
                .forEach((className) => element.classList.remove(className));
            transition.to.split(/\s+/)
                .forEach((className) => element.classList.add(className));
            return Promise.resolve();
        })
            .then(() => {
            return new Promise((resolve, reject) => {
                let t = this.platform.setInterval(() => {
                    if (transitionFinished) {
                        this.platform.clearInterval(t);
                        if (eventName) {
                            this.ea.publish(exports.TransitionChannels.progress, {
                                name: eventName,
                                status: exports.TransitionStatus.ENTERED
                            });
                            this.ea.publish(exports.TransitionChannels.ended, {
                                name: eventName,
                                status: exports.TransitionStatus.ENTERED
                            });
                        }
                        resolve(void 0);
                    }
                }, 100);
            });
        });
    }
    enterWithoutTransition(element, transition, eventName = undefined) {
        if (eventName) {
            this.ea.publish(exports.TransitionChannels.progress, {
                name: eventName,
                status: exports.TransitionStatus.ENTERING
            });
        }
        return this.cleanupTransition(element, transition)
            .then(() => {
            transition.from.split(/\s+/)
                .forEach((className) => element.classList.remove(className));
            transition.to.split(/\s+/)
                .forEach((className) => element.classList.add(className));
            if (transition.show) {
                element.style.display = transition.show;
            }
            if (eventName) {
                this.ea.publish(exports.TransitionChannels.progress, {
                    name: eventName,
                    status: exports.TransitionStatus.ENTERED
                });
                this.ea.publish(exports.TransitionChannels.ended, {
                    name: eventName,
                    status: exports.TransitionStatus.ENTERED
                });
            }
            return this.waitAnimationFrame();
        });
    }
    leaveWithTransition(element, transition, eventName = undefined) {
        if (eventName) {
            this.ea.publish(exports.TransitionChannels.progress, {
                name: eventName,
                status: exports.TransitionStatus.LEAVING
            });
        }
        let transitionRunningTimeout;
        let transitionFinished = false;
        const onTransitionLeaveRun = (evt) => {
            if (evt.target === element) {
                evt.stopPropagation();
                element.removeEventListener('transitionrun', onTransitionLeaveRun);
                if (transitionRunningTimeout) {
                    this.platform.clearTimeout(transitionRunningTimeout);
                    transitionRunningTimeout = undefined;
                }
                return Promise.resolve();
            }
        };
        const onTransitionLeaveEnd = (evt) => {
            if (evt.target === element) {
                evt.stopPropagation();
                element.removeEventListener('transitionend', onTransitionLeaveEnd);
                element.removeEventListener('transitioncancel', onTransitionLeaveEnd);
                const t = transition.transitionLeaving || transition.transition;
                t.split(/\s+/)
                    .forEach((className) => element.classList.remove(className));
                if (transition.hide) {
                    element.style.display = transition.hide;
                    // wait next frame
                    transitionFinished = true;
                    return this.waitAnimationFrame();
                }
                else {
                    transitionFinished = true;
                    return Promise.resolve();
                }
            }
        };
        element.addEventListener('transitionend', onTransitionLeaveEnd);
        element.addEventListener('transitioncancel', onTransitionLeaveEnd);
        element.addEventListener('transitionrun', onTransitionLeaveRun);
        return this.cleanupTransition(element, transition)
            .then(() => {
            const t = transition.transitionLeaving || transition.transition;
            t.split(/\s+/)
                .forEach((className) => element.classList.add(className));
            return Promise.resolve();
        })
            .then(() => {
            return this.waitAnimationFrame();
        })
            .then(() => {
            transitionRunningTimeout = this.platform.setTimeout(() => {
                this.logger.warn('Transition timeout - Detach events handler and cleanup');
                element.removeEventListener('transitionend', onTransitionLeaveEnd);
                element.removeEventListener('transitioncancel', onTransitionLeaveEnd);
                element.removeEventListener('transitionrun', onTransitionLeaveRun);
                const t = transition.transitionLeaving || transition.transition;
                t.split(/\s+/)
                    .forEach((className) => element.classList.add(className));
            }, 250);
            transition.to.split(/\s+/)
                .forEach((className) => element.classList.remove(className));
            transition.from.split(/\s+/)
                .forEach((className) => element.classList.add(className));
            return Promise.resolve();
        })
            .then(() => {
            return new Promise((resolve, reject) => {
                let t = this.platform.setInterval(() => {
                    if (transitionFinished) {
                        this.platform.clearInterval(t);
                        if (eventName) {
                            this.ea.publish(exports.TransitionChannels.progress, {
                                name: eventName,
                                status: exports.TransitionStatus.LEFT
                            });
                            this.ea.publish(exports.TransitionChannels.ended, {
                                name: eventName,
                                status: exports.TransitionStatus.LEFT
                            });
                        }
                        resolve(void 0);
                    }
                }, 100);
            });
        });
    }
    leaveWithoutTransition(element, transition, eventName = undefined) {
        if (eventName) {
            this.ea.publish(exports.TransitionChannels.progress, {
                name: eventName,
                status: exports.TransitionStatus.LEAVING
            });
        }
        return this.cleanupTransition(element, transition)
            .then(() => {
            transition.to.split(/\s+/)
                .forEach((className) => element.classList.remove(className));
            transition.from.split(/\s+/)
                .forEach((className) => element.classList.add(className));
            if (transition.hide) {
                element.style.display = transition.hide;
            }
            if (eventName) {
                this.ea.publish(exports.TransitionChannels.progress, {
                    name: eventName,
                    status: exports.TransitionStatus.LEFT
                });
                this.ea.publish(exports.TransitionChannels.ended, {
                    name: eventName,
                    status: exports.TransitionStatus.LEFT
                });
            }
            return this.waitAnimationFrame();
        });
    }
    cleanupTransition(element, transition) {
        transition.transition.split(/\s+/).forEach((className) => {
            element.classList.remove(className);
        });
        if (transition.transitionLeaving) {
            transition.transitionLeaving.split(/\s+/).forEach((className) => {
                element.classList.remove(className);
            });
        }
        return Promise.resolve();
    }
    waitAnimationFrame() {
        return new Promise((resolve) => {
            this.platform.requestAnimationFrame(() => {
                resolve(void 0);
            });
        });
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

let Transition = (() => {
    let _classDecorators = [aurelia.customAttribute('bc-transition')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    _classThis = class {
        /**
         * Attribute used to handle transitions on an element runned when a message is received on the TransitionChannels.main channel
         * example:
         * <div bc-transition="myTransition"
         *      data-transition-from="transform opacity-0 scale-95"
         *      data-transition-to="transform opacity-100 scale-100"
         *      data-transition-transition="transition ease-out duration-100"
         *      data-transition-transition-leaving="transition ease-in duration-75"
         *      data-transition-show="inherit"
         *      data-transition-hide="none"
         * >
         * </div>
         */
        constructor(logger = aurelia.resolve(aurelia.ILogger).scopeTo('Transition'), ea = aurelia.resolve(aurelia.IEventAggregator), platform = aurelia.resolve(aurelia.IPlatform), transitionService = aurelia.resolve(ITransitionService), element = aurelia.resolve(aurelia.INode)) {
            this.logger = logger;
            this.ea = ea;
            this.platform = platform;
            this.transitionService = transitionService;
            this.element = element;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.disposable = __runInitializers(this, _name_extraInitializers);
            this.onTransition = (data) => {
                if (data.name == this.name) {
                    this.logger.trace('onTransition');
                    if (data.mode === exports.TransitionModes.enter) {
                        this.transitionService.enter(this.element, this.transition, this.name);
                    }
                    else if (data.mode === exports.TransitionModes.leave) {
                        this.transitionService.leave(this.element, this.transition, this.name);
                    }
                }
            };
            this.logger = logger.scopeTo('Transition');
            this.logger.trace('constructor');
        }
        attaching() {
            this.logger.trace('attaching');
            this.transition = {
                from: this.element.dataset.transitionFrom || '',
                to: this.element.dataset.transitionTo || '',
                transition: this.element.dataset.transitionTransition || '',
                transitionLeaving: this.element.dataset.transitionTransitionLeaving || undefined,
                show: this.element.dataset.transitionShow || undefined,
                hide: this.element.dataset.transitionHide || undefined,
            };
        }
        attached() {
            this.logger.trace('attached');
            this.disposable = this.ea.subscribe(exports.TransitionChannels.main, this.onTransition);
        }
        dispose() {
            var _a;
            this.logger.trace('dispose');
            (_a = this.disposable) === null || _a === void 0 ? void 0 : _a.dispose();
        }
    };
    __setFunctionName(_classThis, "Transition");
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
    Transition,
];
function createTransitionConfiguration(options) {
    return {
        register(container) {
            const configClass = container.get(ITransitionConfiguration);
            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents);
        },
        configure(options) {
            return createTransitionConfiguration(options);
        }
    };
}
const TransitionConfiguration = createTransitionConfiguration({});

exports.ITransitionConfiguration = ITransitionConfiguration;
exports.ITransitionService = ITransitionService;
exports.TransitionConfiguration = TransitionConfiguration;
exports.TransitionService = TransitionService;
//# sourceMappingURL=index.js.map
