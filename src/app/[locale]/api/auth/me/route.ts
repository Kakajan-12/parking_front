import { cookies } from "next/headers";

import { checkAuthCookies } from "@/lib/auth/actions";
import { AUTH_TOKEN_COOKIE } from "@/lib/constants";
import { ApiError } from "@/openapi/client";
import getServerInstance from "@/openapi/server-instance";

export async function GET() {
    const isAuth = await checkAuthCookies();
    if (!isAuth) {
        return Response.json({ data: null, status: 401 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE);

    const fetchClient = await getServerInstance({
        cache: "no-cache",
        token: token?.value,
    });
    try {
        const response = await fetchClient.auth.getApiV1AuthMe();
        return Response.json({ data: response, status: 200 });
    } catch (e) {
        if (e instanceof ApiError) {
            return Response.json({ data: e.body, status: e.status });
        }
        return Response.json({ data: null, status: 500 });
    }
}
