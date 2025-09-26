import { getTranslations } from "next-intl/server";

import { checkAuthCookies } from "@/lib/auth/actions";
import { AuthError } from "@/lib/auth/exceptions";
import { ApiError } from "@/openapi/client";
import getServerInstance from "@/openapi/server-instance";

export async function GET() {
    const t = await getTranslations();

    const [token, isAuth] = await checkAuthCookies();
    if (!isAuth) {
        throw new AuthError(t("auth.must-sign-in"));
    }

    const fetchClient = await getServerInstance({
        cache: "no-cache",
        token: token,
    });
    try {
        const response = await fetchClient.account.me();
        return Response.json({ data: response, status: 200 });
    } catch (e) {
        if (e instanceof ApiError) {
            return Response.json({ data: e.body, status: e.status });
        }
        return Response.json({ data: null, status: 500 });
    }
}
