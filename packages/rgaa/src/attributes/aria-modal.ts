import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable, resolve} from "aurelia";
import {HtmlActions} from "../enums/html-enums";
import {ModalChannels, ModalModes, ModalRoles} from "../enums/aria-modal-enums";
import {IAriaModal, IAriaModalEnded} from "../interfaces/aria-modal-interfaces";

@customAttribute('bc-aria-modal')
export class AriaModal
{
    public static attribute = 'aria-modal';
    public static roleAttribute = 'role';
    public static tabindexAttribute = 'tabindex';
    @bindable( {primary: true} ) name: string;
    @bindable() enabled: boolean = true;
    @bindable() tabindexEnabled: boolean = false;
    @bindable() mode: ModalModes = ModalModes.false;
    @bindable() role: ModalRoles = ModalRoles.dialog;
    private defaultTabindex: string = '';
    private disposable:IDisposable;


    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('AriaModal'),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private readonly platform:IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement
    ) {
        this.logger.trace('constructor')
    }

    public attached()
    {
        this.logger.trace('attached');
        this.disposable = this.ea.subscribe(ModalChannels.main, this.onAriaModal);

        const currentRole = this.element.getAttribute(AriaModal.roleAttribute)  as ModalRoles;
        if (currentRole !== null && Object.values(ModalRoles).includes(currentRole)) {
            this.role = currentRole;
        }
        if (this.tabindexEnabled) {
            const currentTabindex = this.element.getAttribute(AriaModal.tabindexAttribute);
            if (currentTabindex !== null) {
                this.defaultTabindex = currentTabindex;
            }
        }
        if (this.enabled) {
            this.defineModal();
        }
    }

    public dispose()
    {
        this.logger.trace('dispose');
        this.disposable.dispose();
    }

    public onAriaModal = (data:IAriaModal) => {
        if (data.name == this.name) {
            this.logger.trace('onAriaModal');
            this.mode = data.mode;
            if(data.role) {
                this.role = data.role;
            }
            const message: IAriaModalEnded = {
                name: this.name,
                mode: this.mode,
                action: data.action,
                role: this.role
            };
            if (data.action === HtmlActions.define) {
                message.action = this.defineModal();
            } else if (data.action === HtmlActions.remove) {
                message.action = this.removeModal();
            } else {
                throw new Error('AriaModal: action not supported');
            }
            this.platform.taskQueue.queueTask(() => {
                this.ea.publish(ModalChannels.ended, message);
            });
        }
    }

    private removeModal() {
        this.element.removeAttribute(AriaModal.attribute);
        this.element.removeAttribute(AriaModal.roleAttribute);
        if (this.tabindexEnabled) {
            this.element.setAttribute(AriaModal.tabindexAttribute, '-1');
        }
        return HtmlActions.remove;
    }

    private defineModal() {
        if (this.mode === ModalModes.true) {
            this.element.setAttribute(AriaModal.attribute, this.mode);
            this.element.setAttribute(AriaModal.roleAttribute, this.role);
            if (this.tabindexEnabled) {
                if (this.defaultTabindex && this.defaultTabindex !== '') {
                    this.element.setAttribute(AriaModal.tabindexAttribute, this.defaultTabindex);
                } else {
                    this.element.removeAttribute(AriaModal.tabindexAttribute);
                }
            }
            return HtmlActions.define;
        } else if (this.mode === ModalModes.false) {
            return this.removeModal()
        }
        throw new Error('AriaModal: mode not supported');
    }
}
