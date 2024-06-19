import { ILogger } from 'aurelia';
import { IPowshieldChallenge, IPowshieldSolution } from '../interfaces/powshield';
import { IHttpService } from './http-service';
import { IPowshieldConfiguration } from '../configure';
export declare const IPowshieldService: import("@aurelia/kernel").InterfaceSymbol<IPowshieldService>;
export interface IPowshieldService extends PowshieldService {
}
export declare class PowshieldService {
    private readonly logger;
    private readonly httpService;
    private readonly options;
    private encoder;
    private generateChallengeUrl;
    private verifySolutionUrl;
    constructor(logger?: ILogger, httpService?: IHttpService, options?: IPowshieldConfiguration);
    getChallenge(): Promise<IPowshieldChallenge>;
    verifySolution(solution: IPowshieldSolution): Promise<boolean>;
    solveChallenge(challenge: IPowshieldChallenge): Promise<IPowshieldSolution | null>;
    private ab2hex;
    private hash;
    private hashHex;
}
//# sourceMappingURL=powshield-service.d.ts.map