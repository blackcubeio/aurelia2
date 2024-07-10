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
    solutionReady: boolean;
    private timeValidity;
    private interval;
    private challengeBase64;
    private submitButton;
    constructor(element?: HTMLFormElement, logger?: ILogger, options?: IPowshieldConfiguration, powshieldService?: IPowshieldService, platform?: IPlatform);
    binding(): void;
    attached(): void;
    detached(): void;
    solutionReadyChanged(newState: any, oldState: any): void;
    private disableButton;
    private enableButton;
    private computeSolution;
}
//# sourceMappingURL=powshield.d.ts.map