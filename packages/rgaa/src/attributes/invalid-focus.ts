import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable, resolve} from "aurelia";

import {HtmlActions} from "../enums/html-enums";
import {IRgaaConfiguration} from "../configure";
import {InvalidFocusChannels} from "../enums/html-invalid-focus-enums";
import {IHtmlInvalidFocus, IHtmlInvalidFocusEnded} from "../interfaces/html-invalid-focus-interfaces";


@customAttribute('bc-invalid-focus')
export class InvalidFocus
{
    public static attribute = 'invalid-focus';
    @bindable( {primary: true} ) name: string;
    private disposable:IDisposable;
    private invalidElementsQuerySelector: string = '';
    private focusDelay:number;

    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('InvalidFocus'),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly platform:IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
        private readonly options: IRgaaConfiguration = resolve(IRgaaConfiguration),
        )
    {
        this.logger.trace('constructor');
        this.invalidElementsQuerySelector = this.options.get('invalidElementsQuerySelector');
        this.focusDelay = this.options.get('focusDelay');
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(InvalidFocusChannels.main, this.onInvalidFocus);
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

    public onInvalidFocus = (data:IHtmlInvalidFocus) => {
        if (data.name === this.name) {
            const message: IHtmlInvalidFocusEnded = {
                name: this.name,
                action: data.action,
            }
            this.platform.taskQueue.queueTask(() => {
                if (data.action === HtmlActions.define) {
                    message.action = this.defineInvalidFocus();
                } else if (data.action === HtmlActions.remove) {
                    message.action = this.removeInvalidFocus();
                } else {
                    throw new Error('InvalidFocus: action not supported');
                }
                this.ea.publish(InvalidFocusChannels.ended, message);
            }, {delay:100});
        }
    }

    private removeInvalidFocus()
    {
        const targetElement = this.element.querySelector(':focus') as HTMLElement;

        if (targetElement !== null) {
            this.platform.taskQueue.queueTask(() => {
                this.platform.requestAnimationFrame(() => {
                    targetElement.blur();
                });
            }, {delay: this.focusDelay});
        }
        return HtmlActions.remove;
    }
    private defineInvalidFocus()
    {
        const targetElement = this.element.querySelector(this.invalidElementsQuerySelector) as HTMLElement;
        if (targetElement !== null) {
            this.platform.taskQueue.queueTask(() => {
                this.platform.requestAnimationFrame(() => {
                    targetElement.focus();
                });
            }, {delay: this.focusDelay});
        }
        return HtmlActions.define;
    }

}