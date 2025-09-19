/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from "@/openapi/client/core/BaseHttpRequest";
import { FetchHttpRequest } from "@/openapi/client/core/FetchHttpRequest";
import type { OpenAPIConfig } from "@/openapi/client/core/OpenAPI";

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class FetchClient {
    public readonly request: BaseHttpRequest;

    constructor(
        config?: Partial<OpenAPIConfig>,
        HttpRequest: HttpRequestConstructor = FetchHttpRequest,
    ) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? "",
            VERSION: config?.VERSION ?? "0.1.0",
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? "include",
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
            NEXT: config?.NEXT,
            CACHE: config?.CACHE,
        });
    }
}
