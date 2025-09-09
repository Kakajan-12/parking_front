import { checkAuthCookies } from "@/lib/auth/actions";
import { ApiError } from "@/openapi/client";
import getServerInstance from "@/openapi/server-instance";

export async function GET() {
    const isAuth = await checkAuthCookies();
    if (!isAuth) {
        return Response.json({ data: null, status: 401 });
    }

    const fetchClient = await getServerInstance({
        next: { revalidate: 1, tags: ["auth-me"] },
        withAuth: true,
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
