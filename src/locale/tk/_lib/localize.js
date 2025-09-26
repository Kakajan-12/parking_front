import { buildLocalizeFn } from "../../_lib/buildLocalizeFn.js";

const eraValues = {
    narrow: ["b.e.ö.", "b.e."],
    abbreviated: ["b.e.ö.", "b.e."],
    wide: ["bizden öň", "biziň döwrümiz"],
};

const quarterValues = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["1-nji çärýek", "2-nji çärýek", "3-nji çärýek", "4-nji çärýek"],
    wide: ["1-nji çärýek", "2-nji çärýek", "3-nji çärýek", "4-nji çärýek"],
};

const monthValues = {
    narrow: ["Ý", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"],
    abbreviated: [
        "ýan.",
        "few.",
        "mart",
        "apr.",
        "maý",
        "iýun",
        "iýul",
        "awg.",
        "sen.",
        "okt.",
        "noý.",
        "dek.",
    ],
    wide: [
        "ýanwar",
        "fewral",
        "mart",
        "aprel",
        "maý",
        "iýun",
        "iýul",
        "awgust",
        "sentýabr",
        "oktýabr",
        "noýabr",
        "dekabr",
    ],
};

const formattingMonthValues = {
    narrow: ["Ý", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"],
    abbreviated: [
        "ýan.",
        "few.",
        "mart",
        "apr.",
        "maý",
        "iýun",
        "iýul",
        "awg.",
        "sen.",
        "okt.",
        "noý.",
        "dek.",
    ],
    wide: [
        "ýanwaryň",
        "fewralyň",
        "martyň",
        "aprelňiň",
        "maýyň",
        "iýunyň",
        "iýulyň",
        "awgustyň",
        "sentýabryň",
        "oktýabryň",
        "noýabryň",
        "dekabryň",
    ],
};

const dayValues = {
    narrow: ["Ý", "D", "S", "Ç", "P", "A", "Ş"],
    short: ["ýş", "du", "si", "ça", "pe", "an", "şb"],
    abbreviated: ["ýek", "duş", "siş", "çar", "pen", "ann", "şen"],
    wide: ["ýekşenbe", "duşenbe", "sişenbe", "çarşenbe", "penşenbe", "anna", "şenbe"],
};

const dayPeriodValues = {
    narrow: {
        am: "ÖÖ",
        pm: "ÝÖ",
        midnight: "gijesi",
        noon: "türkegi",
        morning: "ertir",
        afternoon: "günortadan soň",
        evening: "agşam",
        night: "gije",
    },
    abbreviated: {
        am: "ÖÖ",
        pm: "ÝÖ",
        midnight: "gijesi",
        noon: "türkegi",
        morning: "ertir",
        afternoon: "günortadan soň",
        evening: "agşam",
        night: "gije",
    },
    wide: {
        am: "öňünden",
        pm: "ýakyn",
        midnight: "gijesi",
        noon: "türkegi",
        morning: "ertir",
        afternoon: "günortadan soň",
        evening: "agşam",
        night: "gije",
    },
};

const formattingDayPeriodValues = {
    narrow: {
        am: "ÖÖ",
        pm: "ÝÖ",
        midnight: "gijesi",
        noon: "türkegi",
        morning: "ertir",
        afternoon: "günortadan soň",
        evening: "agşam",
        night: "gije",
    },
    abbreviated: {
        am: "ÖÖ",
        pm: "ÝÖ",
        midnight: "gijesi",
        noon: "türkegi",
        morning: "ertir",
        afternoon: "günortadan soň",
        evening: "agşam",
        night: "gije",
    },
    wide: {
        am: "öňünden",
        pm: "ýakyn",
        midnight: "gijesi",
        noon: "türkegi",
        morning: "ertir",
        afternoon: "günortadan soň",
        evening: "agşam",
        night: "gije",
    },
};

const ordinalNumber = (dirtyNumber, options) => {
    const number = Number(dirtyNumber);
    // Turkmen does not generally use ordinal suffixes, but if needed:
    // For date, use suffix '-nji'; for others, just return the number.
    const unit = options?.unit;

    if (unit === "date") {
        return number + "-nji";
    }

    return String(number);
};

export const localize = {
    ordinalNumber,

    era: buildLocalizeFn({
        values: eraValues,
        defaultWidth: "wide",
    }),

    quarter: buildLocalizeFn({
        values: quarterValues,
        defaultWidth: "wide",
        argumentCallback: quarter => quarter - 1,
    }),

    month: buildLocalizeFn({
        values: monthValues,
        defaultWidth: "wide",
        formattingValues: formattingMonthValues,
        defaultFormattingWidth: "wide",
    }),

    day: buildLocalizeFn({
        values: dayValues,
        defaultWidth: "wide",
    }),

    dayPeriod: buildLocalizeFn({
        values: dayPeriodValues,
        defaultWidth: "wide",
        formattingValues: formattingDayPeriodValues,
        defaultFormattingWidth: "wide",
    }),
};
