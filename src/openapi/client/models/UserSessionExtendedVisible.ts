/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OperatorSession } from "./OperatorSession";
import type { UserVisible } from "./UserVisible";

export type UserSessionExtendedVisible = {
    id: string;
    userId: string;
    revokedAt?: string | null;
    expireAt?: string | null;
    userAgent?: string | null;
    ipAddress?: string | null;
    createdAt: string;
    user: UserVisible;
    operatorSession?: OperatorSession | null;
};
