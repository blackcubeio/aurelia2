import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable, resolve} from "aurelia";
import {ExpandedChannels, ExpandedModes} from "../enums/aria-expanded-enums";
import {IAriaExpanded, IAriaExpandedEnded} from "../interfaces/aria-expanded-interfaces";
import {HtmlActions} from "../enums/html-enums";

@customAttribute("bc-aria-expanded")
export class AriaExpanded
{
    public static attribute = 'aria-expanded';
    @bindable( {primary: true} ) name: string;
    @bindable() enabled: boolean = true;
    @bindable() mode: ExpandedModes = ExpandedModes.false;
    private disposable:IDisposable;

    public constructor(
        private readonly logger: ILogger = resolve(ILogger),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly platform:IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
        )
    {
        this.logger = logger.scopeTo('AriaExpanded');
        this.logger.trace('constructor')
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(ExpandedChannels.main, this.onAriaExpand);
        if (this.enabled) {
            this.defineExpanded();
        }
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }

    public onAriaExpand = (data:IAriaExpanded) => {
        if (data.name == this.name) {
            this.logger.trace('onAriaExpand');
            this.mode = data.mode;
            const message: IAriaExpandedEnded = {
                name: this.name,
                mode: this.mode,
                action: data.action
            }
            if (data.action === HtmlActions.define) {
                message.action = this.defineExpanded();
            } else if (data.action === HtmlActions.remove) {
                message.action = this.removeExpanded();
            } else {
                throw new Error('AriaExpanded: action not supported');
            }
            this.platform.taskQueue.queueTask(() => {
                this.ea.publish(ExpandedChannels.ended, message);
            });
        }
    }

    private removeExpanded() {
        this.element.removeAttribute(AriaExpanded.attribute);
        return HtmlActions.remove;
    }

    private defineExpanded() {
        this.element.setAttribute(AriaExpanded.attribute, this.mode);
        return HtmlActions.define;
    }
}
