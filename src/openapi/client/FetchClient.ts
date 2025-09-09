/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AccountantService } from './services/AccountantService';
import { AuthService } from './services/AuthService';
import { CamerasService } from './services/CamerasService';
import { CamFixService } from './services/CamFixService';
import { CarEntryService } from './services/CarEntryService';
import { CarsService } from './services/CarsService';
import { DefaultService } from './services/DefaultService';
import { TarifService } from './services/TarifService';
import { UsersService } from './services/UsersService';
import { UsersCountService } from './services/UsersCountService';
import { ZreportService } from './services/ZreportService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class FetchClient {
    public readonly accountant: AccountantService;
    public readonly auth: AuthService;
    public readonly cameras: CamerasService;
    public readonly camFix: CamFixService;
    public readonly carEntry: CarEntryService;
    public readonly cars: CarsService;
    public readonly default: DefaultService;
    public readonly tarif: TarifService;
    public readonly users: UsersService;
    public readonly usersCount: UsersCountService;
    public readonly zreport: ZreportService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'http://127.0.0.1:3000',
            VERSION: config?.VERSION ?? '1.0',
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
        this.accountant = new AccountantService(this.request);
        this.auth = new AuthService(this.request);
        this.cameras = new CamerasService(this.request);
        this.camFix = new CamFixService(this.request);
        this.carEntry = new CarEntryService(this.request);
        this.cars = new CarsService(this.request);
        this.default = new DefaultService(this.request);
        this.tarif = new TarifService(this.request);
        this.users = new UsersService(this.request);
        this.usersCount = new UsersCountService(this.request);
        this.zreport = new ZreportService(this.request);
    }
}

