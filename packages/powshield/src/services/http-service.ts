import {HttpClientConfiguration, IHttpClient} from '@aurelia/fetch-client';
import {DI, IEventAggregator} from 'aurelia';
import {IHttpResponse} from '../interfaces/http';

export const IHttpService =
    DI.createInterface<IHttpService>('IHttpService', (x) =>
        x.singleton(HttpService)
    );
export interface IHttpService extends HttpService {}
export class HttpService {

    private apiBaseUrl: string = '';
    public constructor(
        @IHttpClient private readonly httpClient: IHttpClient,
        @IEventAggregator private readonly ea: IEventAggregator
    )
    {
        if ((window as any).apiBaseUrl) {
            this.apiBaseUrl = (window as any).apiBaseUrl.replace(/\/$/, '');
        }
        this.httpClient.configure((config: HttpClientConfiguration) => {
            config.withDefaults({
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include'
            });
            return config;
        });
    }

    public getJson(url: string, requestInit: RequestInit|null = null): Promise<IHttpResponse>
    {
        requestInit = requestInit || {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        requestInit.method = 'GET';
        return this.fetch(url, null, requestInit);
    }
    public postJson(url: string, payload:any, requestInit: RequestInit|null = null): Promise<IHttpResponse>
    {
        requestInit = requestInit || {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        requestInit.method = 'POST';
        return this.fetch(url, payload, requestInit);
    }

    private fetch(url: string, payload:any = null, requestInit: RequestInit): Promise<IHttpResponse>
    {
        requestInit.headers = requestInit.headers || {};
        // @ts-ignore
        requestInit.headers['Accept'] = requestInit.headers['Accept'] || 'application/json';
        // @ts-ignore
        requestInit.headers['Content-Type'] = requestInit.headers['Content-Type'] || 'application/json';
        if (payload != null) {
            requestInit.body = JSON.stringify(payload);
        }

        const fullUrl = this.apiBaseUrl + url;
        return this.httpClient.fetch(fullUrl, requestInit)
            .then((response) => {
                const headers = response.headers;
                const status = response.status;
                const statusText = response.statusText;
                const contentType:string|null = headers.get('Content-Type') as string
                let data:any = response;
                if (contentType.indexOf('json') !== -1) {
                    data = response.json();
                } else if (contentType.indexOf('text') !== -1) {
                    data = response.text();
                } else {
                    data = response.blob();
                }
                return Promise.all([status, statusText, headers, data]);
            })
            .then(([status, statusText, headers, data]) => {
                const response:IHttpResponse = {
                    status,
                    statusText,
                    headers,
                    data
                };
                if (status >= 200 && status < 300) {
                    return response;
                } else {
                    return Promise.reject(response);
                }
            });
    }
}