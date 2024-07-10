import {IPowshieldChallenge, IPowshieldSolution} from '../interfaces/powshield';
import {Algorithm} from '../types/powshield';



export const solveChallenge = (
    challenge: IPowshieldChallenge
): Promise<IPowshieldSolution | null> => {
    const encoder: TextEncoder = new TextEncoder();

    const ab2hex = (ab: ArrayBuffer | Uint8Array) => {
        return [...new Uint8Array(ab)]
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('');
    }
    const hash = async (algorithm: Algorithm, data: ArrayBuffer | string) => {
        return crypto.subtle.digest(
            algorithm.toUpperCase(),
            typeof data === 'string' ? encoder.encode(data) : new Uint8Array(data)
        );
    }

    const hashHex = async (
        algorithm: Algorithm,
        data: ArrayBuffer | string
    ) => {
        return ab2hex(await hash(algorithm, data));
    }
    const startTime = Date.now();
    const searchSecretNumber = async () => {
        for (let secretNumber = challenge.start; secretNumber <= challenge.max; secretNumber += 1) {
            const t = await hashHex(challenge.algorithm, challenge.salt + secretNumber + challenge.timestamp);
            if (t === challenge.challenge) {
                const solution: IPowshieldSolution = {...challenge, number: secretNumber};
                return solution;
            }
        }
        return null;
    }
    return searchSecretNumber();
}