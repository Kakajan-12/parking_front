/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from "../core/BaseHttpRequest";
import type { CancelablePromise } from "../core/CancelablePromise";

export class SystemService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * System-Detail
     * @returns any Successful Response
     * @throws ApiError
     */
    public systemDetail(): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: "GET",
            url: "/system/",
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
