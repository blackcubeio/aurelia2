import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable} from "aurelia";
import {HtmlActions} from "../enums/html-enums";
import {IAriaCurrent, IAriaCurrentEnded} from "../interfaces/aria-current-interfaces";
import {CurrentChannels, CurrentModes} from "../enums/aria-current-enums";

@customAttribute("bc-aria-current")
export class AriaCurrent
{
    public static attribute = 'aria-current';
    @bindable( {primary: true} ) name: string;
    @bindable() enabled: boolean = true;
    @bindable() mode: CurrentModes = CurrentModes.false;
    private disposable:IDisposable;


    public constructor(
        @ILogger private readonly logger: ILogger,
        @IEventAggregator private readonly ea: IEventAggregator,
        @IPlatform private readonly platform:IPlatform,
        @INode private readonly element: HTMLElement) {
        this.logger = logger.scopeTo('AriaCurrent');
        this.logger.trace('constructor')
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(CurrentChannels.main, this.onAriaCurrent);
        if (this.enabled) {
            this.defineCurrent();
        }
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }

    public onAriaCurrent = (data:IAriaCurrent) => {
        if (data.name == this.name) {
            this.logger.trace('onAriaCurrent');
            this.mode = data.mode;
            const message: IAriaCurrentEnded = {
                name: this.name,
                mode: this.mode,
                action: data.action
            };
            if (data.action === HtmlActions.define) {
                message.action = this.defineCurrent();
            } else if (data.action === HtmlActions.remove) {
                message.action = this.removeCurrent();
            } else {
                throw new Error('AriaCurrent: action not supported');
            }
            this.platform.taskQueue.queueTask(() => {
                this.ea.publish(CurrentChannels.ended, message);
            });
        }
    }
    private removeCurrent() {
        this.element.removeAttribute(AriaCurrent.attribute);
        return HtmlActions.remove;
    }

    private defineCurrent() {
        if (this.mode === CurrentModes.false) {
            return this.removeCurrent();
        }
        this.element.setAttribute(AriaCurrent.attribute, this.mode);
        return HtmlActions.define;
    }
}
