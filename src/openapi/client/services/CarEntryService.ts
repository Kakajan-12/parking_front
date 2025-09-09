/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { camera_CapturedEventData } from '../models/camera_CapturedEventData';
import type { resmodel_Response } from '../models/resmodel_Response';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CarEntryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create a car exit record in the parking lot
     * {"EventComment": "BE5084AG", "ChannelId": "8dc9685f-a80b-4d95-ae19-da340efe89ab", "ChannelName": "P4-6"}
     * @returns resmodel_Response Car exit updated successfully
     * @throws ApiError
     */
    public putApiV1CameraGetdata({
        request,
    }: {
        /**
         * Captured data from the camera
         */
        request: camera_CapturedEventData,
    }): CancelablePromise<resmodel_Response> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/camera/getdata',
            body: request,
            errors: {
                400: `Bad request, car already exited`,
                404: `Car not found`,
                500: `Internal server error, failed to update data`,
            },
        });
    }
    /**
     * Create a new car entry in the parking lot
     * {"EventComment": "BE5084AG", "ChannelId": "8dc9685f-a80b-4d95-ae19-da340efe89ab", "ChannelName": "P4-6"}
     * @returns resmodel_Response Car entry created successfully
     * @throws ApiError
     */
    public postApiV1CameraGetdata({
        request,
    }: {
        /**
         * Captured data from the camera
         */
        request: camera_CapturedEventData,
    }): CancelablePromise<resmodel_Response> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/camera/getdata',
            body: request,
            errors: {
                400: `Bad request, car is already inside`,
                500: `Internal server error, failed to save data`,
            },
        });
    }
    /**
     * Create a car exit record in the parking lot
     * {"ChannelName": "P3-2","EventComment": "BE5084AG","ChannelId": "d9b8389a-0727-43d8-afef-c6c937b7f320"}
     * @returns resmodel_Response Car exit updated successfully
     * @throws ApiError
     */
    public putApiV1CameraGetdataNows({
        request,
    }: {
        /**
         * Captured data from the camera
         */
        request: camera_CapturedEventData,
    }): CancelablePromise<resmodel_Response> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/camera/getdata/nows',
            body: request,
            errors: {
                400: `Bad request, car already exited`,
                404: `Car not found`,
                500: `Internal server error, failed to update data`,
            },
        });
    }
}
