import { hasLocale } from "next-intl";
import { getRequestConfig, setRequestLocale } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
    setRequestLocale(locale);

    return {
        locale,
        messages: (
            await (locale === "tk"
                ? // When using Turbopack, this will enable HMR for `en`
                  import("../../messages/tk.json")
                : import(`../../messages/${locale}.json`))
        ).default,
    };
});
