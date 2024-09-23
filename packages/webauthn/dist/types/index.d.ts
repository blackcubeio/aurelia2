import { IContainer } from 'aurelia';
import { IHttpService, HttpService } from './services/http-service';
import { IHttpResponse } from './interfaces/http';
import { IWebauthnConfig, IWebauthnConfiguration } from './configure';
import { IWebauthnService, WebauthnService } from './services/webauthn-service';
import { WebauthnLogin, WebauthnRegister } from './components';
export { IWebauthnConfig, IWebauthnConfiguration, IHttpService, HttpService, IHttpResponse, IWebauthnService, WebauthnService, WebauthnLogin, WebauthnRegister, };
export declare const WebauthnConfiguration: {
    register(container: IContainer): IContainer;
    configure(options: IWebauthnConfig): any;
};
//# sourceMappingURL=index.d.ts.map