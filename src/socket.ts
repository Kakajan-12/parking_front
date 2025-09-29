"use client";

import { io } from "socket.io-client";

import { BASE_URL } from "@/lib/constants";

export const getSocketIO = ({ token }: { token?: string | null; namespace?: string }) => {
    const authToken = token?.startsWith("Bearer ") ? token.slice("Bearer ".length) : token;

    // let extraHeaders: Record<string, string> | undefined;
    // //
    // if (token && token.startsWith("Bearer ")) {
    //     extraHeaders = { Authorization: token };
    // } else if (token) {
    //     extraHeaders = { Authorization: `Bearer ${token}` };
    // }

    return io(`${BASE_URL}`, {
        autoConnect: false,
        path: "/socket.io",
        reconnectionDelay: 10000, // defaults to 1000
        reconnectionDelayMax: 10000, // defaults to 5000
        // withCredentials: true,
        auth: {
            token: authToken,
        },
        // extraHeaders,
        // query: {
        //     "token": authToken
        // }
    });
};
