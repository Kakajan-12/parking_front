/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserSessionExtendedResponse } from './UserSessionExtendedResponse';
export type UserSessionExtendedPaginatedResponse = {
    /**
     * items per page
     */
    limit: number;
    /**
     * current page
     */
    page: number;
    /**
     * generic slice of any type
     */
    rows: Array<UserSessionExtendedResponse>;
};

