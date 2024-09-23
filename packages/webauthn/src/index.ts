import { IContainer, IRegistry } from 'aurelia';
import {IHttpService, HttpService} from './services/http-service';
import {IHttpResponse} from './interfaces/http';
import { IWebauthnConfig, IWebauthnConfiguration } from './configure';
import { IWebauthnService, WebauthnService } from './services/webauthn-service';
import { WebauthnLogin, WebauthnRegister } from './components';

export {
    IWebauthnConfig,
    IWebauthnConfiguration,
    IHttpService, HttpService, IHttpResponse,
    IWebauthnService, WebauthnService,
    WebauthnLogin,
    WebauthnRegister,
};

const DefaultComponents: IRegistry[] = [
    WebauthnLogin as unknown as IRegistry,
    WebauthnRegister as unknown as IRegistry,
];

function createWebauthnConfiguration(options: Partial<IWebauthnConfig>) {
    return {
        register(container: IContainer) {
            const configClass = container.get(IWebauthnConfiguration);

            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents)
        },
        configure(options: IWebauthnConfig) {
            return createWebauthnConfiguration(options);
        }
    };
}

export const WebauthnConfiguration = createWebauthnConfiguration({});