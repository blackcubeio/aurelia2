import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable} from "aurelia";
import {HtmlActions} from "../enums/html-enums";
import {IAriaSelected, IAriaSelectedEnded} from "../interfaces/aria-selected-interfaces";
import {SelectedChannels, SelectedModes} from "../enums/aria-selected-enums";

@customAttribute("bc-aria-selected")
export class AriaSelected
{
    public static attribute = 'aria-selected';
    @bindable( {primary: true} ) name: string;
    @bindable() enabled: boolean = true;
    @bindable() mode: SelectedModes = SelectedModes.false;
    private disposable:IDisposable;


    public constructor(
        @ILogger private readonly logger: ILogger,
        @IEventAggregator private readonly ea: IEventAggregator,
        @IPlatform private readonly platform:IPlatform,
        @INode private readonly element: HTMLElement) {
        this.logger = logger.scopeTo('AriaSelected');
        this.logger.trace('constructor')
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(SelectedChannels.main, this.onAriaSelected);
        if (this.enabled) {
            this.defineSelected();
        }
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }

    public onAriaSelected = (data:IAriaSelected) => {
        if (data.name == this.name) {
            this.logger.trace('onAriaSelected');
            this.mode = data.mode;
            const message: IAriaSelectedEnded = {
                name: this.name,
                mode: this.mode,
                action: data.action
            };
            if (data.action === HtmlActions.define) {
                message.action = this.defineSelected();
            } else if (data.action === HtmlActions.remove) {
                message.action = this.removeSelected();
            } else {
                throw new Error('AriaSelected: action not supported');
            }
            this.platform.taskQueue.queueTask(() => {
                this.ea.publish(SelectedChannels.ended, message);
            });
        }
    }
    private removeSelected() {
        this.element.removeAttribute(AriaSelected.attribute);
        return HtmlActions.remove;
    }

    private defineSelected() {
        if (this.mode === SelectedModes.false) {
            return this.removeSelected();
        }
        this.element.setAttribute(AriaSelected.attribute, this.mode);
        return HtmlActions.define;
    }
}
