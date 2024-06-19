import { Algorithm } from '../types/powshield';
export interface IPowshieldChallenge {
    algorithm: Algorithm;
    timestamp: string;
    challenge: string;
    signature: string;
    salt: string;
    start: number;
    max: number;
}
export interface IPowshieldSolution extends IPowshieldChallenge {
    number: number;
}
//# sourceMappingURL=powshield.d.ts.map