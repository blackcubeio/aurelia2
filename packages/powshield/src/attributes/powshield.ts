import {bindable, customAttribute, ILogger, INode, IPlatform, resolve, watch} from 'aurelia';
import {IPowshieldConfiguration} from '../configure';
import {IPowshieldService} from '../services/powshield-service';
import {IPowshieldSolution} from '../interfaces/powshield';

@customAttribute("bc-powshield")
export class Powshield {
    @bindable({primary: true}) public solutionInputSelector: string;
    public solutionReady = false;
    private timeValidity: number = 300;
    private interval: number;
    private challengeBase64: string;
    private submitButton: HTMLButtonElement;
    public constructor(
        private readonly element: HTMLFormElement = resolve(INode) as HTMLFormElement,
        private readonly logger: ILogger = resolve(ILogger).scopeTo('Powshield'),
        private readonly options: IPowshieldConfiguration = resolve(IPowshieldConfiguration),
        private readonly powshieldService: IPowshieldService = resolve(IPowshieldService),
        private readonly platform: IPlatform = resolve(IPlatform),
    ) {
        this.logger.trace('constructor');
        this.timeValidity = this.options.get('timeValidity');
    }

    public binding() {
        this.logger.trace('binding');
        if (!this.solutionInputSelector) {
            this.solutionInputSelector = this.options.get('solutionInputSelector')
        }
    }
    public attached() {
        this.logger.trace('attached');
        this.submitButton = this.element.querySelector('[type="submit"]') as HTMLButtonElement;
        this.disableButton();
        this.computeSolution();
        this.interval = this.platform.setInterval(() => {
            this.logger.trace('interval');
            this.solutionReady = false;
            this.computeSolution();
        }, this.timeValidity * 1000);

    }

    public detached() {
        this.logger.trace('detached');
        if (this.interval) {
            this.solutionReady = false;
            this.platform.clearInterval(this.interval);
        }
    }

    @watch('solutionReady')
    public solutionReadyChanged(newState:any, oldState:any) {
        this.logger.trace('solutionReadyChanged', this.solutionReady);
        if (newState === true) {
            this.enableButton();
        } else {
            this.disableButton();
        }
    }

    private disableButton = () => {
        this.submitButton.disabled = true;
        this.submitButton.style.opacity = '0.5';
    }

    private enableButton = () => {
        this.submitButton.disabled = false;
        this.submitButton.style.opacity = '1';
    }

    private computeSolution = () => {
        if (this.solutionReady === false) {
            let date = Date.now();
            this.powshieldService.getChallenge()
                .then((challenge) => {
                    return this.powshieldService.solve(challenge);
                    // return this.powshieldService.solveChallenge(challenge);
                })
                .then((solution: IPowshieldSolution) => {
                    date = Date.now() - date;
                    if (!solution) {
                        throw new Error('Failed to solve challenge');
                    }
                    this.logger.trace('solution', solution.number, 'in', date, 'ms');
                    const promises = [];
                    promises.push(solution);
                    promises.push(this.powshieldService.verifySolution(solution));
                    return Promise.all(promises);
                })
                .then((response) => {
                    if (!response[1]) {
                        throw new Error('Failed to verify solution');
                    }

                    const solutionBase64 = btoa(JSON.stringify(response[0]));

                    const input = this.element.querySelector(this.solutionInputSelector) as HTMLInputElement;
                    if (!input) {
                        throw new Error('Failed to find solution input');
                    }
                    input.value = solutionBase64;
                    this.solutionReady = true;
                })
                .catch((error) => {
                    this.solutionReady = false;
                    this.logger.error(error, 'should retry');
                });
        }
    }
}