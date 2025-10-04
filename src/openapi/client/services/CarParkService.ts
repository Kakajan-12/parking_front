/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from "../core/BaseHttpRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import type { CameraEventIn } from "../models/CameraEventIn";
import type { CarBase } from "../models/CarBase";
import type { CarCreate } from "../models/CarCreate";
import type { CarParkChoices } from "../models/CarParkChoices";
import type { CarSessionVisible } from "../models/CarSessionVisible";
import type { CarSubscriptionBase } from "../models/CarSubscriptionBase";
import type { CarSubscriptionCreate } from "../models/CarSubscriptionCreate";
import type { CarSubscriptionVisible } from "../models/CarSubscriptionVisible";
import type { CarVisible } from "../models/CarVisible";
import type { IPaginationDataBase_CarSessionEventVisible_ } from "../models/IPaginationDataBase_CarSessionEventVisible_";
import type { IPaginationDataBase_CarSessionVisible_ } from "../models/IPaginationDataBase_CarSessionVisible_";
import type { IPaginationDataBase_CarSubscriptionVisible_ } from "../models/IPaginationDataBase_CarSubscriptionVisible_";
import type { IPaginationDataBase_CarVisible_ } from "../models/IPaginationDataBase_CarVisible_";
import type { IPaginationDataBase_TariffVisible_ } from "../models/IPaginationDataBase_TariffVisible_";
import type { IResponseBase_CarSubscriptionVisible_ } from "../models/IResponseBase_CarSubscriptionVisible_";
import type { IResponseBase_CarVisible_ } from "../models/IResponseBase_CarVisible_";
import type { IResponseBase_TariffVisible_ } from "../models/IResponseBase_TariffVisible_";
import type { TariffBase } from "../models/TariffBase";
import type { TariffCreate } from "../models/TariffCreate";
import type { TariffVisible } from "../models/TariffVisible";

