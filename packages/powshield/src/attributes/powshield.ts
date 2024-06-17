import {bindable, customAttribute, ILogger, INode, IPlatform} from 'aurelia';
import {IPowshieldConfiguration} from '../configure';
import {IPowshieldService} from '../services/powshield-service';

@customAttribute("bc-powshield")
export class Powshield {
    @bindable({primary: true}) public solutionInputSelector: string;
    private challengeBase64: string;
    public constructor(
        @INode private readonly element: HTMLFormElement,
        @ILogger private readonly logger: ILogger,
        @IPowshieldConfiguration private readonly options: IPowshieldConfiguration,
        @IPowshieldService private readonly powshieldService: IPowshieldService,
        @IPlatform private readonly platform: IPlatform
    ) {
        this.logger = logger.scopeTo('Powshield');
        this.logger.trace('constructor');
    }

    public binding() {
        this.logger.trace('binding');
        if (!this.solutionInputSelector) {
            this.solutionInputSelector = this.options.get('solutionInputSelector')
        }
    }
    public attached() {
        this.logger.trace('attached');
        this.element.addEventListener('submit', this.onSubmit);
    }

    private onSubmit = (event: Event) => {
        event.preventDefault();
        this.powshieldService.getChallenge()
            .then((challenge) => {
                return this.powshieldService.solveChallenge(challenge)
            })
            .then((solution) => {
                if (!solution) {
                    throw new Error('Failed to solve challenge');
                }
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

                this.element.submit();
            })
            .catch((error) => {
                this.logger.error(error, 'should retry');
            });
    }
}