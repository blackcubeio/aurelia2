import { IPlatform, ILogger } from 'aurelia';
import { IRecaptchaConfiguration } from '../configure';
export declare class Recaptcha {
    private readonly logger;
    private readonly platform;
    private readonly element;
    private readonly options;
    private apiKey;
    private apiUrl;
    private verifyUrl;
    private form;
    private formId;
    private widgetId;
    private renderElement;
    private recaptchaIsValid;
    private errorClass;
    badge: string;
    size: string;
    theme: string;
    event: string;
    constructor(logger: ILogger, platform: IPlatform, element: HTMLElement, options: IRecaptchaConfiguration);
    binding(): void;
    attaching(): Promise<unknown>;
    attached(): void;
    private recaptchaCallback;
    detaching(): void;
    onEvent: (event: Event) => void;
    private recaptchaReady;
    private isScriptInstalled;
    private installScript;
    private generateid;
}
//# sourceMappingURL=recaptcha.d.ts.map