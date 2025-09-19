/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponse } from './UserResponse';
export type UserSessionExtendedResponse = {
    createdAt: string;
    expireAt: string;
    id: string;
    ipAddress?: string;
    macPassword?: string;
    macUsername?: string;
    revokedAt?: string;
    user?: UserResponse;
    userAgent?: string;
};

