/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CameraBase } from '../models/CameraBase';
import type { CameraCreate } from '../models/CameraCreate';
import type { CameraVisible } from '../models/CameraVisible';
import type { IPaginationDataBase_CameraVisible_ } from '../models/IPaginationDataBase_CameraVisible_';
import type { IResponseBase_CameraVisible_ } from '../models/IResponseBase_CameraVisible_';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CameraService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Camera-List
     * @returns IPaginationDataBase_CameraVisible_ Successful Response
     * @throws ApiError
     */
    public cameraList({
        orderBy,
        page,
        limit,
    }: {
        orderBy?: ('created_at' | '-created_at' | null),
        page?: (number | null),
        limit?: (number | null),
    }): CancelablePromise<IPaginationDataBase_CameraVisible_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/camera/',
            query: {
                'order_by': orderBy,
                'page': page,
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Camera-Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public cameraCount(): CancelablePromise<number> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/camera/count/',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Camera-Create
     * @returns IResponseBase_CameraVisible_ Successful Response
     * @throws ApiError
     */
    public cameraCreate({
        requestBody,
    }: {
        requestBody: CameraCreate,
    }): CancelablePromise<IResponseBase_CameraVisible_> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/camera/create/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Camera-Detail
     * @returns CameraVisible Successful Response
     * @throws ApiError
     */
    public cameraDetail({
        objId,
    }: {
        objId: number,
    }): CancelablePromise<CameraVisible> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/camera/{obj_id}/detail/',
            path: {
                'obj_id': objId,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Camera-Update
     * @returns IResponseBase_CameraVisible_ Successful Response
     * @throws ApiError
     */
    public cameraUpdate({
        objId,
        requestBody,
    }: {
        objId: number,
        requestBody: CameraBase,
    }): CancelablePromise<IResponseBase_CameraVisible_> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/v1/camera/{obj_id}/update/',
            path: {
                'obj_id': objId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
}
