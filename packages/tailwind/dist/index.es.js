import { DI } from 'aurelia';

const ITailwindConfiguration = DI.createInterface('ITailwindConfiguration', x => x.singleton(Configure));
class Configure {
    constructor() {
        this._config = {};
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

const DefaultComponents = [];
function createTailwindConfiguration(options) {
    return {
        register(container) {
            const configClass = container.get(ITailwindConfiguration);
            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents);
        },
        configure(options) {
            return createTailwindConfiguration(options);
        }
    };
}
const TailwindConfiguration = createTailwindConfiguration({});

export { TailwindConfiguration };
//# sourceMappingURL=index.es.js.map
