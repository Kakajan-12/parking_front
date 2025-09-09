/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { realtime_UpdateRequest } from '../models/realtime_UpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DefaultService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Establish WebSocket connection for parking counts
     * Provides real-time updates of parking counts via WebSocket
     * @returns void
     * @throws ApiError
     */
    public getApiV1UpdateCount(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/update/count',
        });
    }
    /**
     * Update the count value for a specific parking number
     * Adds the provided total to the existing count for the specified park number
     * @returns any Updated total value and park number
     * @throws ApiError
     */
    public putApiV1UpdateCount({
        request,
    }: {
        /**
         * Total value to add and park number
         */
        request: realtime_UpdateRequest,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/update/count',
            body: request,
            errors: {
                400: `Error message`,
            },
        });
    }
}
