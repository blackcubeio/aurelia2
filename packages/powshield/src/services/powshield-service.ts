import {DI, ILogger, IPlatform, resolve} from 'aurelia';
import {Algorithm} from '../types/powshield';
import {IPowshieldChallenge, IPowshieldSolution} from '../interfaces/powshield';
import {IHttpService} from './http-service';
import {IPowshieldConfiguration} from '../configure';
import {InlineWorker, InlineWorkerEvent, InlineWorkerJob} from '../helpers/inline-worker';
import {solveChallenge} from '../helpers/solver';

export const IPowshieldService =
    DI.createInterface<IPowshieldService>('IPowshieldService', (x) =>
        x.singleton(PowshieldService)
    );
export interface IPowshieldService extends PowshieldService {}
export class PowshieldService {

    private encoder: TextEncoder = new TextEncoder();

    private generateChallengeUrl: string;
    private verifySolutionUrl: string;
    private workers: number = 1;

    public constructor(
        private readonly logger: ILogger = resolve(ILogger),
        private readonly httpService: IHttpService = resolve(IHttpService),
        private readonly options: IPowshieldConfiguration = resolve(IPowshieldConfiguration),
        private readonly platform: IPlatform = resolve(IPlatform),
    ) {
        this.logger = logger.scopeTo('PowshieldService');
        this.logger.trace('constructor');
        this.generateChallengeUrl = this.options.get('generateChallengeUrl');
        this.verifySolutionUrl = this.options.get('verifySolutionUrl');
        if (typeof(Worker) !== "undefined") {
            this.workers = this.options.get('workers');
        }
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

    public solve(challenge: IPowshieldChallenge) {
        if (this.workers > 1) {
            return this.solveWorkerChallenge(challenge);
        } else {
            return solveChallenge(challenge);
        }
    }
    private workersPool: Set<InlineWorker> = new Set();
    public solveWorkerChallenge(
        challenge: IPowshieldChallenge
    ) {

        const promises = [];
        for (let i = 0; i < this.workers; i++) {
            const batchSize = Math.ceil((challenge.max - challenge.start) / this.workers);
            const subChallenge = {
                ...challenge,
                start: batchSize * i,
                max: batchSize * (i + 1)
            };
            const inlineWorker = new InlineWorker();
            this.workersPool.add(inlineWorker);
            const inlineWorkerJob: InlineWorkerJob = new InlineWorkerJob((args: any[]) => {
                const subChallenge = args[0];

                    const solveChallenge = (
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
                return solveChallenge(subChallenge);
            }, [subChallenge]);
            promises.push(
                inlineWorker.run(inlineWorkerJob).then((ev: InlineWorkerEvent) => {
                    // finished
                    const secondsLeft = (ev.statistics.ended - ev.statistics.started) / 1000;
                    //console.log(`the result is ${ev.result}`);
                    //console.log(`time left for calculation: ${secondsLeft}`);
                    return ev.result;
                }).catch((error) => {
                    // error
                    // console.log(`error`);
                    // console.error(error);
                    return null;
                })
            );
        }
        return Promise.all(promises)
            .then((results) => {
                return results.reduce((acc, val) => {
                    return val !== null ? val : acc;
                }, null);
            })
            .then((solution) => {
                this.workersPool.forEach((worker) => {
                    this.logger.trace('destroy worker');
                    worker.destroy();
                    this.workersPool.delete(worker);
                });
                return solution;
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