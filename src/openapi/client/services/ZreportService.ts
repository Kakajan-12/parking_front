/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { zreport_ZReport } from '../models/zreport_ZReport';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ZreportService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create a New Tarif
     * Creates a new Report and saves it to the database.
     * @returns zreport_ZReport Successfully created
     * @throws ApiError
     */
    public postZreport({
        tarif,
    }: {
        /**
         * Tarif details to be created
         */
        tarif: zreport_ZReport,
    }): CancelablePromise<zreport_ZReport> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/zreport',
            body: tarif,
            errors: {
                400: `Invalid request data`,
                500: `Failed to save data to the database`,
            },
        });
    }
}
