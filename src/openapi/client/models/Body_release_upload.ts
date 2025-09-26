/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_release_upload = {
    upload_file: Blob;
    version: string;
    release_os: Body_release_upload.release_os;
};
export namespace Body_release_upload {
    export enum release_os {
        ANDROID = 'android',
        IOS = 'ios',
    }
}

