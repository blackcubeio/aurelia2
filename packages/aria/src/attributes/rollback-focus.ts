import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable} from "aurelia";
import {RollbackFocusChannels} from '../enums/html-rollback-focus-enums';
import {IHtmlRollbackFocus, IHtmlRollbackFocusEnded} from '../interfaces/html-rollback-focus-interfaces';

@customAttribute("bc-rollback-focus")
export class RollbackFocus
{
    @bindable({primary: true}) public event: string = 'click';
    private subscriptionListenRollbackFocus: IDisposable|null = null;
    private subscriptionChangeRollbackFocus: IDisposable|null = null;
    public constructor(
        @INode private readonly element: INode,
        @ILogger private readonly logger: ILogger,
        @IEventAggregator private readonly ea: IEventAggregator,
    ) {
        this.logger = logger.scopeTo('RollbackFocus');
        this.logger.trace('constructor');
    }

    public attaching()
    {
        this.logger.trace('attaching');
        if (this.event === '') {
            this.event = 'click';
        }
    }

    public attached()
    {
        this.logger.trace('attached');
        this.element.addEventListener(this.event, this.onEvent);
        this.subscriptionChangeRollbackFocus = this.ea.subscribe(RollbackFocusChannels.change, this.onRollbackFocusChangeCurrent);
    }

    public detached()
    {
        this.logger.trace('detached');
        this.element.removeEventListener(this.event, this.onEvent);
        this.subscriptionChangeRollbackFocus?.dispose();
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.subscriptionListenRollbackFocus?.dispose();
        this.subscriptionListenRollbackFocus = null;
        this.subscriptionChangeRollbackFocus?.dispose();
        this.subscriptionChangeRollbackFocus = null;
    }

    private onEvent = (event: Event) => {
        this.logger.trace('onClick', event);
        const message: IHtmlRollbackFocus = {
            element: this.element as HTMLElement,
        }
        this.ea.publish(RollbackFocusChannels.change, message);
        this.subscriptionListenRollbackFocus = this.ea.subscribe(RollbackFocusChannels.main, this.onRollbackFocus);
    }

    private onRollbackFocus = (data: any) => {
        this.logger.trace('onRollbackFocus', data);
        // @ts-ignore
        this.element.focus();
        this.subscriptionListenRollbackFocus?.dispose();
        this.subscriptionListenRollbackFocus = null;
        const message: IHtmlRollbackFocusEnded = {
            element: this.element as HTMLElement,
        }
        this.ea.publish(RollbackFocusChannels.ended, message);
    }
    private onRollbackFocusChangeCurrent = (data: IHtmlRollbackFocus) => {
        this.logger.trace('onRollbackFocusChangeCurrent', data);
        // if this element is not the current element, we dispose the subscription
        if (data.element && data.element !== this.element) {
            this.logger.trace('onRollbackFocusCurrent Dispose', data);
            this.subscriptionListenRollbackFocus?.dispose();
            this.subscriptionListenRollbackFocus = null;
        }
    }

}