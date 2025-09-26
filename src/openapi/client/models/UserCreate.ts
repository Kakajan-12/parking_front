/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CarParkChoices } from './CarParkChoices';
import type { RoleTypeChoices } from './RoleTypeChoices';
export type UserCreate = {
    username: string;
    fullName: string;
    password: string;
    isStaff?: (boolean | null);
    isActive?: (boolean | null);
    carPark?: (CarParkChoices | null);
    role: RoleTypeChoices;
};

