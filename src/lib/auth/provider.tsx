"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { parseCookies } from "nookies";
import { useDebouncedCallback } from "use-debounce";

import { navigateToLogout } from "@/lib/auth/actions";
import { AUTH_TOKEN_COOKIE } from "@/lib/constants";
import { UserSessionExtendedVisible } from "@/openapi/client";

import { TokenPayload, retrievePayload } from "./utils";

export type AuthContextType = {
    payload: TokenPayload | null;
    refreshTokenPayload: () => void;
    userSession: UserSessionExtendedVisible | null;
    setUserSession: (value: UserSessionExtendedVisible | null) => void;
    token: string | null;
    isLoading: boolean;
};

const API_ME_URL = "/api/auth/me";

export const AuthContext = React.createContext<AuthContextType>({
    payload: null,
    refreshTokenPayload: () => undefined,
    userSession: null,
    setUserSession: () => undefined,
    token: null,
    isLoading: false,
});

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<{
        payload: TokenPayload | null;
        userSession: UserSessionExtendedVisible | null;
        isLoading: boolean;
    }>({
        payload: null,
        userSession: null,
        isLoading: true,
    });

    const cookies = parseCookies();
    const token = cookies[AUTH_TOKEN_COOKIE];

    const refreshTokenPayload = useCallback(() => {
        if (!token) {
            setAuthState(prev => ({ ...prev, payload: null, user: null }));
            return;
        }

        const tokenPayload = retrievePayload(token);
        setAuthState(prev => ({ ...prev, payload: tokenPayload }));
    }, [token]);

    const fetchUserData = useCallback(async () => {
        const { [AUTH_TOKEN_COOKIE]: currentToken } = parseCookies();
        if (!currentToken) return;

        setAuthState(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await fetch(API_ME_URL, {
                headers: {
                    Authorization: currentToken,
                },
                cache: "no-store",
            });

            const data = await response.json();

            if (data.status === 200) {
                setAuthState(prev => ({ ...prev, userSession: data.data }));
            } else if (data.status === 401) {
                await navigateToLogout();
            }
        } catch (error) {
            console.error("Fetch user failed:", error);
            setAuthState(prev => ({ ...prev, user: null }));
        } finally {
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const debouncedFetchUser = useDebouncedCallback(fetchUserData, 500);

    // Initialize auth state
    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            refreshTokenPayload();
            await debouncedFetchUser();
            if (!mounted) return;
        };

        initialize();

        return () => {
            mounted = false;
        };
    }, [refreshTokenPayload]);

    // Check token expiration
    useEffect(() => {
        if (!authState.payload?.exp) return;

        const expiresInMs = authState.payload.exp * 1000 - Date.now();
        if (expiresInMs <= 0) {
            navigateToLogout();
            return;
        }

        const timeoutId = setTimeout(() => {
            navigateToLogout();
        }, expiresInMs);

        return () => clearTimeout(timeoutId);
    }, [authState.payload]);

    // Periodic refresh
    useEffect(() => {
        const interval = setInterval(
            () => {
                debouncedFetchUser();
            },
            5 * 60 * 1000,
        );
        return () => clearInterval(interval);
    }, [debouncedFetchUser]); // stable reference avoids resets

    const contextValue = useMemo(
        () => ({
            payload: authState.payload,
            refreshTokenPayload,
            userSession: authState.userSession,
            setUserSession: (value: UserSessionExtendedVisible | null) =>
                setAuthState(prev => ({ ...prev, userSession: value })),
            token,
            isLoading: authState.isLoading,
        }),
        [authState, token, refreshTokenPayload],
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

export const useAuthContext = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
};
