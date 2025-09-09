/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { modelscar_Car_Model } from '../models/modelscar_Car_Model';
import type { modelscar_CarUpdate } from '../models/modelscar_CarUpdate';
import type { operator_GetCarsResponse } from '../models/operator_GetCarsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CarsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Update a car by plate number
     * Updates a car's status and calculates payment and duration based on start and end times.
     * @returns any Updated car details
     * @throws ApiError
     */
    public putApiV1CameraUpdatecar({
        plate,
        car,
    }: {
        /**
         * Car plate number
         */
        plate: string,
        /**
         * Car details to update
         */
        car: modelscar_CarUpdate,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/camera/updatecar/{plate}',
            path: {
                'plate': plate,
            },
            body: car,
            errors: {
                400: `Car already exited or invalid request`,
                404: `Car not found`,
                500: `Error parsing time`,
            },
        });
    }
    /**
     * Get list of cars
     * Get list of cars with pagination
     * @returns operator_GetCarsResponse OK
     * @throws ApiError
     */
    public getApiV1Getallcars({
        page = 1,
        limit = 5,
    }: {
        /**
         * Page number
         */
        page?: number,
        /**
         * Number of items per page
         */
        limit?: number,
    }): CancelablePromise<operator_GetCarsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/getallcars',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Get a car by ID
     * Get a car by ID
     * @returns modelscar_Car_Model OK
     * @throws ApiError
     */
    public getApiV1Getcar({
        id,
    }: {
        /**
         * Car ID
         */
        id: number,
    }): CancelablePromise<modelscar_Car_Model> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/getcar/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Search for cars
     * Retrieve a paginated list of cars with optional filtering by car number, enter time range, end time range, park number, and status.
     * @returns operator_GetCarsResponse OK
     * @throws ApiError
     */
    public getApiV1Searchcar({
        carNumber,
        enterTime,
        endTime,
        parkno,
        status,
        page = 1,
        limit = 5,
    }: {
        /**
         * Filter by car plate number (partial match allowed)
         */
        carNumber?: string,
        /**
         * Start of enter time range (YYYY-MM-DD)
         */
        enterTime?: string,
        /**
         * End of end time range (YYYY-MM-DD)
         */
        endTime?: string,
        /**
         * Filter by parking spot number
         */
        parkno?: string,
        /**
         * Filter by car status (Inside, Exited)
         */
        status?: string,
        /**
         * Page number
         */
        page?: number,
        /**
         * Number of items per page
         */
        limit?: number,
    }): CancelablePromise<operator_GetCarsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/searchcar',
            query: {
                'car_number': carNumber,
                'enter_time': enterTime,
                'end_time': endTime,
                'parkno': parkno,
                'status': status,
                'page': page,
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
