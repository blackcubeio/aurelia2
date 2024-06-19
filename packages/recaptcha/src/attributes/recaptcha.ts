import {IPlatform, bindable, BindingMode, customAttribute, ILogger, INode, resolve} from 'aurelia';
import {IRecaptchaConfiguration} from '../configure';

declare var grecaptcha:any;

@customAttribute("bc-recaptcha")
export class Recaptcha {
    private apiKey:string;
    private apiUrl:string;
    private verifyUrl:string;
    private form: HTMLFormElement|null = null;
    private formId:string;
    private widgetId: null;
    private renderElement: HTMLElement;
    private recaptchaIsValid: boolean = false;
    private errorClass = 'grecaptcha-error';
    @bindable({mode:BindingMode.oneTime}) public badge: string = 'none';
    @bindable({mode:BindingMode.oneTime}) public size: string = 'invisible';
    @bindable({mode:BindingMode.oneTime}) public theme: string = 'light';
    @bindable({primary:true, mode:BindingMode.oneTime}) public event: string = 'submit';
    public constructor(
        private readonly logger: ILogger = resolve(ILogger),
        private readonly platform:IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
        private readonly options: IRecaptchaConfiguration = resolve(IRecaptchaConfiguration),
    ) {
        this.logger = logger.scopeTo('Recaptcha');
        this.logger.trace('constructor');
        try {
            this.apiKey = this.options.get('apiKey');
        } catch (e) {
            this.logger.error('API key is mandatory');
        }
        this.apiUrl = this.options.get('apiUrl');
        this.verifyUrl = this.options.get('verifyUrl');
        this.badge = this.options.get('badge');
        this.size = this.options.get('size');
        this.theme = this.options.get('theme');
    }
    public binding() {
        this.logger.trace('binding');
        if (this.event === '') {
            this.event = 'submit';
        }
    }
    public attaching() {
        this.logger.trace('attaching');
        this.form = this.element.closest('form') as HTMLFormElement;
        if (this.form === null) {
            this.logger.error('No form found');
        }
        if (this.event === 'submit') {
            this.form?.addEventListener(this.event, this.onEvent);
        } else if (this.event === 'click') {
            this.element.addEventListener(this.event, this.onEvent);
        }

        return this.recaptchaReady();
    }
    public attached() {
        this.formId = this.generateid();

        this.renderElement = this.platform.document.createElement('div');
        // @ts-ignore
        this.renderElement.id = this.formId;
        this.form?.appendChild(this.renderElement);
        this.widgetId = grecaptcha.render(this.renderElement, {
            sitekey: this.apiKey,
            theme: this.theme,
            badge: this.badge, // 'bottomright
            size: this.size, // 'normal',
            callback: this.recaptchaCallback,
        });
    }
    private recaptchaCallback = (token: string) => {
        this.logger.debug('recaptchaCallback', token);
        if (token !== null) {
            // do fetch
            // reset on success
            if (!!this.verifyUrl) {
                fetch(this.verifyUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token,
                    })
                }).then((response) => {
                    if (response.ok && response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error('Verify URL ' + this.verifyUrl + ' is not valid');
                    }
                })
                    .then((data) => {
                        if (data.success) {
                            if (this.form) {
                                this.form?.classList.remove(this.errorClass);
                            } else {
                                this.element.classList.remove(this.errorClass);
                            }
                            this.recaptchaIsValid = true;
                            if (this.event === 'submit' && this.size === 'invisible') {
                                this.form?.submit();
                                grecaptcha.reset(this.widgetId);
                            } else if (this.event === 'click') {
                                this.element.click();
                                grecaptcha.reset(this.widgetId);
                            }
                        } else {
                            throw new Error('Recaptcha is not valid');
                        }
                    })
                    .catch((error) => {
                        this.logger.error(error);
                        if (this.form) {
                            this.form?.classList.add(this.errorClass);
                        } else {
                            this.element.classList.add(this.errorClass);
                        }
                        this.recaptchaIsValid = false;
                    });
            } else {
                if (this.form) {
                    this.form?.classList.remove(this.errorClass);
                } else {
                    this.element.classList.remove(this.errorClass);
                }
                this.recaptchaIsValid = true;
                if (this.event === 'submit' && this.size === 'invisible') {
                    this.form?.submit();
                    grecaptcha.reset(this.widgetId);
                } else if (this.event === 'click') {
                    this.element.click();
                    grecaptcha.reset(this.widgetId);
                }
            }
        } else {
            if (this.form) {
                this.form?.classList.remove(this.errorClass);
            } else {
                this.element.classList.remove(this.errorClass);
            }
            this.recaptchaIsValid = false;
        }


    }
    public detaching() {
        if (this.event === 'submit') {
            this.form?.removeEventListener(this.event, this.onEvent);
        } else if (this.event === 'click') {
            this.element.removeEventListener(this.event, this.onEvent);
        }
    }
    public onEvent = (event:Event) => {
        this.logger.trace('onEvent');
        if(this.recaptchaIsValid === false) {
            this.logger.debug('recaptchaIsValid', this.recaptchaIsValid);
            event.preventDefault();
            if (this.size === 'invisible') {
                grecaptcha.execute(this.widgetId);
            }
        } else {
            this.logger.debug('recaptchaIsValid', this.recaptchaIsValid);
            this.recaptchaIsValid = false;
        }

    };
    private recaptchaReady() {
        const promise = new Promise((resolve) => {
            this.installScript()
                .then(() => {
                    this.logger.debug('script installed');
                    const interval = this.platform.setInterval(() => {
                        if (typeof grecaptcha !== 'undefined') {
                            this.platform.clearInterval(interval);
                            grecaptcha.ready(() => {
                                resolve(true);
                            });

                        }
                    }, 100);
                });
        });
        return promise;
    }
    private isScriptInstalled() {
        const el = this.platform.document.head.querySelector(`script[src="${this.apiUrl}"]`);
        return el !== null;
    }
    private installScript() {
        const promise = new Promise((resolve) => {
            if (this.isScriptInstalled() === false) {
                const script = this.platform.document.createElement('script');
                script.src = this.apiUrl;
                script.async = true;
                script.defer = true;
                this.platform.document.head.appendChild(script);
                script.addEventListener('load', () => {
                    this.logger.debug('script loaded');
                    resolve(true);
                });
                // script.setAttribute('data-sitekey', this.siteKey);
            } else {
                resolve(true);
            }
        });
        return promise;
    }
    private generateid(length: number = 5) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
}