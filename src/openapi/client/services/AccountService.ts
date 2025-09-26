/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_get_token } from '../models/Body_get_token';
import type { CarParkChoices } from '../models/CarParkChoices';
import type { IPaginationDataBase_OperatorSessionVisible_ } from '../models/IPaginationDataBase_OperatorSessionVisible_';
import type { IPaginationDataBase_UserSessionVisible_ } from '../models/IPaginationDataBase_UserSessionVisible_';
import type { IPaginationDataBase_UserVisible_ } from '../models/IPaginationDataBase_UserVisible_';
import type { IResponseBase_OperatorSessionVisible_ } from '../models/IResponseBase_OperatorSessionVisible_';
import type { IResponseBase_str_ } from '../models/IResponseBase_str_';
import type { IResponseBase_Union_UserSessionVisible__NoneType__ } from '../models/IResponseBase_Union_UserSessionVisible__NoneType__';
import type { IResponseBase_UserSessionVisible_ } from '../models/IResponseBase_UserSessionVisible_';
import type { IResponseBase_UserVisible_ } from '../models/IResponseBase_UserVisible_';
import type { OperatorSessionVisible } from '../models/OperatorSessionVisible';
import type { PasswordIn } from '../models/PasswordIn';
import type { Token } from '../models/Token';
import type { UserBase } from '../models/UserBase';
import type { UserCreate } from '../models/UserCreate';
import type { UserSessionExtendedVisible } from '../models/UserSessionExtendedVisible';
import type { UserSessionVisible } from '../models/UserSessionVisible';
import type { UserVisible } from '../models/UserVisible';
import type { VerifyToken } from '../models/VerifyToken';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AccountService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Logout
     * @returns IResponseBase_Union_UserSessionVisible__NoneType__ Successful Response
     * @throws ApiError
     */
    public logout(): CancelablePromise<IResponseBase_Union_UserSessionVisible__NoneType__> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/logout/',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Get-Token
     * Get token from external api
     * @returns Token Successful Response
     * @throws ApiError
     */
    public getToken({
        formData,
        carPark,
    }: {
        formData: Body_get_token,
        carPark?: (CarParkChoices | null),
    }): CancelablePromise<Token> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/auth/get-token/',
            query: {
                'car_park': carPark,
            },
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Verify-Token
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public verifyToken({
        requestBody,
    }: {
        requestBody: VerifyToken,
    }): CancelablePromise<boolean> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/auth/verify-token/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Auth-Sessions
     * @returns UserSessionVisible Successful Response
     * @throws ApiError
     */
    public authSessions(): CancelablePromise<Array<UserSessionVisible>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/sessions/',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Auth-Session-Revoke-All
     * @returns IResponseBase_str_ Successful Response
     * @throws ApiError
     */
    public authSessionRevokeAll(): CancelablePromise<IResponseBase_str_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/sessions/revoke-all/',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Auth-Session-Revoke
     * @returns IResponseBase_UserSessionVisible_ Successful Response
     * @throws ApiError
     */
    public authSessionRevoke({
        objId,
    }: {
        objId: string,
    }): CancelablePromise<IResponseBase_UserSessionVisible_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/sessions/{obj_id}/revoke/',
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
     * Me
     * @returns UserSessionExtendedVisible Successful Response
     * @throws ApiError
     */
    public me(): CancelablePromise<UserSessionExtendedVisible> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/me/',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * User-List
     * @returns IPaginationDataBase_UserVisible_ Successful Response
     * @throws ApiError
     */
    public userList({
        userId,
        search,
        orderBy,
        page,
        limit,
    }: {
        userId?: (string | null),
        search?: (string | null),
        orderBy?: ('created_at' | '-created_at' | null),
        page?: (number | null),
        limit?: (number | null),
    }): CancelablePromise<IPaginationDataBase_UserVisible_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user/',
            query: {
                'user_id': userId,
                'search': search,
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
     * User-Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public userCount({
        search,
    }: {
        search?: (string | null),
    }): CancelablePromise<number> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user/count/',
            query: {
                'search': search,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * User-Create
     * @returns IResponseBase_UserVisible_ Successful Response
     * @throws ApiError
     */
    public userCreate({
        requestBody,
    }: {
        requestBody: UserCreate,
    }): CancelablePromise<IResponseBase_UserVisible_> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/user/create/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * User-Detail
     * @returns UserVisible Successful Response
     * @throws ApiError
     */
    public userDetail({
        objId,
    }: {
        objId: string,
    }): CancelablePromise<UserVisible> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user/{obj_id}/detail/',
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
     * User-Update
     * @returns IResponseBase_UserVisible_ Successful Response
     * @throws ApiError
     */
    public userUpdate({
        objId,
        requestBody,
    }: {
        objId: string,
        requestBody: UserBase,
    }): CancelablePromise<IResponseBase_UserVisible_> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/v1/user/{obj_id}/update/',
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
    /**
     * User-Delete
     * @returns void
     * @throws ApiError
     */
    public userDelete({
        objId,
    }: {
        objId: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/user/{obj_id}/delete/',
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
     * Staff-Change-Password
     * @returns IResponseBase_str_ Successful Response
     * @throws ApiError
     */
    public staffChangePassword({
        requestBody,
    }: {
        requestBody: PasswordIn,
    }): CancelablePromise<IResponseBase_str_> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/staff/change-password/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * User-Session-List
     * @returns IPaginationDataBase_UserSessionVisible_ Successful Response
     * @throws ApiError
     */
    public userSessionList({
        userId,
        orderBy,
        page,
        limit,
    }: {
        userId?: (string | null),
        orderBy?: ('created_at' | '-created_at' | null),
        page?: (number | null),
        limit?: (number | null),
    }): CancelablePromise<IPaginationDataBase_UserSessionVisible_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user/session/',
            query: {
                'user_id': userId,
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
     * User-Session-Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public userSessionCount({
        userId,
    }: {
        userId?: (string | null),
    }): CancelablePromise<number> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user/session/count/',
            query: {
                'user_id': userId,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * User-Session-Revoke
     * @returns IResponseBase_UserSessionVisible_ Successful Response
     * @throws ApiError
     */
    public userSessionRevoke({
        objId,
    }: {
        objId: string,
    }): CancelablePromise<IResponseBase_UserSessionVisible_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/user/session/{obj_id}/revoke/',
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
     * Operator-Session-List
     * @returns IPaginationDataBase_OperatorSessionVisible_ Successful Response
     * @throws ApiError
     */
    public operatorSessionList({
        userId,
        sessionId,
        orderBy,
        page,
        limit,
    }: {
        userId?: (string | null),
        sessionId?: (string | null),
        orderBy?: ('created_at' | '-created_at' | null),
        page?: (number | null),
        limit?: (number | null),
    }): CancelablePromise<IPaginationDataBase_OperatorSessionVisible_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/operator-session/',
            query: {
                'user_id': userId,
                'session_id': sessionId,
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
     * Operator-Session-Count
     * @returns number Successful Response
     * @throws ApiError
     */
    public operatorSessionCount({
        userId,
        sessionId,
    }: {
        userId?: (string | null),
        sessionId?: (string | null),
    }): CancelablePromise<number> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/operator-session/count/',
            query: {
                'user_id': userId,
                'session_id': sessionId,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Operator-Session-Detail
     * @returns OperatorSessionVisible Successful Response
     * @throws ApiError
     */
    public operatorSessionDetail({
        objId,
    }: {
        objId: number,
    }): CancelablePromise<OperatorSessionVisible> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/operator-session/{obj_id}/detail/',
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
     * Operator-Session-Calculate
     * @returns IResponseBase_OperatorSessionVisible_ Successful Response
     * @throws ApiError
     */
    public operatorSessionCalculate({
        objId,
    }: {
        objId: number,
    }): CancelablePromise<IResponseBase_OperatorSessionVisible_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/operator-session/{obj_id}/calculate/',
            path: {
                'obj_id': objId,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
}
