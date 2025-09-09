"use client";

import React, { useState } from "react";
import type { ReactNode } from "react";

import { useServerInsertedHTML } from "next/navigation";

import { ToastContainer } from "react-toastify";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

import AuthProvider from "./auth/provider";

type Props = {
    children: ReactNode;
};

const AppProviders = (props: Props) => {
    const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());
    useServerInsertedHTML(() => {
        const styles = styledComponentsStyleSheet.getStyleElement();
        styledComponentsStyleSheet.instance.clearTag();
        return <>{styles}</>;
    });

    if (typeof window !== "undefined") {
        return (
            <AuthProvider>
                <ToastContainer
                    position="top-right"
                    pauseOnHover
                    theme={"light"}
                    hideProgressBar={false}
                    toastStyle={{ zIndex: 60 }}
                />
                {props.children}
            </AuthProvider>
        );
    }

    return (
        <AuthProvider>
            <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
                <ToastContainer
                    position="top-right"
                    pauseOnHover
                    theme={"light"}
                    hideProgressBar={false}
                    toastStyle={{ zIndex: 60 }}
                />
                {props.children}
            </StyleSheetManager>
        </AuthProvider>
    );
};

export default AppProviders;
