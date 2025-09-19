/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CarResponse } from './CarResponse';
import type { ChoiceBase } from './ChoiceBase';
export type CarSessionResponse = {
    cameraId?: number;
    cameraToken?: string;
    car?: CarResponse;
    carId: number;
    carPark?: ChoiceBase;
    createdAt: string;
    currency: string;
    duration?: number;
    endTime?: string;
    id: number;
    imageUrl?: string;
    isPaid: boolean;
    reason?: string;
    startTime?: string;
    status: ChoiceBase;
    totalAmount?: number;
    /**
     * optional, can be nil
     */
    updatedAt?: string;
};

