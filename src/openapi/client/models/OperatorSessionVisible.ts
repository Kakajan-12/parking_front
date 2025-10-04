/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChoiceBase_CarParkChoices_ } from "./ChoiceBase_CarParkChoices_";
import type { OperatorSessionUser } from "./OperatorSessionUser";
import type { UserSessionVisible } from "./UserSessionVisible";

export type OperatorSessionVisible = {
    id: number;
    loginAt: string;
    logoutAt?: string | null;
    currency: string;
    totalAmount?: string | null;
    capturedAmount?: string | null;
    totalCars?: number | null;
    paidCars?: number | null;
    note: string;
    carPark: ChoiceBase_CarParkChoices_;
    createdAt: string;
    updatedAt?: string | null;
    sessionId: string;
    userId: string;
    session?: UserSessionVisible | null;
    user?: OperatorSessionUser | null;
};
