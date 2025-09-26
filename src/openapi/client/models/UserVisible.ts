/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChoiceBase_CarParkChoices_ } from './ChoiceBase_CarParkChoices_';
import type { ChoiceBase_RoleTypeChoices_ } from './ChoiceBase_RoleTypeChoices_';
import type { UserSessionVisible } from './UserSessionVisible';
export type UserVisible = {
    id: string;
    fullName: string;
    username: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: (string | null);
    role: ChoiceBase_RoleTypeChoices_;
    carPark?: (ChoiceBase_CarParkChoices_ | null);
    sessions?: Array<UserSessionVisible>;
};

