/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { tarif_Tarif } from '../models/tarif_Tarif';
import type { tarifcontrol_PaginatedResponse } from '../models/tarifcontrol_PaginatedResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TarifService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Search for cars by plate number
     * Retrieves cars from the database that match the given plate number with pagination.
     * @returns tarifcontrol_PaginatedResponse List of matching cars with pagination
     * @throws ApiError
     */
    public getApiV1AccountantSearchCar({
        carNumber,
        page = 1,
        limit = 5,
    }: {
        /**
         * Car plate number to search for
         */
        carNumber?: string,
        /**
         * Page number
         */
        page?: number,
        /**
         * Number of items per page
         */
        limit?: number,
    }): CancelablePromise<tarifcontrol_PaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/accountant/search_car',
            query: {
                'car_number': carNumber,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Get all Tarifs with pagination
     * Retrieves all tarifs from the database with pagination support.
     * @returns tarifcontrol_PaginatedResponse List of tarifs
     * @throws ApiError
     */
    public getApiV1AccountantTarif({
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
    }): CancelablePromise<tarifcontrol_PaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/accountant/tarif',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                500: `Database error`,
            },
        });
    }
    /**
     * Create a New Tarif
     * Creates a new tarif and saves it to the database.
     * @returns tarif_Tarif Successfully created
     * @throws ApiError
     */
    public postApiV1AccountantTarif({
        tarif,
    }: {
        /**
         * Tarif details to be created
         */
        tarif: tarif_Tarif,
    }): CancelablePromise<tarif_Tarif> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/accountant/tarif',
            body: tarif,
            errors: {
                400: `Invalid request data`,
                500: `Failed to save data to the database`,
            },
        });
    }
    /**
     * Delete Tarif
     * Deletes a tarif by its ID.
     * @returns string Tarif successfully deleted
     * @throws ApiError
     */
    public deleteApiV1AccountantTarif({
        id,
    }: {
        /**
         * ID of the tarif to delete
         */
        id: number,
    }): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/accountant/tarif/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Invalid ID format`,
                404: `Tarif not found`,
                500: `Database error`,
            },
        });
    }
}
