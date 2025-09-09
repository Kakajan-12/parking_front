/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type modelsuser_UserRes = {
    firstname?: string;
    id?: number;
    isActive?: boolean;
    lastname?: string;
    park_no?: string;
    role?: modelsuser_UserRes.role;
    username?: string;
};
export namespace modelsuser_UserRes {
    export enum role {
        ADMIN = 'admin',
        OPERATOR = 'operator',
        ACCOUNTANT = 'accountant',
    }
}

