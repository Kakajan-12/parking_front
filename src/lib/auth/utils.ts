import jwtDecode from "jwt-decode";

import { CarParkChoices, RoleTypeChoices } from "@/openapi/client";

export interface TokenPayload {
    exp: number;
    role: RoleTypeChoices;
    car_park?: CarParkChoices | null;
    user_id: string;
    username: string;
}

export const retrievePayload = (token: string): TokenPayload | null => {
    if (!token) return null;

    const parts = token.split(" ");
    const actualToken = parts.length === 2 ? parts[1] : parts[0];
    try {
        return jwtDecode<TokenPayload>(actualToken);
    } catch (error) {
        console.error("JWT decode failed:", error);
        return null;
    }
};
