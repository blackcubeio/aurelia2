import { DI, resolve, ILogger, containerless, customElement, bindable, watch } from 'aurelia';

const ISvgConfiguration = DI.createInterface('ISvgConfiguration', x => x.singleton(SvgConfigure));
class SvgConfigure {
    constructor() {
        this._config = {
            svgStyle: 'contents',
        };
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

const ISpritesServices = /*@__PURE__*/ DI.createInterface('ISpritesServices', (x) => x.singleton(SpritesServices));
class SpritesServices {
    constructor(logger = resolve(ILogger).scopeTo('SpritesServices'), options = resolve(ISvgConfiguration)) {
        this.logger = logger;
        this.options = options;
        this.fetchDone = false;
        this.logger.trace('constructor');
    }
    getSprites() {
        if (this.fetchDone === false) {
            const svgSprites = this.options.get('svgSprites');
            if (!svgSprites) {
                throw new Error('svgSprites not defined in configuration');
            }
            this.fetchDone = true;
            this.svjObjects = fetch(svgSprites)
                .then((response) => {
                return response.text();
            })
                .then((data) => {
                this.logger.trace('getSprites:fetch');
                const parser = new DOMParser();
                const serializer = new XMLSerializer();
                const svg = parser.parseFromString(data, 'image/svg+xml');
                const svjObjects = {};
                svg.querySelectorAll('symbol').forEach((symbol) => {
                    const id = symbol.getAttribute('id');
                    const viewBox = symbol.getAttribute('viewBox');
                    if (id && viewBox) {
                        const object = {
                            viewBox: viewBox,
                            path: []
                        };
                        symbol.childNodes.forEach((path) => {
                            const nodeString = serializer.serializeToString(path).trim();
                            if (nodeString.length > 1) {
                                object.path.push(nodeString);
                            }
                        });
                        svjObjects[id] = object;
                    }
                });
                return svjObjects;
            });
        }
        return this.svjObjects;
    }
}

var template = `<template>
    <svg ref="svg" xmlns="http://www.w3.org/2000/svg"></svg>
</template>`;

let SvgSprite = (() => {
    let _classDecorators = [containerless(), customElement({
            name: 'bc-svg-sprite',
            template
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _class_decorators;
    let _class_initializers = [];
    let _class_extraInitializers = [];
    let _style_decorators;
    let _style_initializers = [];
    let _style_extraInitializers = [];
    let _width_decorators;
    let _width_initializers = [];
    let _width_extraInitializers = [];
    let _height_decorators;
    let _height_initializers = [];
    let _height_extraInitializers = [];
    let _ariaHidden_decorators;
    let _ariaHidden_initializers = [];
    let _ariaHidden_extraInitializers = [];
    let _focusable_decorators;
    let _focusable_initializers = [];
    let _focusable_extraInitializers = [];
    let _drawSvg_decorators;
    _classThis = class {
        constructor(logger = resolve(ILogger).scopeTo('SvgSprite'), spriteServices = resolve(ISpritesServices)) {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), logger);
            this.spriteServices = spriteServices;
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.class = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _class_initializers, void 0));
            this.style = (__runInitializers(this, _class_extraInitializers), __runInitializers(this, _style_initializers, void 0));
            this.width = (__runInitializers(this, _style_extraInitializers), __runInitializers(this, _width_initializers, void 0));
            this.height = (__runInitializers(this, _width_extraInitializers), __runInitializers(this, _height_initializers, void 0));
            this.ariaHidden = (__runInitializers(this, _height_extraInitializers), __runInitializers(this, _ariaHidden_initializers, void 0));
            this.focusable = (__runInitializers(this, _ariaHidden_extraInitializers), __runInitializers(this, _focusable_initializers, void 0));
            this.svg = __runInitializers(this, _focusable_extraInitializers);
            this.svjObjects = {};
            this.ready = false;
            this.attributes = {};
            this.logger.trace('constructor');
        }
        bound() {
            return this.spriteServices.getSprites().then((svgObjects) => {
                this.svjObjects = svgObjects;
                this.ready = true;
                this.drawSvg();
                return this.ready;
            });
        }
        attaching() {
            this.logger.trace('attaching');
        }
        drawSvg() {
            if (this.ready) {
                if (this.svjObjects[this.name]) {
                    if (this.svjObjects[this.name].viewBox) {
                        this.svg.setAttribute('viewBox', this.svjObjects[this.name].viewBox);
                    }
                    this.svg.innerHTML = this.svjObjects[this.name].path.join('\n');
                    if (this.class) {
                        this.svg.setAttribute('class', this.class);
                    }
                    if (this.style) {
                        this.svg.setAttribute('style', this.style);
                    }
                    if (this.width) {
                        this.svg.setAttribute('width', this.width);
                    }
                    if (this.height) {
                        this.svg.setAttribute('height', this.height);
                    }
                    if (this.ariaHidden) {
                        this.svg.setAttribute('aria-hidden', this.ariaHidden);
                    }
                    if (this.focusable) {
                        this.svg.setAttribute('focusable', this.focusable);
                    }
                    this.logger.debug('Draw SVG');
                }
            }
        }
    };
    __setFunctionName(_classThis, "SvgSprite");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [bindable()];
        _class_decorators = [bindable()];
        _style_decorators = [bindable()];
        _width_decorators = [bindable()];
        _height_decorators = [bindable()];
        _ariaHidden_decorators = [bindable()];
        _focusable_decorators = [bindable()];
        _drawSvg_decorators = [watch('name')];
        __esDecorate(_classThis, null, _drawSvg_decorators, { kind: "method", name: "drawSvg", static: false, private: false, access: { has: obj => "drawSvg" in obj, get: obj => obj.drawSvg }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _class_decorators, { kind: "field", name: "class", static: false, private: false, access: { has: obj => "class" in obj, get: obj => obj.class, set: (obj, value) => { obj.class = value; } }, metadata: _metadata }, _class_initializers, _class_extraInitializers);
        __esDecorate(null, null, _style_decorators, { kind: "field", name: "style", static: false, private: false, access: { has: obj => "style" in obj, get: obj => obj.style, set: (obj, value) => { obj.style = value; } }, metadata: _metadata }, _style_initializers, _style_extraInitializers);
        __esDecorate(null, null, _width_decorators, { kind: "field", name: "width", static: false, private: false, access: { has: obj => "width" in obj, get: obj => obj.width, set: (obj, value) => { obj.width = value; } }, metadata: _metadata }, _width_initializers, _width_extraInitializers);
        __esDecorate(null, null, _height_decorators, { kind: "field", name: "height", static: false, private: false, access: { has: obj => "height" in obj, get: obj => obj.height, set: (obj, value) => { obj.height = value; } }, metadata: _metadata }, _height_initializers, _height_extraInitializers);
        __esDecorate(null, null, _ariaHidden_decorators, { kind: "field", name: "ariaHidden", static: false, private: false, access: { has: obj => "ariaHidden" in obj, get: obj => obj.ariaHidden, set: (obj, value) => { obj.ariaHidden = value; } }, metadata: _metadata }, _ariaHidden_initializers, _ariaHidden_extraInitializers);
        __esDecorate(null, null, _focusable_decorators, { kind: "field", name: "focusable", static: false, private: false, access: { has: obj => "focusable" in obj, get: obj => obj.focusable, set: (obj, value) => { obj.focusable = value; } }, metadata: _metadata }, _focusable_initializers, _focusable_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();

const DefaultComponents = [
    SvgSprite,
];
function createSvgConfiguration(options) {
    return {
        register(container) {
            const configClass = container.get(ISvgConfiguration);
            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents);
        },
        configure(options) {
            return createSvgConfiguration(options);
        }
    };
}
const ToolsConfiguration = createSvgConfiguration({});

export { ISvgConfiguration, ToolsConfiguration };
//# sourceMappingURL=index.es.js.map
