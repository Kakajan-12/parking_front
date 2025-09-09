/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { modelsuser_User } from '../models/modelsuser_User';
import type { modelsuser_UserRes } from '../models/modelsuser_UserRes';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UsersService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get all operators
     * Retrieves a list of users who have the role "operator" in descending order by ID
     * @returns any List of operators with pagination metadata
     * @throws ApiError
     */
    public getApiV1UserOperators({
        page = 1,
        limit = 10,
    }: {
        /**
         * Page number
         */
        page?: number,
        /**
         * Number of items per page
         */
        limit?: number,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user/operators',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                404: `No operators found`,
                500: `Error retrieving users with operator role`,
            },
        });
    }
    /**
     * Get all users
     * Retrieves a list of users with pagination support
     * @returns any OK
     * @throws ApiError
     */
    public getApiV1Users({
        page,
        limit,
    }: {
        /**
         * Page number
         */
        page?: number,
        /**
         * Limit per page
         */
        limit?: number,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/users',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                500: `Can not retrieve users`,
            },
        });
    }
    /**
     * Create a new user
     * Creates a new user in the database
     * @returns modelsuser_User OK
     * @throws ApiError
     */
    public postApiV1Users({
        user,
    }: {
        /**
         * User data
         */
        user: modelsuser_User,
    }): CancelablePromise<modelsuser_User> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/users',
            body: user,
            errors: {
                400: `Can not parse`,
                500: `Can not create`,
            },
        });
    }
    /**
     * Get user by ID
     * Retrieves a user from the database using their unique ID
     * @returns modelsuser_UserRes OK
     * @throws ApiError
     */
    public getApiV1Users1({
        id,
    }: {
        /**
         * User ID
         */
        id: number,
    }): CancelablePromise<modelsuser_UserRes> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update user fields based on the provided data
     * Updates a user's data (isActive, username, firstname, lastname, etc.) in the database based on the input provided
     * @returns modelsuser_UserRes OK
     * @throws ApiError
     */
    public putApiV1Users({
        id,
        user,
    }: {
        /**
         * User ID
         */
        id: number,
        /**
         * User data to update
         */
        user: modelsuser_User,
    }): CancelablePromise<modelsuser_UserRes> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
            body: user,
            errors: {
                400: `Invalid user data`,
                404: `User not found`,
                500: `Error updating user`,
            },
        });
    }
    /**
     * Delete a user by ID
     * Deletes a user's information from the database using their unique ID
     * @returns string User deleted successfully
     * @throws ApiError
     */
    public deleteApiV1Users({
        id,
    }: {
        /**
         * User ID
         */
        id: number,
    }): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `User not found`,
                500: `Error deleting user`,
            },
        });
    }
}
