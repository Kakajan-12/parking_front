/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UsersCountService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get total number of users and the count of users by role
     * Retrieves the count of all users and optionally filtered by role
     * @returns void
     * @throws ApiError
     */
    public getApiV1UserCount(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/userCount',
        });
    }
}
