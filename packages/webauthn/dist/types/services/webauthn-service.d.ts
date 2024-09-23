import { ILogger, IPlatform } from 'aurelia';
import { IHttpService } from './http-service';
import { IWebauthnConfiguration } from '../configure';
export declare const IWebauthnService: import("@aurelia/kernel").InterfaceSymbol<IWebauthnService>;
export interface IWebauthnService extends WebauthnService {
}
export declare class WebauthnService {
    private readonly logger;
    private readonly platform;
    private readonly options;
    private readonly httpService;
    constructor(logger?: ILogger, platform?: IPlatform, options?: IWebauthnConfiguration, httpService?: IHttpService);
    isAvailable(): Promise<boolean>;
    registerDevice(email: string, name?: string | null): Promise<boolean>;
    attachDevice(): Promise<any>;
    login(email: string): Promise<boolean>;
    loginDevice(): Promise<boolean>;
    private convertStringToBuffer;
    private base64UrlDecode;
    private base64UrlEncode;
}
//# sourceMappingURL=webauthn-service.d.ts.map