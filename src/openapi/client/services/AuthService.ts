/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { modelsuser_User } from '../models/modelsuser_User';
import type { usercontrol_LoginInput } from '../models/usercontrol_LoginInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Login User
     * { "username": "Dowran", "password": "12345678", "parkno": "P4" }
     * @returns string message: Login successful
     * @throws ApiError
     */
    public postApiV1AuthLogin({
        credentials,
    }: {
        /**
         * User Login Data
         */
        credentials: usercontrol_LoginInput,
    }): CancelablePromise<Record<string, string>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/auth/login',
            body: credentials,
            errors: {
                400: `message: Invalid request body`,
                401: `message: Invalid username or password`,
                500: `message: Internal Server Error`,
            },
        });
    }
    /**
     * Logout User
     * Ends the session of a logged-in user by deleting the JWT token cookie.
     * @returns string message: Logout successful
     * @throws ApiError
     */
    public postApiV1AuthLogout(): CancelablePromise<Record<string, string>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/auth/logout',
            errors: {
                500: `message: Internal Server Error`,
            },
        });
    }
    /**
     * Get current user information
     * Retrieves the current user's username, role, and user ID from the JWT token.
     * @returns any Returns user information
     * @throws ApiError
     * @example: {
     *     "keys": [],
     *     "macpassword": "adam",
     *     "macusername": "adam",
     *     "parkno": "P3",
     *     "role": "admin",
     *     "user_id": "2",
     *     "username": "adam-2"
     * }
     */
    public getApiV1AuthMe(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/me',
            errors: {
                400: `message: Bad Request - Missing data from middleware`,
                401: `message: Unauthorized - Invalid token`,
                500: `message: Internal Server Error - Missing data from middleware`,
            },
        });
    }
    /**
     * Register User
     * Creates a new user and stores their hashed password. Example: { "username": "newUser", "password": "password123", "firstname": "John", "lastname": "Doe", "role": "admin" }
     * @returns string message: User Created
     * @throws ApiError
     */
    public postApiV1AuthRegister({
        user,
    }: {
        /**
         * User Registration Data
         */
        user: modelsuser_User,
    }): CancelablePromise<Record<string, string>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/auth/register',
            body: user,
            errors: {
                400: `message: Password must be at least 8 characters long`,
                500: `message: Internal Server Error`,
            },
        });
    }
}
