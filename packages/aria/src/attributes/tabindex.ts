import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable, resolve} from "aurelia";
import {TabindexChannels} from "../enums/html-tabindex-enums";
import {IHtmlTabindex, IHtmlTabindexEnded} from "../interfaces/html-tabindex-interfaces";
import {HtmlActions} from "../enums/html-enums";
@customAttribute("bc-tabindex")
export class Tabindex
{
    public static attribute = 'tabindex';
    public static disabledAttribute = 'aria-disabled';
    @bindable( {primary: true} ) name: string;
    @bindable() enabled: boolean = true;
    @bindable() enabledDisabled: boolean = false;
    @bindable() value: string = '';
    private disposable:IDisposable;
    private previousValue:string = '';

    public constructor(
        private readonly logger: ILogger = resolve(ILogger),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly platform:IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
    ) {
        this.logger = logger.scopeTo('AriaTabindexDisabled');
        this.logger.trace('constructor')
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(TabindexChannels.main, this.onTabindex);
        if (this.element.hasAttribute(Tabindex.attribute)) {
            this.value = this.element.getAttribute(Tabindex.attribute);
        }
        if (this.enabled) {
            this.defineTabindex();
        }
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }

    public onTabindex = (data:IHtmlTabindex) => {
        if (data.name === this.name) {
            const message: IHtmlTabindexEnded = {
                name: this.name,
                action: data.action,
                value: data.value,
            }
            if (data.action === HtmlActions.define) {
                this.rotateTabindex(data.value);
            } else if (data.action === HtmlActions.remove) {
                this.rotateTabindex('');
            }
            message.value = this.value;
            if (this.value !== '' && HtmlActions.define === data.action) {
                message.action = this.defineTabindex();
            } else if (this.value === '' || HtmlActions.remove === data.action){
                message.action = this.removeTabindex();
            }
            this.platform.taskQueue.queueTask(() => {
                this.ea.publish(TabindexChannels.ended, message);
            });
        }
    }
    private rotateTabindex(value:string)
    {
        if (value === 'revert' || value === '') {
            [this.previousValue, this.value] = [this.value, this.previousValue];
        } else if (value !== '') {
            [this.previousValue, this.value] = [this.value, value];
        }
    }
    private removeTabindex()
    {
        this.element.removeAttribute(Tabindex.attribute);
        if (this.enabledDisabled) {
            this.element.removeAttribute(Tabindex.disabledAttribute);
        }
        return HtmlActions.remove;
    }

    private defineTabindex()
    {
        if (this.value === '') {
            return this.removeTabindex();
        } else if (this.value === '-1') {
            this.element.setAttribute(Tabindex.attribute, this.value);
            if (this.enabledDisabled) {
                this.element.setAttribute(Tabindex.disabledAttribute, 'true');
            }
        } else {
            this.element.setAttribute(Tabindex.attribute, this.value);
            if (this.enabledDisabled) {
                this.element.removeAttribute(Tabindex.disabledAttribute);
            }
        }
        return HtmlActions.define;
    }
}
