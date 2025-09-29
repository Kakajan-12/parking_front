/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from "../core/BaseHttpRequest";
import type { CancelablePromise } from "../core/CancelablePromise";

export class DefaultService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Root
     * @returns any Successful Response
     * @throws ApiError
     */
    public root(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: "GET",
            url: "/",
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
