import {
    ILogger,
    INode,
    resolve, customAttribute, ICustomAttributeViewModel, IDisposable, IEventAggregator, bindable
} from 'aurelia';
import {AriaService, IAriaService} from '../services/aria-service';
import {IAriaSet, IAriaRevert} from '../interfaces/aria';

@customAttribute('bc-aria')
export class Aria implements ICustomAttributeViewModel
{
    @bindable({primary:true}) name: string;

    private disposableSet: IDisposable;
    private disposableUnset: IDisposable;
    constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('Aria'),
        private readonly ariaService: IAriaService = resolve(IAriaService),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
    ) {
        this.logger.debug('constructor');
    }

    public attaching() {
        this.logger.trace('Attaching');
        if (this.name.length > 0) {
            this.disposableSet = this.ea.subscribe(AriaService.ariaSetAttributeChannel, this.onSetAria);
            this.disposableUnset = this.ea.subscribe(AriaService.ariaRevertAttributeChannel, this.onRevertAria);
        }
    }
    public attached()
    {
        this.logger.trace('Attached');
    }

    public detaching()
    {
        this.logger.trace('Detaching');
        if (this.name.length > 0) {
            this.disposableSet.dispose();
            this.disposableUnset.dispose();
        }
    }

    private onSetAria = (evt: IAriaSet) =>
    {
        if (evt.name === this.name) {
            this.logger.debug('onSetAria', evt);
            this.ariaService.setByConfig(this.element, evt);
        }
    }

    private onRevertAria = (evt: IAriaRevert)=>
    {
        if (evt.name === this.name) {
            this.logger.debug('onRevertAria', evt);
            this.ariaService.revertByConfig(this.element, evt);
        }
    };

}