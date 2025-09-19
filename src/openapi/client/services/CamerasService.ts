/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CameraCreateInput } from '../models/CameraCreateInput';
import type { CameraMessageResponse } from '../models/CameraMessageResponse';
import type { CameraPaginatedResponse } from '../models/CameraPaginatedResponse';
import type { CameraResponse } from '../models/CameraResponse';
import type { CameraUpdateInput } from '../models/CameraUpdateInput';
import type { CountResponse } from '../models/CountResponse';
import type { UserMessageResponse } from '../models/UserMessageResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CamerasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieves lists cameras with optional search, type, and pagination
     * Retrieves a list of cameras with pagination support
     * @returns CameraPaginatedResponse OK
     * @throws ApiError
     */
    public getApiV1Camera({
        page,
        limit,
        search,
        type,
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
         * Camera type
         */
        type?: 'inside' | 'outside',
    }): CancelablePromise<CameraPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/camera/',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'type': type,
            },
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Deletes a camera
     * Deletes a camera by ID
     * @returns UserMessageResponse User deleted successfully
     * @throws ApiError
     */
    public deleteApiV1CameraDelete({
        id,
    }: {
        /**
         * Camera ID (int)
         */
        id: number,
    }): CancelablePromise<UserMessageResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/camera/{id}/delete/',
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
     * Retrieve single camera
     * Retrieve single camera detail
     * @returns CameraResponse OK
     * @throws ApiError
     */
    public getApiV1CameraDetail({
        id,
    }: {
        /**
         * Camera ID (int)
         */
        id: number,
    }): CancelablePromise<CameraResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/camera/{id}/detail/',
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
     * Update a camera
     * Updates an existing camera
     * @returns CameraMessageResponse Bad Request
     * @throws ApiError
     */
    public patchApiV1CameraUpdate({
        id,
        requestBody,
    }: {
        /**
         * Camera ID (int)
         */
        id: number,
        /**
         * Request data
         */
        requestBody: CameraUpdateInput,
    }): CancelablePromise<CameraMessageResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/v1/camera/{id}/update/',
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
     * Count returns total cameras count
     * Retrieves a count of cameras
     * @returns CountResponse count: 12345
     * @throws ApiError
     */
    public getApiV1CameraCount({
        search,
        type,
    }: {
        /**
         * Search term
         */
        search?: string,
        /**
         * Camera type
         */
        type?: 'inside' | 'outside',
    }): CancelablePromise<CountResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/camera/count/',
            query: {
                'search': search,
                'type': type,
            },
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Creates a new camera
     * Creates new camera
     * @returns CameraMessageResponse Created
     * @throws ApiError
     */
    public postApiV1CameraCreate({
        requestBody,
    }: {
        /**
         * Request body
         */
        requestBody: CameraCreateInput,
    }): CancelablePromise<CameraMessageResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/camera/create/',
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
