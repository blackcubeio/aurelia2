import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable, resolve} from "aurelia";
import {HiddenChannels, HiddenModes} from "../enums/aria-hidden-enums";
import {IAriaHidden, IAriaHiddenEnded} from "../interfaces/aria-hidden-interfaces";
import {HtmlActions} from "../enums/html-enums";

@customAttribute('bc-aria-hidden')
export class AriaHidden
{
    public static attribute = 'aria-hidden';
    @bindable( {primary: true} ) name: string;
    @bindable() enabled: boolean = true;
    @bindable() mode: HiddenModes = HiddenModes.true;
    private disposable:IDisposable;

    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('AriaHidden'),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly platform:IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement
    ) {
        this.logger.trace('constructor')
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(HiddenChannels.main, this.onAriaHidden);
        if (this.enabled) {
            this.defineHidden();
        }
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }

    public onAriaHidden = (data:IAriaHidden) => {
        if (data.name == this.name) {
            this.logger.trace('onAriaHidden');
            this.mode = data.mode;
            const message: IAriaHiddenEnded = {
                name: this.name,
                mode: this.mode,
                action: data.action
            }
            if (data.action === HtmlActions.define) {
                message.action = this.defineHidden();
            } else if (data.action === HtmlActions.remove) {
                message.action = this.removeHidden();
            } else {
                throw new Error('AriaHidden: action not supported');
            }
            this.platform.taskQueue.queueTask(() => {
                this.ea.publish(HiddenChannels.ended, message);
            });
        }
    }

    private removeHidden() {
        this.element.removeAttribute(AriaHidden.attribute);
        return HtmlActions.remove;
    }

    private defineHidden() {
        if (this.mode === HiddenModes.true) {
            this.element.setAttribute(AriaHidden.attribute, this.mode);
            return HtmlActions.define;
        } else if (this.mode === HiddenModes.false) {
            return this.removeHidden();
        }
        throw new Error('AriaHidden: mode not supported');

    }
}
