import {IEventAggregator, INode, IPlatform, ILogger, bindable, customAttribute, IDisposable} from "aurelia";
import { ValidationResult } from "@aurelia/validation";
import {InvalidChannels, InvalidModes} from "../enums/aria-invalid-enums";
import {HtmlActions} from "../enums/html-enums";
import {IAriaInvalid, IAriaInvalidEnded} from "../interfaces/aria-invalid-interfaces";

@customAttribute("bc-aria-invalid")
export class AriaInvalid
{
    public static attribute = 'aria-invalid';
    public static describedByAttribute = 'aria-describedby';
    public static labelledByAttribute = 'aria-labelledby';
    @bindable( {primary: true} ) name: string;
    @bindable() enabled: boolean = true;
    @bindable() mode: InvalidModes = InvalidModes.false;
    @bindable() describedByEnabled: boolean = true;
    @bindable() describedById: string;
    @bindable() labelledByEnabled: boolean = false;
    @bindable() labelledById: string;
    private form: HTMLFormElement;
    private disposable:IDisposable;

    public constructor(
        @ILogger private readonly logger: ILogger,
        @IEventAggregator private readonly ea: IEventAggregator,
        @IPlatform private readonly platform:IPlatform,
        @INode private readonly element: HTMLElement) {
        this.logger = logger.scopeTo('AriaInvalid');
        this.logger.trace('constructor')
    }
    public static convertErrors(resuts:ValidationResult[], form: HTMLFormElement|null = null) :IAriaInvalid[]
    {
        const errors :IAriaInvalid[] = [];
        resuts.forEach((result) => {
            let propertyName:string = undefined;
            if (typeof(result.propertyName) === 'string') {
                propertyName = result.propertyName;
            } else if (typeof(result.propertyName) === 'number') {
                propertyName = (<number>result.propertyName).toString();
            }
            if (propertyName) {
                const error :IAriaInvalid = {
                    name:propertyName,
                    mode:result.valid ? InvalidModes.false : InvalidModes.true,
                    action:HtmlActions.define
                }
                if (form !== null && form instanceof HTMLFormElement) {
                    error.form = form;
                }
                errors.push(error);
            }
        });
        return errors;
    }


    public attached()
    {
        this.logger.trace('attached');
        this.form = this.element.closest('form');
        this.disposable = this.ea.subscribe(InvalidChannels.main, this.onAriaInvalid);
        const describedById = this.element.getAttribute(AriaInvalid.describedByAttribute);
        if (describedById !== null && describedById !== '') {
            this.describedById = describedById;
        } else {
            this.describedById = this.name;
        }
        const labelledById = this.element.getAttribute(AriaInvalid.labelledByAttribute);
        if (labelledById !== null && labelledById !== '') {
            this.labelledById = labelledById;
        } else {
            this.labelledById = this.name+'Label';
        }
        if (this.enabled) {
            this.defineInvalid();
        }
    }

    public dispose()
    {
        this.logger.trace('dispose');
        if (this.disposable) {
            this.disposable.dispose();
        }
    }

    public onAriaInvalid = (data:IAriaInvalid | IAriaInvalid[]) => {
        let reducedData: IAriaInvalid;
        let form: HTMLFormElement|null = null;
        if (Array.isArray(data)) {
            form = data.reduce((previousValue: HTMLFormElement|null, currentValue, currentIndex) => {
                if (previousValue === null && currentValue.form instanceof HTMLFormElement) {
                    return currentValue.form;
                } else {
                    return previousValue;
                }
            }, null);
            reducedData = data.reduce((previousValue, currentValue, currentIndex) => {
                if (currentValue.name === this.name) {
                    if (previousValue === undefined) {
                        return currentValue;
                    } else {
                        if (previousValue.action !== currentValue.action) {
                            throw new Error('AriaInvalid: multiple actions defined for the same name');
                        }
                        let finalValue = currentValue;
                        if (previousValue.mode === InvalidModes.true || currentValue.mode === InvalidModes.true) {
                            finalValue.mode = InvalidModes.true;
                        }
                        return finalValue;
                    }
                } else {
                    return previousValue
                }
            }, undefined);
        } else {
            if (data.form instanceof HTMLFormElement) {
                form = data.form;
            }
            reducedData = data;
        }

        // if we are in form and the form is identical to the one that triggered the event
        if (reducedData !== undefined && reducedData.name == this.name && (form !== null && form === this.form)) {
            this.logger.trace('onAriaInvalid');
            this.mode = reducedData.mode;
            const message: IAriaInvalidEnded = {
                name: this.name,
                mode: reducedData.mode,
                action: reducedData.action
            }
            if (reducedData.action === HtmlActions.define) {
                message.action = this.defineInvalid();
            } else if (reducedData.action === HtmlActions.remove) {
                message.action = this.removeInvalid();
            } else {
                throw new Error('AriaInvalid: action not supported');
            }
            this.platform.taskQueue.queueTask(() => {
                this.ea.publish(InvalidChannels.ended, message);
            });
        }
    }

    private removeInvalid()
    {
        this.element.removeAttribute(AriaInvalid.attribute);
        this.element.removeAttribute(AriaInvalid.describedByAttribute);
        this.element.removeAttribute(AriaInvalid.labelledByAttribute);
        return HtmlActions.remove;
    }

    private defineInvalid()
    {
        if (this.mode === InvalidModes.true) {
            this.element.setAttribute(AriaInvalid.attribute, this.mode);
            if (this.describedByEnabled) {
                this.element.setAttribute(AriaInvalid.describedByAttribute, this.describedById);
            } else {
                this.element.removeAttribute(AriaInvalid.describedByAttribute);
            }
            if (this.labelledByEnabled) {
                this.element.setAttribute(AriaInvalid.labelledByAttribute, this.labelledById);
            } else {
                this.element.removeAttribute(AriaInvalid.labelledByAttribute);
            }
            return HtmlActions.define;
        } else if (this.mode === InvalidModes.false) {
            return this.removeInvalid();
        }
        throw new Error('AriaInvalid: mode not supported');
    }
}
