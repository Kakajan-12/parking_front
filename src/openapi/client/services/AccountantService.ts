/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { modeloperator_Operator } from '../models/modeloperator_Operator';
import type { modelscar_Car_Model } from '../models/modelscar_Car_Model';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AccountantService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Calculate cars based on start and end time
     * Fetch cars that are within the specified time range. 2025-01-29 13:07:31 2025-01-29 14:09:19
     * @returns modelscar_Car_Model List of cars
     * @throws ApiError
     */
    public getApiV1AccountantCalculateMoney({
        start,
        end,
    }: {
        /**
         * Start Time
         */
        start?: string,
        /**
         * End Time
         */
        end?: string,
    }): CancelablePromise<Array<modelscar_Car_Model>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/accountant/calculateMoney',
            query: {
                'start': start,
                'end': end,
            },
        });
    }
    /**
     * Get all operators with pagination
     * Retrieve a list of operators with pagination support
     * @returns modeloperator_Operator OK
     * @throws ApiError
     */
    public getApiV1AccountantOperators({
        page = 1,
        limit = 10,
    }: {
        /**
         * Page number
         */
        page?: number,
        /**
         * Limit per page
         */
        limit?: number,
    }): CancelablePromise<Array<modeloperator_Operator>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/accountant/operators',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
