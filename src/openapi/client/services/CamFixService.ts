/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { camera_CamFix } from '../models/camera_CamFix';
import type { camfix_Response } from '../models/camfix_Response';
import type { camfix_SuccessResponse } from '../models/camfix_SuccessResponse';
import type { camfix_UpdateCameraTypeRequest } from '../models/camfix_UpdateCameraTypeRequest';
import type { modelsuser_MacUser } from '../models/modelsuser_MacUser';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CamFixService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create a New CamFix
     * Creates a new cam and saves it to the database.
     * @returns camera_CamFix Successfully created
     * @throws ApiError
     */
    public postApiV1Addcam({
        cam,
    }: {
        /**
         * Cam details to be created
         */
        cam: camera_CamFix,
    }): CancelablePromise<camera_CamFix> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/addcam',
            body: cam,
            errors: {
                400: `Invalid data`,
                409: `Camera already exists`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Delete a CamFix by ID
     * Deletes a camera from the database using its ID
     * @returns camfix_Response Successfully deleted
     * @throws ApiError
     */
    public deleteApiV1Deletecam({
        id,
    }: {
        /**
         * ID of the camera to delete
         */
        id: number,
    }): CancelablePromise<camfix_Response> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/deletecam/{id}',
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
     * Sync CamFix records with config data
     * Fetches data from config endpoint and synchronizes CamFix records: creates new ones, updates existing ones, and deletes obsolete ones.
     * @returns void
     * @throws ApiError
     */
    public getApiV1SyncCamfix(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/sync-camfix',
        });
    }
    /**
     * Update Camera Type
     * Update only the Type of a camera by its ID
     * @returns camera_CamFix OK
     * @throws ApiError
     */
    public patchApiV1Type({
        id,
        body,
    }: {
        /**
         * Camera ID
         */
        id: number,
        /**
         * New camera type
         */
        body: camfix_UpdateCameraTypeRequest,
    }): CancelablePromise<camera_CamFix> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/v1/type/{id}',
            path: {
                'id': id,
            },
            body: body,
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update ChannelIds by ChannelName
     * Updates ChannelId for all CamFix records matching the provided ChannelName(s).
     * @returns void
     * @throws ApiError
     */
    public putApiV1UpdateChannelIds({
        updates,
    }: {
        /**
         * List of ChannelName and ChannelId pairs to update
         */
        updates: Array<Record<string, string>>,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/update-channel-ids',
            body: updates,
        });
    }
    /**
     * Update an existing MacUser
     * Update an existing MacUser's details such as MacUsername and MacPassword
     * @returns camfix_SuccessResponse OK
     * @throws ApiError
     */
    public putApiV1Updatemac({
        macuser,
    }: {
        /**
         * MacUser object
         */
        macuser: modelsuser_MacUser,
    }): CancelablePromise<camfix_SuccessResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/updatemac',
            body: macuser,
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
}