export class CarParkService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Car-List
     * @returns IPaginationDataBase_CarVisible_ Successful Response
     * @throws ApiError
     */
    public carList({
        search,
        isStaff,
        orderBy,
        page,
        limit,
    }: {
        search?: string | null;
        isStaff?: boolean | null;
        orderBy?: "created_at" | "-created_at" | null;
        page?: number | null;
        limit?: number | null;
    }): CancelablePromise<IPaginationDataBase_CarVisible_> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/car/",
            query: {
                search: search,
                is_staff: isStaff,
                order_by: orderBy,
                page: page,
                limit: limit,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public carCount({
        search,
        isStaff,
    }: {
        search?: string | null;
        isStaff?: boolean | null;
    }): CancelablePromise<number> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/car/count/",
            query: {
                search: search,
                is_staff: isStaff,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Create
     * @returns IResponseBase_CarVisible_ Successful Response
     * @throws ApiError
     */
    public carCreate({
        requestBody,
    }: {
        requestBody: CarCreate;
    }): CancelablePromise<IResponseBase_CarVisible_> {
        return this.httpRequest.request({
            method: "POST",
            url: "/api/v1/car-park/car/create/",
            body: requestBody,
            mediaType: "application/json",
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Detail
     * @returns CarVisible Successful Response
     * @throws ApiError
     */
    public carDetail({ objId }: { objId: number }): CancelablePromise<CarVisible> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/{obj_id}/detail/",
            path: {
                obj_id: objId,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Update
     * @returns IResponseBase_CarVisible_ Successful Response
     * @throws ApiError
     */
    public carUpdate({
        objId,
        requestBody,
    }: {
        objId: number;
        requestBody: CarBase;
    }): CancelablePromise<IResponseBase_CarVisible_> {
        return this.httpRequest.request({
            method: "PATCH",
            url: "/api/v1/car-park/{obj_id}/update/",
            path: {
                obj_id: objId,
            },
            body: requestBody,
            mediaType: "application/json",
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Subscription-List
     * @returns IPaginationDataBase_CarSubscriptionVisible_ Successful Response
     * @throws ApiError
     */
    public carSubscriptionList({
        isPaid,
        isActive,
        orderBy,
        page,
        limit,
    }: {
        isPaid?: boolean | null;
        isActive?: boolean | null;
        orderBy?: "created_at" | "-created_at" | null;
        page?: number | null;
        limit?: number | null;
    }): CancelablePromise<IPaginationDataBase_CarSubscriptionVisible_> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/subscription/",
            query: {
                is_paid: isPaid,
                is_active: isActive,
                order_by: orderBy,
                page: page,
                limit: limit,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Subscription-Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public carSubscriptionCount({
        isPaid,
        isActive,
    }: {
        isPaid?: boolean | null;
        isActive?: boolean | null;
    }): CancelablePromise<number> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/subscription/count/",
            query: {
                is_paid: isPaid,
                is_active: isActive,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Subscription-Create
     * @returns IResponseBase_CarSubscriptionVisible_ Successful Response
     * @throws ApiError
     */
    public carSubscriptionCreate({
        requestBody,
    }: {
        requestBody: CarSubscriptionCreate;
    }): CancelablePromise<IResponseBase_CarSubscriptionVisible_> {
        return this.httpRequest.request({
            method: "POST",
            url: "/api/v1/car-park/subscription/create/",
            body: requestBody,
            mediaType: "application/json",
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Subscription-Detail
     * @returns CarSubscriptionVisible Successful Response
     * @throws ApiError
     */
    public carSubscriptionDetail({
        objId,
    }: {
        objId: number;
    }): CancelablePromise<CarSubscriptionVisible> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/subscription/{obj_id}/detail/",
            path: {
                obj_id: objId,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Subscription-Update
     * @returns IResponseBase_CarSubscriptionVisible_ Successful Response
     * @throws ApiError
     */
    public carSubscriptionUpdate({
        objId,
        requestBody,
    }: {
        objId: number;
        requestBody: CarSubscriptionBase;
    }): CancelablePromise<IResponseBase_CarSubscriptionVisible_> {
        return this.httpRequest.request({
            method: "PATCH",
            url: "/api/v1/car-park/subscription/{obj_id}/update/",
            path: {
                obj_id: objId,
            },
            body: requestBody,
            mediaType: "application/json",
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Session-List
     * @returns IPaginationDataBase_CarSessionVisible_ Successful Response
     * @throws ApiError
     */
    public carSessionList({
        search,
        carPark,
        orderBy,
        operatorSessionId,
        page,
        limit,
    }: {
        search?: string | null;
        carPark?: CarParkChoices | null;
        orderBy?: "created_at" | "-created_at" | null;
        operatorSessionId?: number | null;
        page?: number | null;
        limit?: number | null;
    }): CancelablePromise<IPaginationDataBase_CarSessionVisible_> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/session/",
            query: {
                search: search,
                car_park: carPark,
                order_by: orderBy,
                operator_session_id: operatorSessionId,
                page: page,
                limit: limit,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Session-Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public carSessionCount({
        search,
        operatorSessionId,
        carPark,
    }: {
        search?: string | null;
        operatorSessionId?: number | null;
        carPark?: CarParkChoices | null;
    }): CancelablePromise<number> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/session/count/",
            query: {
                search: search,
                operator_session_id: operatorSessionId,
                car_park: carPark,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Car-Session-Detail
     * @returns CarSessionVisible Successful Response
     * @throws ApiError
     */
    public carSessionDetail({ objId }: { objId: number }): CancelablePromise<CarSessionVisible> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/session/{obj_id}/detail/",
            path: {
                obj_id: objId,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Tariff-List
     * @returns IPaginationDataBase_TariffVisible_ Successful Response
     * @throws ApiError
     */
    public tariffList({
        orderBy,
        page,
        limit,
    }: {
        orderBy?: "created_at" | "-created_at" | null;
        page?: number | null;
        limit?: number | null;
    }): CancelablePromise<IPaginationDataBase_TariffVisible_> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/tariff/",
            query: {
                order_by: orderBy,
                page: page,
                limit: limit,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Tariff-Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public tariffCount(): CancelablePromise<number> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/tariff/count/",
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Tariff-Create
     * @returns IResponseBase_TariffVisible_ Successful Response
     * @throws ApiError
     */
    public tariffCreate({
        requestBody,
    }: {
        requestBody: TariffCreate;
    }): CancelablePromise<IResponseBase_TariffVisible_> {
        return this.httpRequest.request({
            method: "POST",
            url: "/api/v1/car-park/tariff/create/",
            body: requestBody,
            mediaType: "application/json",
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Tariff-Detail
     * @returns TariffVisible Successful Response
     * @throws ApiError
     */
    public tariffDetail({ objId }: { objId: number }): CancelablePromise<TariffVisible> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/tariff/{obj_id}/detail/",
            path: {
                obj_id: objId,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Tariff-Update
     * @returns IResponseBase_TariffVisible_ Successful Response
     * @throws ApiError
     */
    public tariffUpdate({
        objId,
        requestBody,
    }: {
        objId: number;
        requestBody: TariffBase;
    }): CancelablePromise<IResponseBase_TariffVisible_> {
        return this.httpRequest.request({
            method: "PATCH",
            url: "/api/v1/car-park/tariff/{obj_id}/update/",
            path: {
                obj_id: objId,
            },
            body: requestBody,
            mediaType: "application/json",
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Camera-Event-List
     * @returns IPaginationDataBase_CarSessionEventVisible_ Successful Response
     * @throws ApiError
     */
    public cameraEventList({
        orderBy,
        search,
        carPark,
        page,
        limit,
    }: {
        orderBy?: "created_at" | "-created_at" | null;
        search?: string | null;
        carPark?: CarParkChoices | null;
        page?: number | null;
        limit?: number | null;
    }): CancelablePromise<IPaginationDataBase_CarSessionEventVisible_> {
        return this.httpRequest.request({
            method: "GET",
            url: "/api/v1/car-park/event/",
            query: {
                order_by: orderBy,
                search: search,
                car_park: carPark,
                page: page,
                limit: limit,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Camera-Event-Entry
     * @returns string Successful Response
     * @throws ApiError
     */
    public cameraEventEntry({
        requestBody,
    }: {
        requestBody: CameraEventIn;
    }): CancelablePromise<string> {
        return this.httpRequest.request({
            method: "POST",
            url: "/api/v1/car-park/event/entry/",
            body: requestBody,
            mediaType: "application/json",
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Camera-Event-Exit
     * @returns string Successful Response
     * @throws ApiError
     */
    public cameraEventExit({
        requestBody,
    }: {
        requestBody: CameraEventIn;
    }): CancelablePromise<string> {
        return this.httpRequest.request({
            method: "POST",
            url: "/api/v1/car-park/event/exit/",
            body: requestBody,
            mediaType: "application/json",
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
}
