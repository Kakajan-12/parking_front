/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CarParkType } from './CarParkType';
import type { RoleType } from './RoleType';
export type UserCreateInput = {
    /**
     * optional
     */
    carPark?: CarParkType;
    fullName: string;
    isActive?: boolean;
    password: string;
    role: RoleType;
    username: string;
};

