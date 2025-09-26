/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CarVisible } from './CarVisible';
export type CarSubscriptionVisible = {
    id: number;
    currency: string;
    totalAmount: string;
    carId: number;
    startTime: string;
    endTime: string;
    isPaid: boolean;
    isActive: boolean;
    note: string;
    car?: (CarVisible | null);
    createdAt: string;
    updatedAt?: string;
};

