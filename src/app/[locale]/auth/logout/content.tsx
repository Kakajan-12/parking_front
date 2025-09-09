"use client";

import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { destroyAuthCookies } from "@/lib/auth/actions";
import { useAuthContext } from "@/lib/auth/provider";
import { AUTH_LOGIN_URL } from "@/lib/constants";

const Content = () => {
    const t = useTranslations();
    const { refreshTokenPayload } = useAuthContext();

    useEffect(() => {
        destroyAuthCookies(false);
        refreshTokenPayload();
    }, []);
    return (
        <div
            className="flex items-center justify-center min-h-screen px-4"
            style={{
                backgroundImage: "url(/background-image.svg)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "bottom",
            }}
        >
            <Card className="w-full max-w-md p-8 rounded-2xl">
                <CardContent className="flex flex-col items-center text-center">
                    <div className="w-full flex justify-center">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={200}
                            height={40}
                            className="mb-6"
                        />
                    </div>

                    <h1 className="text-2xl font-bold ">{t("you-have-been-logged-out")}</h1>

                    <p className="mt-2 text-muted-foreground">
                        {t("we-hope-to-see-you-again-soon")}
                    </p>

                    <Button
                        asChild
                        variant="secondary"
                        className="mt-6 w-full"
                        aria-label={t("logout")}
                    >
                        <Link href={AUTH_LOGIN_URL} className="w-full text-center">
                            {t("go-to-login")}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Content;
