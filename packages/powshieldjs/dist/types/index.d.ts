import { IPowshieldChallenge, IPowshieldSolution } from './interfaces/powshield';
export declare class Powshield {
    private encoder;
    getChallenge(url: string): Promise<IPowshieldChallenge>;
    verifySolution(url: string, solution: IPowshieldSolution): Promise<boolean>;
    solveChallenge(challenge: IPowshieldChallenge): Promise<IPowshieldSolution | null>;
    private ab2hex;
    private hash;
    private hashHex;
}
//# sourceMappingURL=index.d.ts.map