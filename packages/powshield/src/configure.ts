import { DI } from "aurelia";

// --------------- Powshield ---------------
export interface IPowshieldConfig {
    generateChallengeUrl?: string;
    verifySolutionUrl?: string;
    solutionInputSelector?: string;
    workers?: number;
    timeValidity?: number;
}

export interface IPowshieldConfiguration extends PowshieldConfigure {}

export const IPowshieldConfiguration = DI.createInterface<IPowshieldConfiguration>('IPowshieldConfiguration', x => x.singleton(PowshieldConfigure));

export class PowshieldConfigure {
    protected _config: IPowshieldConfig;

    constructor() {
        this._config = {
            generateChallengeUrl: '/powshield/generate-challenge',
            verifySolutionUrl: '/powshield/verify-solution',
            solutionInputSelector: '#powshieldSolution',
            workers: 10,
            timeValidity: 300
        };
        console.log('PowshieldConfigure constructor');
    }
    configure(incoming: IPowshieldConfig = undefined) {
        if (incoming) {
            Object.assign(this._config, incoming);
        }
        console.log('PowshieldConfigure configure', incoming);
        return this;
    }
    getOptions(): IPowshieldConfig {
        return this._config;
    }

    options(obj: IPowshieldConfig) {
        Object.assign(this._config, obj);
    }

    get(key: string) {
        // @ts-ignore
        return this._config[key];
    }

    set(key: string, val: any) {
        // @ts-ignore
        this._config[key] = val;
        // @ts-ignore
        return this._config[key];
    }
}