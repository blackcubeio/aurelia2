import { ILogger, IPlatform } from 'aurelia';
import { IRouter } from '@aurelia/router';
import { IWebauthnService } from '../services/webauthn-service';
export declare class WebauthnLogin {
    private logger;
    private webauthnService;
    private readonly router;
    private readonly platform;
    private readonly element;
    route: string;
    url: string;
    user: boolean;
    error: boolean;
    email: string;
    constructor(logger?: ILogger, webauthnService?: IWebauthnService, router?: IRouter, platform?: IPlatform, element?: Element);
    attached(): void | Promise<void>;
    onSubmitLogin(evt: Event): void;
}
//# sourceMappingURL=webauthn-login.d.ts.map