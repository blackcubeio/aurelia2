import { ILogger, IPlatform } from 'aurelia';
import { IPowshieldConfiguration } from '../configure';
import { IPowshieldService } from '../services/powshield-service';
export declare class Powshield {
    private readonly element;
    private readonly logger;
    private readonly options;
    private readonly powshieldService;
    private readonly platform;
    solutionInputSelector: string;
    private challengeBase64;
    constructor(element?: HTMLFormElement, logger?: ILogger, options?: IPowshieldConfiguration, powshieldService?: IPowshieldService, platform?: IPlatform);
    binding(): void;
    attached(): void;
    private onSubmit;
}
//# sourceMappingURL=powshield.d.ts.map