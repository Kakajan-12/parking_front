"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import jwtDecode from "jwt-decode";
import { parseCookies } from "nookies";
import { useDebouncedCallback } from "use-debounce";

import { navigateToLogout } from "@/lib/auth/actions";
import { AUTH_TOKEN_COOKIE } from "@/lib/constants";

interface TokenPayload {
    exp: number;
    macpassword?: string;
    macusername?: string;
    parkno?: string;
    role: string;
    user_id: string;
    username: string;
}

interface UserInfo {
    keys: Array<string>;
    macpassword?: string;
    macusername?: string;
    parkno?: string;
    role: string;
    user_id: string;
    username: string;
}

export type AuthContextType = {
    payload: TokenPayload | null;
    refreshTokenPayload: () => void;
    user: UserInfo | null;
    setUserData: (value: UserInfo | null) => void;
    token: string | null;
    isLoading: boolean;
};

const API_ME_URL = "/api/auth/me";

export const AuthContext = React.createContext<AuthContextType>({
    payload: null,
    refreshTokenPayload: () => undefined,
    user: null,
    setUserData: () => undefined,
    token: null,
    isLoading: false,
});

const retrievePayload = (token: string): TokenPayload | null => {
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

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<{
        payload: TokenPayload | null;
        user: UserInfo | null;
        isLoading: boolean;
    }>({
        payload: null,
        user: null,
        isLoading: true,
    });

    const cookies = parseCookies();
    const token = cookies[AUTH_TOKEN_COOKIE];

    const refreshTokenPayload = useCallback(() => {
        const cookies = parseCookies();
        const currentToken = cookies[AUTH_TOKEN_COOKIE];

        if (!currentToken) {
            setAuthState(prev => ({ ...prev, payload: null, user: null }));
            return;
        }

        const tokenPayload = retrievePayload(currentToken);
        setAuthState(prev => ({ ...prev, payload: tokenPayload }));
    }, []);

    const fetchUserData = useCallback(async () => {
        const { [AUTH_TOKEN_COOKIE]: currentToken } = parseCookies();
        if (!currentToken) return;

        setAuthState(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await fetch(API_ME_URL, {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
                cache: "no-store",
            });

            const data = await response.json();

            if (data.status === 200) {
                setAuthState(prev => ({ ...prev, user: data.data }));
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
            // await debouncedFetchUser();
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
            user: authState.user,
            setUserData: (user: UserInfo | null) => setAuthState(prev => ({ ...prev, user })),
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
