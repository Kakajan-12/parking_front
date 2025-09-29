/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChoiceBase_EventTypeChoices_ } from "./ChoiceBase_EventTypeChoices_";
import type { EventCarSession } from "./EventCarSession";

export type CarSessionEventVisible = {
    id: number;
    imageUrl?: string | null;
    eventType: ChoiceBase_EventTypeChoices_;
    channelName?: string | null;
    cameraToken?: string | null;
    extraData: Record<string, any>;
    createdAt: string;
    updatedAt?: string | null;
    carSession?: EventCarSession | null;
};
