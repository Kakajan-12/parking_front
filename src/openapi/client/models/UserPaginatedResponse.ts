/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponse } from './UserResponse';
export type UserPaginatedResponse = {
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
    rows: Array<UserResponse>;
};

