/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CountResponse } from '../models/CountResponse';
import type { TariffCreateInput } from '../models/TariffCreateInput';
import type { TariffMessageResponse } from '../models/TariffMessageResponse';
import type { TariffPaginatedResponse } from '../models/TariffPaginatedResponse';
import type { TariffResponse } from '../models/TariffResponse';
import type { TariffUpdateInput } from '../models/TariffUpdateInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TariffsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieves lists tariffs with optional search, type, and pagination
     * Retrieves a list of tariffs with pagination support
     * @returns TariffPaginatedResponse OK
     * @throws ApiError
     */
    public getApiV1Tariff({
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
    }): CancelablePromise<TariffPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/tariff/',
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
     * Retrieve single tariff
     * Retrieve single tariff detail
     * @returns TariffResponse OK
     * @throws ApiError
     */
    public getApiV1TariffDetail({
        id,
    }: {
        /**
         * Tariff ID (int)
         */
        id: number,
    }): CancelablePromise<TariffResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/tariff/{id}/detail/',
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
     * Update a tariff
     * Updates an existing tariff
     * @returns TariffMessageResponse Bad Request
     * @throws ApiError
     */
    public patchApiV1TariffUpdate({
        id,
        requestBody,
    }: {
        /**
         * Tariff ID (int)
         */
        id: number,
        /**
         * Request data
         */
        requestBody: TariffUpdateInput,
    }): CancelablePromise<TariffMessageResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/v1/tariff/{id}/update/',
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
     * Count returns total tariffs count
     * Retrieves a count of tariffs
     * @returns CountResponse count: 12345
     * @throws ApiError
     */
    public getApiV1TariffCount(): CancelablePromise<CountResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/tariff/count/',
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
     * @returns TariffMessageResponse Created
     * @throws ApiError
     */
    public postApiV1TariffCreate({
        requestBody,
    }: {
        /**
         * Request body
         */
        requestBody: TariffCreateInput,
    }): CancelablePromise<TariffMessageResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/tariff/create/',
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
