/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CarCreateInput } from '../models/CarCreateInput';
import type { CarMessageResponse } from '../models/CarMessageResponse';
import type { CarPaginatedResponse } from '../models/CarPaginatedResponse';
import type { CarResponse } from '../models/CarResponse';
import type { CarSessionPaginatedResponse } from '../models/CarSessionPaginatedResponse';
import type { CarUpdateInput } from '../models/CarUpdateInput';
import type { CountResponse } from '../models/CountResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CarsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @returns CarSessionPaginatedResponse OK
     * @throws ApiError
     */
    public getApiV1CarSession({
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
    }): CancelablePromise<CarSessionPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/car-session/',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Count returns total cars count
     * Retrieves a count of cars
     * @returns CountResponse count: 12345
     * @throws ApiError
     */
    public getApiV1CarSessionCount(): CancelablePromise<CountResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/car-session/count/',
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Retrieves lists cars with optional search, type, and pagination
     * Retrieves a list of cars with pagination support
     * @returns CarPaginatedResponse OK
     * @throws ApiError
     */
    public getApiV1Car({
        page,
        limit,
        search,
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
    }): CancelablePromise<CarPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/car/',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
            },
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Retrieve single car
     * Retrieve single car detail
     * @returns CarResponse OK
     * @throws ApiError
     */
    public getApiV1CarDetail({
        id,
    }: {
        /**
         * Car ID (int)
         */
        id: number,
    }): CancelablePromise<CarResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/car/{id}/detail/',
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
     * Update a car
     * Updates an existing car
     * @returns CarMessageResponse Bad Request
     * @throws ApiError
     */
    public patchApiV1CarUpdate({
        id,
        requestBody,
    }: {
        /**
         * Car ID (int)
         */
        id: number,
        /**
         * Request data
         */
        requestBody: CarUpdateInput,
    }): CancelablePromise<CarMessageResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/v1/car/{id}/update/',
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
     * Count returns total cars count
     * Retrieves a count of cars
     * @returns CountResponse count: 12345
     * @throws ApiError
     */
    public getApiV1CarCount({
        search,
    }: {
        /**
         * Search term
         */
        search?: string,
    }): CancelablePromise<CountResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/car/count/',
            query: {
                'search': search,
            },
            errors: {
                401: `detail: Unauthorized - Invalid token`,
                403: `detail: Permission denied`,
                500: `detail: Internal Server Error`,
            },
        });
    }
    /**
     * Creates a new car
     * Creates new car
     * @returns CarMessageResponse Created
     * @throws ApiError
     */
    public postApiV1CarCreate({
        requestBody,
    }: {
        /**
         * Request body
         */
        requestBody: CarCreateInput,
    }): CancelablePromise<CarMessageResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/car/create/',
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
