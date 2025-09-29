/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChoiceBase_CarParkChoices_ } from "./ChoiceBase_CarParkChoices_";

export type OperatorSession = {
    id: number;
    loginAt?: string | null;
    logoutAt?: string | null;
    currency: string;
    totalAmount?: string | null;
    capturedAmount?: string | null;
    totalCars?: number | null;
    paidCars?: number | null;
    carPark?: ChoiceBase_CarParkChoices_ | null;
};
