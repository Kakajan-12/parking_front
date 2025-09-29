/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CarSessionEventVisible } from "./CarSessionEventVisible";
import type { ChoiceBase_CarParkChoices_ } from "./ChoiceBase_CarParkChoices_";

export type CarSessionVisible = {
    id: number;
    carNumber: string;
    carId: number;
    totalAmount?: string | null;
    currency: string;
    reason: string;
    isPaid: boolean;
    isSubscription: boolean;
    startTime?: string | null;
    endTime?: string | null;
    invalidatedAt?: string | null;
    carPark: ChoiceBase_CarParkChoices_;
    events?: Array<CarSessionEventVisible> | null;
    createdAt: string;
    updatedAt?: string | null;
    operatorSessionId?: number | null;
    imageUrl?: string | null;
};
