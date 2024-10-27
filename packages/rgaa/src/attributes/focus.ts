import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable, resolve} from "aurelia";
import {FocusChannels} from "../enums/html-focus-enums";
import {IHtmlFocus, IHtmlFocusEnded} from "../interfaces/html-focus-interfaces";
import {HtmlActions} from "../enums/html-enums";
import {IRgaaConfiguration} from "../configure";

@customAttribute('bc-focus')
export class Focus
{
    public static attribute = 'focus';
    @bindable( {primary: true} ) name: string;
    @bindable() enabled: boolean = false;
    private disposable:IDisposable;
    private focusDelay:number;

    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('Focus'),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly platform:IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
        private readonly options: IRgaaConfiguration = resolve(IRgaaConfiguration),
    ) {
        this.logger.trace('constructor');
        this.focusDelay = this.options.get('focusDelay');
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(FocusChannels.main, this.onFocus);
        if (this.enabled) {
            this.platform.taskQueue.queueTask(() => {
                this.platform.requestAnimationFrame(() => {
                    this.element.focus();
                });
            }, {delay:this.focusDelay});
        }
    }

    public detached()
    {
        this.logger.trace('detached');
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }

    public onFocus = (data:IHtmlFocus) => {
        if (data.name === this.name) {
                const message: IHtmlFocusEnded = {
                    name: this.name,
                    action: data.action
                };
                if (data.action === HtmlActions.define) {
                        message.action = this.defineFocus();
                } else if (data.action === HtmlActions.remove) {
                        message.action = this.removeFocus();
                }
                this.ea.publish(FocusChannels.ended, message);

        }
    }

    private removeFocus() {
        this.platform.taskQueue.queueTask(() => {
            this.platform.requestAnimationFrame(() => {
                this.element.blur();
            });
        }, {delay: this.focusDelay});

        return HtmlActions.remove;
    }

    private defineFocus() {
        this.platform.taskQueue.queueTask(() => {
            this.platform.requestAnimationFrame(() => {
                this.element.focus();
            });
        }, {delay: this.focusDelay});
        return HtmlActions.define;
    }
}