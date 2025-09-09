/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { camera_Cameras } from '../models/camera_Cameras';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CamerasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get cameras with pagination
     * Retrieves a list of cameras from the database with pagination
     * @returns camera_Cameras OK
     * @throws ApiError
     */
    public getApiV1Cameras({
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
    }): CancelablePromise<camera_Cameras> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/cameras',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                500: `Internal server error`,
            },
        });
    }
    /**
     * Create a new camera
     * Creates a new camera in the database with validation for camera type
     * @returns camera_Cameras Created
     * @throws ApiError
     */
    public postApiV1Cameras({
        camera,
    }: {
        /**
         * Camera data
         */
        camera: camera_Cameras,
    }): CancelablePromise<camera_Cameras> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/cameras',
            body: camera,
            errors: {
                400: `Invalid camera type`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get a camera by ID
     * Retrieves the camera from the database using its unique ID
     * @returns camera_Cameras OK
     * @throws ApiError
     */
    public getApiV1Cameras1({
        id,
    }: {
        /**
         * Camera ID
         */
        id: number,
    }): CancelablePromise<camera_Cameras> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/cameras/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Camera not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update a camera by ID
     * Updates the camera data in the database using its unique ID
     * @returns camera_Cameras OK
     * @throws ApiError
     */
    public putApiV1Cameras({
        id,
        camera,
    }: {
        /**
         * Camera ID
         */
        id: number,
        /**
         * Updated camera data
         */
        camera: camera_Cameras,
    }): CancelablePromise<camera_Cameras> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/cameras/{id}',
            path: {
                'id': id,
            },
            body: camera,
            errors: {
                400: `Invalid camera data`,
                404: `Camera not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Delete a camera by ID
     * Deletes the camera from the database using its unique ID
     * @returns string Camera deleted successfully
     * @throws ApiError
     */
    public deleteApiV1Cameras({
        id,
    }: {
        /**
         * Camera ID
         */
        id: number,
    }): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/cameras/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Camera not found`,
                500: `Internal server error`,
            },
        });
    }
}
