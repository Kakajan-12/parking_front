/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChoiceBase } from './ChoiceBase';
export type UserResponse = {
    /**
     * optional
     */
    carPark?: ChoiceBase;
    createdAt: string;
    /**
     * required in TS, can be empty
     */
    fullName?: string;
    id: string;
    isActive: boolean;
    role: ChoiceBase;
    /**
     * optional, can be nil
     */
    updatedAt?: string;
    username: string;
};

