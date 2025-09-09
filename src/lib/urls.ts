import { WEBAPP_URL } from "@/lib/constants";

// It ensures that redirection URL safe where it is accepted through a query params or other means where user can change it.
export const getSafeRedirectUrl = (url = "", searchParams: URLSearchParams) => {
    if (!url) {
        return null;
    }

    //It is important that this fn is given absolute URL because urls that don't start with HTTP can still deceive browser into redirecting to another domain
    if (url.search(/^https?:\/\//) === -1) {
        throw new Error("Pass an absolute URL");
    }

    const urlParsed = new URL(url);
    urlParsed.search = searchParams.toString();

    // Avoid open redirection security vulnerability
    if (![WEBAPP_URL].some(u => new URL(u).origin === urlParsed.origin)) {
        url = `${WEBAPP_URL}/`;
    }

    return url;
};

export const getAbsoluteUrl = ({
    href,
    host,
    searchParams,
}: {
    href: string;
    searchParams?: URLSearchParams;
    host?: string;
}) => {
    // Check for any scheme (anything before :// or just :)
    const hasScheme = /^[a-zA-Z]+:(\/\/)?/.test(href);

    if (hasScheme) {
        // If URL already has a scheme (http, https, mailto, tel, command, etc.)
        const urlParsed = new URL(href);
        if (searchParams) {
            // Only append search params if the URL supports them
            if (!["mailto:", "tel:", "command:"].some(scheme => href.startsWith(scheme))) {
                urlParsed.search = searchParams.toString();
            }
        }
        return urlParsed.toString();
    }

    // If no scheme, use the provided host or WEBAPP_URL as base
    const baseUrl = host || WEBAPP_URL;

    // Create URL object with the base URL
    const urlParsed = new URL(href, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);

    if (searchParams) {
        urlParsed.search = searchParams.toString();
    }

    return urlParsed.toString();
};
