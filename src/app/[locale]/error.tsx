"use client";

import { useEffect } from "react";

import Link from "next/link";

import { useTranslations } from "next-intl";
import { TbAlertSquareFilled } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Error({ error, reset }: { error: Error; reset?: () => void }) {
    const t = useTranslations();

    useEffect(() => {
        console.error("Captured error:", error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark p-6">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4 text-destructive dark:text-destructive-dark">
                        <TbAlertSquareFilled className="size-12" />
                    </div>
                    <CardTitle>Something went wrong</CardTitle>
                    <CardDescription>
                        {error.message || "Unexpected error occurred."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-4 flex flex-col gap-3">
                    <Button onClick={reset} className="w-full">
                        {t("try-again")}
                    </Button>
                    <Button asChild variant="secondary" className="w-full">
                        <Link href="/">{t("go-home")}</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
