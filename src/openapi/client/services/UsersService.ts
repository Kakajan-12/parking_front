/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CountResponse } from '../models/CountResponse';
import type { MessagedResponse } from '../models/MessagedResponse';
import type { UserCreateInput } from '../models/UserCreateInput';
import type { UserMessageResponse } from '../models/UserMessageResponse';
import type { UserPaginatedResponse } from '../models/UserPaginatedResponse';
import type { UserResponse } from '../models/UserResponse';
import type { UserSessionExtendedPaginatedResponse } from '../models/UserSessionExtendedPaginatedResponse';
import type { UserSessionExtendedResponse } from '../models/UserSessionExtendedResponse';
import type { UserUpdateInput } from '../models/UserUpdateInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UsersService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieves all users with pagination
     * Retrieves a list of users with pagination support
     * @returns UserSessionExtendedPaginatedResponse OK
     * @throws ApiError
     */
    public getApiV1UserSession({
        page,
        limit,
        userId,
    }: {
        /**
         * Page number
         */
        page?: number,
        /**
         * Limit per page
         */
        limit?: number,
        /**
         * User ID (UUID)
         */
        userId?: string,
    }): CancelablePromise<UserSessionExtendedPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user-session/',
            query: {
                'page': page,
                'limit': limit,
                'user_id': userId,
            },
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Retrieve single user session
     * Retrieve single user session
     * @returns UserSessionExtendedResponse OK
     * @throws ApiError
     */
    public getApiV1UserSessionDetail({
        id,
    }: {
        /**
         * User session ID (UUID)
         */
        id: string,
    }): CancelablePromise<UserSessionExtendedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user-session/{id}/detail/',
            path: {
                'id': id,
            },
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Retrieves all user sessions with pagination
     * Retrieves a list of users with pagination support
     * @returns MessagedResponse OK
     * @throws ApiError
     */
    public getApiV1UserSessionRevoke({
        id,
    }: {
        /**
         * User session ID (UUID)
         */
        id: string,
    }): CancelablePromise<MessagedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user-session/{id}/revoke/',
            path: {
                'id': id,
            },
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Retrieves all users with pagination
     * Retrieves a list of users with pagination support
     * @returns UserPaginatedResponse OK
     * @throws ApiError
     */
    public getApiV1User({
        page,
        limit,
        search,
        isActive,
    }: {
        /**
         * Page number
         */
        page?: number,
        /**
         * Limit per page
         */
        limit?: number,
        /**
         * Search term
         */
        search?: string,
        /**
         * User activity
         */
        isActive?: boolean,
    }): CancelablePromise<UserPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user/',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'is_active': isActive,
            },
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Delete a user
     * Deletes a user by ID
     * @returns UserMessageResponse User deleted successfully
     * @throws ApiError
     */
    public deleteApiV1UserDelete({
        id,
    }: {
        /**
         * User ID (UUID)
         */
        id: string,
    }): CancelablePromise<UserMessageResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/user/{id}/delete/',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized - Invalid token`,
                403: `Permission denied`,
                404: `User not found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Retrieve single user
     * Retrieve single user detail
     * @returns UserResponse OK
     * @throws ApiError
     */
    public getApiV1UserDetail({
        id,
    }: {
        /**
         * User ID (UUID)
         */
        id: string,
    }): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user/{id}/detail/',
            path: {
                'id': id,
            },
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Update a user
     * Updates user data by ID
     * @returns UserMessageResponse Bad Request
     * @throws ApiError
     */
    public patchApiV1UserUpdate({
        id,
        requestBody,
    }: {
        /**
         * User ID (UUID)
         */
        id: string,
        /**
         * User update Data
         */
        requestBody: UserUpdateInput,
    }): CancelablePromise<UserMessageResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/v1/user/{id}/update/',
            path: {
                'id': id,
            },
            body: requestBody,
            errors: {
                400: `detail: BadRequest - invalid request`,
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                404: `detail: User not found`,
                422: `detail: Validation errors`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Count all users
     * Retrieves a count of users
     * @returns CountResponse count: 12345
     * @throws ApiError
     */
    public getApiV1UserCount({
        search,
        isActive,
    }: {
        /**
         * Search term
         */
        search?: string,
        /**
         * User activity
         */
        isActive?: boolean,
    }): CancelablePromise<CountResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user/count/',
            query: {
                'search': search,
                'is_active': isActive,
            },
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Create and response new user
     * Creates new user
     * @returns UserMessageResponse Created
     * @throws ApiError
     */
    public postApiV1UserCreate({
        requestBody,
    }: {
        /**
         * User create Data
         */
        requestBody: UserCreateInput,
    }): CancelablePromise<UserMessageResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/user/create/',
            body: requestBody,
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                422: `detail: Validation errors`,
                500: `detail: Internal Server Error`,
            },
        });
    }
}
