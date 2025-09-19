/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AuthService } from './services/AuthService';
import { CamerasService } from './services/CamerasService';
import { CarsService } from './services/CarsService';
import { TariffsService } from './services/TariffsService';
import { UsersService } from './services/UsersService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class FetchClient {
    public readonly auth: AuthService;
    public readonly cameras: CamerasService;
    public readonly cars: CarsService;
    public readonly tariffs: TariffsService;
    public readonly users: UsersService;
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
        this.auth = new AuthService(this.request);
        this.cameras = new CamerasService(this.request);
        this.cars = new CarsService(this.request);
        this.tariffs = new TariffsService(this.request);
        this.users = new UsersService(this.request);
    }
}

