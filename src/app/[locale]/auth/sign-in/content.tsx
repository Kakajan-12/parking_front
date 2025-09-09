import Image from "next/image";
import Link from "next/link";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Content() {
    const t = useTranslations();
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

                    <h1 className="text-2xl font-bold ">You are already signed in</h1>

                    <p className="mt-2 text-muted-foreground">{t("sign-out-first")}</p>

                    <Button
                        asChild
                        variant="secondary"
                        className="mt-6 w-full"
                        aria-label={t("logout")}
                    >
                        <Link href="/auth/logout" className="w-full text-center">
                            {t("logout")}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
