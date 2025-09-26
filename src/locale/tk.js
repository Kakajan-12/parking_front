import { formatDistance } from "./tk/_lib/formatDistance.js";
import { formatLong } from "./tk/_lib/formatLong.js";
import { formatRelative } from "./tk/_lib/formatRelative.js";
import { localize } from "./tk/_lib/localize.js";
import { match } from "./tk/_lib/match.js";

export const tk = {
    code: "tk",
    formatDistance: formatDistance,
    formatLong: formatLong,
    formatRelative: formatRelative,
    localize: localize,
    match: match,
    options: {
        weekStartsOn: 1 /* Monday */,
        firstWeekContainsDate: 1,
    },
};

// Fallback for modularized imports:
export default tk;
