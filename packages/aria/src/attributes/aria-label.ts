import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable} from "aurelia";
import {LabelChannels} from "../enums/aria-label-enums";
import {IAriaLabel, IAriaLabelEnded} from "../interfaces/aria-label-interfaces";
import {HtmlActions} from "../enums/html-enums";

@customAttribute("bc-aria-label")
export class AriaLabel
{
    public static attribute = 'aria-label';
    @bindable( {primary: true} ) name: string;
    @bindable() enabled: boolean = true;
    @bindable() label: string = '';
    private disposable:IDisposable;

    public constructor(
        @ILogger private readonly logger: ILogger,
        @IEventAggregator private readonly ea: IEventAggregator,
        @IPlatform private readonly platform:IPlatform,
        @INode private readonly element: HTMLElement) {
        this.logger = logger.scopeTo('AriaLabel');
        this.logger.trace('constructor')
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(LabelChannels.main, this.onAriaLabel);
        if (this.enabled) {
            this.defineLabel();
        }
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }

    public onAriaLabel = (data:IAriaLabel) => {
        if (data.name === this.name) {
            const message: IAriaLabelEnded = {
                name: this.name,
                action: data.action
            }
            if (data.label && data.label !== '') {
                message.label = data.label;
                this.label = data.label;
            } else {
                this.label = '';
            }
            if (data.action === HtmlActions.define) {
                message.action = this.defineLabel();
            } else if (data.action === HtmlActions.remove) {
                message.action = this.removeLabel();
            } else {
                throw new Error('AriaLabel: action not supported');
            }
            this.platform.taskQueue.queueTask(() => {
                this.ea.publish(LabelChannels.ended, message);
            });
        }
    }

    private removeLabel()
    {
        this.element.removeAttribute(AriaLabel.attribute);
        return HtmlActions.remove;
    }
    private defineLabel()
    {
        if (this.label !== '') {
            this.element.setAttribute(AriaLabel.attribute, this.label);
            return HtmlActions.define;
        } else {
            return this.removeLabel();
        }
    }
}
