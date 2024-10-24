import {
    bindable,
    customAttribute,
    ICustomAttributeViewModel,
    IDisposable,
    IEventAggregator,
    ILogger,
    INode,
    IPlatform,
    resolve
} from "aurelia";
import {TransitionChannels, TransitionModes} from "../enums/transition-enums";
import {ITransitionService} from "../services/transition-service";
import {ITransition, ITransitionRun} from "../interfaces/transition-interface";


@customAttribute('bc-transition')
export class Transition implements ICustomAttributeViewModel
{
    @bindable( {primary: true} ) name: string;
    private disposable:IDisposable;

    private transition: ITransition;

    /**
     * Attribute used to handle transitions on an element runned when a message is received on the TransitionChannels.main channel
     * example:
     * <div bc-transition="myTransition"
     *      data-transition-from="transform opacity-0 scale-95"
     *      data-transition-to="transform opacity-100 scale-100"
     *      data-transition-transition="transition ease-out duration-100"
     *      data-transition-transition-leaving="transition ease-in duration-75"
     *      data-transition-show="inherit"
     *      data-transition-hide="none"
     * >
     * </div>
     */
    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('Transition'),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly platform:IPlatform = resolve(IPlatform),
        private readonly transitionService: ITransitionService = resolve(ITransitionService),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement
    ) {
        this.logger = logger.scopeTo('Transition');
        this.logger.trace('constructor')
    }

    public attaching() {
        this.logger.trace('attaching');
        this.transition = {
            from: this.element.dataset.transitionFrom || '',
            to: this.element.dataset.transitionTo || '',
            transition: this.element.dataset.transitionTransition || '',
            transitionLeaving: this.element.dataset.transitionTransitionLeaving || undefined,
            show: this.element.dataset.transitionShow || undefined,
            hide: this.element.dataset.transitionHide || undefined,
        }
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(TransitionChannels.main, this.onTransition);
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.disposable?.dispose();
    }

    public onTransition = (data:ITransitionRun) => {
        if (data.name == this.name) {
            this.logger.trace('onTransition');
            if (data.mode === TransitionModes.enter) {
                this.transitionService.enter(this.element, this.transition, this.name);
            } else if (data.mode === TransitionModes.leave) {
                this.transitionService.leave(this.element, this.transition, this.name);
            }
        }
    }
}
