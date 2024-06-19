import {DI, ILogger, resolve} from 'aurelia';
import {Algorithm} from '../types/powshield';
import {IPowshieldChallenge, IPowshieldSolution} from '../interfaces/powshield';
import {IHttpService} from './http-service';
import {IPowshieldConfiguration} from '../configure';

export const IPowshieldService =
    DI.createInterface<IPowshieldService>('IPowshieldService', (x) =>
        x.singleton(PowshieldService)
    );
export interface IPowshieldService extends PowshieldService {}
export class PowshieldService {

    private encoder: TextEncoder = new TextEncoder();

    private generateChallengeUrl: string;
    private verifySolutionUrl: string;

    public constructor(
        private readonly logger: ILogger = resolve(ILogger),
        private readonly httpService: IHttpService = resolve(IHttpService),
        private readonly options: IPowshieldConfiguration = resolve(IPowshieldConfiguration),
    ) {
        this.logger = logger.scopeTo('PowshieldService');
        this.logger.trace('constructor');
        this.generateChallengeUrl = this.options.get('generateChallengeUrl');
        this.verifySolutionUrl = this.options.get('verifySolutionUrl');

    }

    public getChallenge(): Promise<IPowshieldChallenge> {
        return this.httpService.getJson(this.generateChallengeUrl)
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Failed to get challenge');
                }
                let bytes = atob(response.data as string);
                let decoded: IPowshieldChallenge = JSON.parse(bytes);
                return decoded;
            });
    }

    public verifySolution(solution: IPowshieldSolution): Promise<boolean> {
        const payload = { payload: btoa(JSON.stringify(solution))};
        return this.httpService.postJson(this.verifySolutionUrl, payload)
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Failed to verify solution');
                }
                return response.data as boolean;
            });
    }

    public solveChallenge(
        challenge: IPowshieldChallenge
    ): Promise<IPowshieldSolution | null> {
        const startTime = Date.now();
        const searchSecretNumber = async () => {
            for (let secretNumber = challenge.start; secretNumber <= challenge.max; secretNumber += 1) {
                const t = await this.hashHex(challenge.algorithm, challenge.salt + secretNumber + challenge.timestamp);
                if (t === challenge.challenge) {
                    const solution: IPowshieldSolution = {...challenge, number: secretNumber};
                    return solution;
                }
            }
            return null;
        }
        return searchSecretNumber();
    }

    private ab2hex(ab: ArrayBuffer | Uint8Array) {
        return [...new Uint8Array(ab)]
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('');
    }

    private async hash(algorithm: Algorithm, data: ArrayBuffer | string) {
        return crypto.subtle.digest(
            algorithm.toUpperCase(),
            typeof data === 'string' ? this.encoder.encode(data) : new Uint8Array(data)
        );
    }

    private async hashHex(
        algorithm: Algorithm,
        data: ArrayBuffer | string
    ) {
        return this.ab2hex(await this.hash(algorithm, data));
    }
}