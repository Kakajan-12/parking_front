/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginInput } from '../models/LoginInput';
import type { LoginResponse } from '../models/LoginResponse';
import type { MessagedResponse } from '../models/MessagedResponse';
import type { UserSessionExtendedResponse } from '../models/UserSessionExtendedResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * User login
     * @returns LoginResponse Login successful
     * @throws ApiError
     */
    public postApiV1AuthLogin({
        requestBody,
    }: {
        /**
         * User Login Data
         */
        requestBody: LoginInput,
    }): CancelablePromise<LoginResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/auth/login/',
            body: requestBody,
            errors: {
                400: `Invalid request body`,
                401: `detail: Unauthorized - Invalid token`,
                422: `detail: Validation errors`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Logout User
     * Ends the session of a logged-in user by deleting the JWT token cookie.
     * @returns MessagedResponse message: Logout successful
     * @throws ApiError
     */
    public getApiV1AuthLogout(): CancelablePromise<MessagedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/logout/',
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Retrieves the current user's username, role, and user ID from the JWT token.
     * @returns UserSessionExtendedResponse detail: Returns user session information
     * @throws ApiError
     */
    public getApiV1AuthMe(): CancelablePromise<UserSessionExtendedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/me/',
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                500: `detail: Internal Server Error`,
            },
        });
    }
}
