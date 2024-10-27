import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable, resolve} from "aurelia";
import {LiveChannels, LiveModes} from "../enums/aria-live-enums";
import {IAriaLive, IAriaLiveEnded} from "../interfaces/aria-live-interfaces";
import {HtmlActions} from "../enums/html-enums";

@customAttribute('bc-aria-live')
export class AriaLive
{
    public static attribute = 'aria-live';
    @bindable( {primary: true} ) name: string;
    @bindable() mode: LiveModes = LiveModes.polite;
    @bindable() enabled: boolean = true;
    private disposable:IDisposable;

    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('AriaLive'),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly platform:IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement
    ) {
        this.logger.trace('constructor')
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(LiveChannels.main, this.onAriaLive);
        if (this.enabled) {
            if (this.mode !== LiveModes.off) {
                this.element.setAttribute(AriaLive.attribute, this.mode);
            } else {
                this.element.removeAttribute(AriaLive.attribute);
            }
        }
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }

    public onAriaLive = (data:IAriaLive) => {
        if (data.name === this.name) {
            this.mode = data.mode;
            const message: IAriaLiveEnded = {
                name: this.name,
                mode: this.mode,
                action: data.action
            }
            if (data.action === HtmlActions.define) {
                message.action = this.defineLive();
            } else if (data.action === HtmlActions.remove) {
                message.action = this.removeLive();
            } else {
                throw new Error('AriaLive: action not supported');
            }
            this.platform.taskQueue.queueTask(() => {
                this.ea.publish(LiveChannels.ended, message);
            });
        }
    }

    private removeLive() {
        this.element.removeAttribute(AriaLive.attribute);
        return HtmlActions.remove;
    }

    private defineLive() {
        if (this.mode !== LiveModes.off) {
            this.element.setAttribute(AriaLive.attribute, this.mode);
            return HtmlActions.define;
        } else {
            return this.removeLive();
        }
    }
}
