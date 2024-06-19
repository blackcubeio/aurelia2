import { IHttpClient } from '@aurelia/fetch-client';
import { IEventAggregator } from 'aurelia';
import { IHttpResponse } from '../interfaces/http';
export declare const IHttpService: import("@aurelia/kernel").InterfaceSymbol<IHttpService>;
export interface IHttpService extends HttpService {
}
export declare class HttpService {
    private readonly httpClient;
    private readonly ea;
    private apiBaseUrl;
    constructor(httpClient?: IHttpClient, ea?: IEventAggregator);
    getJson(url: string, requestInit?: RequestInit | null): Promise<IHttpResponse>;
    postJson(url: string, payload: any, requestInit?: RequestInit | null): Promise<IHttpResponse>;
    private fetch;
}
//# sourceMappingURL=http-service.d.ts.map