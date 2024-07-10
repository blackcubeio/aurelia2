import { ILogger, IPlatform } from 'aurelia';
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
    private readonly platform;
    private encoder;
    private generateChallengeUrl;
    private verifySolutionUrl;
    private workers;
    constructor(logger?: ILogger, httpService?: IHttpService, options?: IPowshieldConfiguration, platform?: IPlatform);
    getChallenge(): Promise<IPowshieldChallenge>;
    verifySolution(solution: IPowshieldSolution): Promise<boolean>;
    solve(challenge: IPowshieldChallenge): Promise<any>;
    private workersPool;
    solveWorkerChallenge(challenge: IPowshieldChallenge): Promise<any>;
    solveChallenge(challenge: IPowshieldChallenge): Promise<IPowshieldSolution | null>;
    private ab2hex;
    private hash;
    private hashHex;
}
//# sourceMappingURL=powshield-service.d.ts.map