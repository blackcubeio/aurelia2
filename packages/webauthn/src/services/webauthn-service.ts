import {DI, ILogger, IPlatform, newInstanceOf, resolve} from 'aurelia';
import {IHttpService} from './http-service';
import {IWebauthnConfiguration} from '../configure';


export const IWebauthnService =
    DI.createInterface<IWebauthnService>('IWebauthnService', (x) =>
        x.singleton(WebauthnService)
    );
export interface IWebauthnService extends WebauthnService {}
export class WebauthnService {
    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('WebauthnService'),
        private readonly platform: IPlatform = resolve(IPlatform),
        private readonly options: IWebauthnConfiguration = resolve(IWebauthnConfiguration),
        private readonly httpService: IHttpService = resolve(IHttpService),
    ) {
        this.logger.debug('Construct');
    }

    public isAvailable(): Promise<boolean> {
        if (this.platform.window.window.PublicKeyCredential) {
            return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
                .then((available) => {
                    if (available) {
                        this.logger.debug("WebAuthn supported, Platform Authenticator supported.");
                        return true;
                    } else {
                        this.logger.debug("WebAuthn supported, Platform Authenticator *not* supported.");
                        return false;
                    }
                })
                .catch((err) => {
                    this.logger.debug("WebAuthn Something went wrong.");
                    return Promise.reject(err);
                });
        } else {
            this.logger.debug("WebAuthn not supported.");
            return Promise.reject("WebAuthn not supported.");
        }
    }
    public registerDevice(email: string, name: string|null = null): Promise<boolean> {
        const data:any = {
            email
        };
        if (name && name.length > 0) {
            data.displayName = name;
        }
        return this.httpService.postJson(this.options.get('prepareRegisterDeviceUrl'), data)
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Failed to get credential');
                }
                const data: any = response.data;
                data.challenge = this.convertStringToBuffer(this.base64UrlDecode(data.challenge));
                if (data.user?.id) {
                    data.user.id = this.convertStringToBuffer(this.base64UrlDecode(data.user.id));
                }
                return this.platform.window.navigator.credentials
                    .create({publicKey: data});
            })
            .then((credential:PublicKeyCredential) => {
                this.logger.debug('Register response', credential);
                const data: any = {
                    id: credential.id,
                    rawId: this.base64UrlEncode(credential.rawId),
                    response: {
                        // @ts-ignore
                        attestationObject: this.base64UrlEncode(credential.response.attestationObject),
                        clientDataJSON: this.base64UrlEncode(credential.response.clientDataJSON)
                    },
                    type: credential.type
                };
                return data;
            })
            .then((data) => {
                return this.httpService.postJson(this.options.get('validateRegisterUrl'), data);
            })
            .then((response) => {
                this.logger.debug('Register response', response);
                return response.status === 200;
            })
            .catch((err) => {
                this.logger.error('Register response', err);
                return false;
            });
    }
    public attachDevice(): Promise<any> {
        return this.httpService.postJson(this.options.get('prepareAttachDeviceUrl'), {})
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Failed to get credential');
                }
                const data: any = response.data;
                data.challenge = this.convertStringToBuffer(this.base64UrlDecode(data.challenge));
                data.user.id = this.convertStringToBuffer(this.base64UrlDecode(data.user.id));
                return this.platform.window.navigator.credentials.create({publicKey: data});
            })
            .then((credential:PublicKeyCredential) => {
                this.logger.debug('Register response', credential);
                const data = {
                    id: credential.id,
                    rawId: this.base64UrlEncode(credential.rawId),
                    response: {
                        // @ts-ignore
                        attestationObject: this.base64UrlEncode(credential.response.attestationObject),
                        clientDataJSON: this.base64UrlEncode(credential.response.clientDataJSON)
                    },
                    type: credential.type
                };
                return this.httpService.postJson(this.options.get('validateRegisterUrl'), data);
            })
            .then((response) => {
                this.logger.debug('Register response', response);
                return response.status === 200;
            })
            .catch((err) => {
                return false;
            });
    }
    public login(email: string): Promise<boolean> {
        return this.httpService.postJson(this.options.get('prepareLoginUrl'), {name: email})
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Failed to get credential');
                }
                const data: any = response.data;
                data.challenge = this.convertStringToBuffer(this.base64UrlDecode(data.challenge));
                data.allowCredentials = data.allowCredentials.map((cred:any) => {
                    cred.id = this.convertStringToBuffer(this.base64UrlDecode(cred.id));
                    return cred;
                });
                return this.platform.window.navigator.credentials.get({publicKey: data});
            })
            .then((credential:PublicKeyCredential) => {
                this.logger.debug('Login response', credential);
                const data = {
                    id: credential.id,
                    rawId: this.base64UrlEncode(credential.rawId),
                    authenticatorAttachment: credential.authenticatorAttachment,
                    response: {
                        // @ts-ignore
                        authenticatorData: this.base64UrlEncode(credential.response.authenticatorData),
                        clientDataJSON: this.base64UrlEncode(credential.response.clientDataJSON),
                        // @ts-ignore
                        signature: this.base64UrlEncode(credential.response.signature),
                        // @ts-ignore
                        userHandle: this.base64UrlEncode(credential.response.userHandle)
                    },
                    type: credential.type
                };
                return this.httpService.postJson(this.options.get('validateLoginUrl'), data);
            })
            .then((response) => {
                this.logger.debug('Login response', response);
                return response.status === 200;
            })
            .catch((err) => {
                return false;
            });
    }
    public loginDevice(): Promise<boolean> {
        return this.httpService.postJson(this.options.get('prepareLoginDeviceUrl'), {})
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Failed to get credential');
                }
                const data: any = response.data;
                data.challenge = this.convertStringToBuffer(this.base64UrlDecode(data.challenge));
                data.allowCredentials = data.allowCredentials.map((cred:any) => {
                    cred.id = this.convertStringToBuffer(this.base64UrlDecode(cred.id));
                    return cred;
                });
                return this.platform.window.navigator.credentials
                    .get({publicKey: data});
            })
            .then((credential:PublicKeyCredential) => {
                this.logger.debug('Login response', credential);
                const data = {
                    id: credential.id,
                    rawId: this.base64UrlEncode(credential.rawId),
                    authenticatorAttachment: credential.authenticatorAttachment,
                    response: {
                        // @ts-ignore
                        authenticatorData: this.base64UrlEncode(credential.response.authenticatorData),
                        clientDataJSON: this.base64UrlEncode(credential.response.clientDataJSON),
                        // @ts-ignore
                        signature: this.base64UrlEncode(credential.response.signature),
                        // @ts-ignore
                        userHandle: this.base64UrlEncode(credential.response.userHandle)
                    },
                    type: credential.type
                };
                return this.httpService.postJson(this.options.get('validateLoginUrl'), data);
            })
            .then((response) => {
                this.logger.debug('Login response', response);
                return response.status === 200;
            })
            .catch((err) => {
                this.logger.error('Login response', err);
                return false;
            });
    }
    private convertStringToBuffer(str:string|ArrayBuffer):ArrayBuffer {
        if (typeof str === 'string') {
            const id = Uint8Array.from(str, c => c.charCodeAt(0));
            return id.buffer;
        }
        return str;
    }
    private base64UrlDecode(input:string) {
        input = input
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const pad = input.length % 4;
        if (pad) {
            if (pad === 1) {
                throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
            }
            input += new Array(5-pad).join('=');
        }

        return atob(input);
    }
    private base64UrlEncode(a:Uint8Array|ArrayBuffer) {
        let data:Uint8Array;
        if (a instanceof ArrayBuffer) {
            data = new Uint8Array(a);
        } else {
            data = a;
        }
        const str = btoa(String.fromCharCode(...data));
        return str
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
}