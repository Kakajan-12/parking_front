import { BASE_URL } from "@/lib/constants";
import { FetchClient } from "@/openapi/client";

function getClientInstance({
    next,
    token,
}: { next?: NextFetchRequestConfig | undefined; token?: string | null } = {}): FetchClient {
    const config: {
        BASE: string | undefined;
        TOKEN?: string;
        NEXT?: NextFetchRequestConfig;
    } = {
        BASE: BASE_URL,
        NEXT: next,
    };
    if (token) config["TOKEN"] = token;
    return new FetchClient(config);
}

export default getClientInstance;
