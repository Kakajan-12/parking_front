/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AccountService } from './services/AccountService';
import { CameraService } from './services/CameraService';
import { CarParkService } from './services/CarParkService';
import { DefaultService } from './services/DefaultService';
import { FaviconService } from './services/FaviconService';
import { ReleaseService } from './services/ReleaseService';
import { SystemService } from './services/SystemService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class FetchClient {
    public readonly account: AccountService;
    public readonly camera: CameraService;
    public readonly carPark: CarParkService;
    public readonly default: DefaultService;
    public readonly favicon: FaviconService;
    public readonly release: ReleaseService;
    public readonly system: SystemService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '0.1.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
            NEXT: config?.NEXT,
            CACHE: config?.CACHE,
        });
        this.account = new AccountService(this.request);
        this.camera = new CameraService(this.request);
        this.carPark = new CarParkService(this.request);
        this.default = new DefaultService(this.request);
        this.favicon = new FaviconService(this.request);
        this.release = new ReleaseService(this.request);
        this.system = new SystemService(this.request);
    }
}

