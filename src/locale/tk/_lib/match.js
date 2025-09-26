import { buildMatchFn } from "../../_lib/buildMatchFn.js";
import { buildMatchPatternFn } from "../../_lib/buildMatchPatternFn.js";

const matchOrdinalNumberPattern = /^(\d+)(-?nji)?/i;
const parseOrdinalNumberPattern = /\d+/i;

const matchEraPatterns = {
    narrow: /^(b\.e\.ö\.|b\.e\.)/i,
    abbreviated: /^(b\.e\.ö\.|b\.e\.)/i,
    wide: /^(bizden öň|biziň döwrümiz)/i,
};
const parseEraPatterns = {
    any: [/^b/i, /^b/i],
};

const matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^[1234]-nji çärýek/i,
    wide: /^[1234]-nji çärýek/i,
};

const parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i],
};

const matchMonthPatterns = {
    narrow: /^[yfmaisaoınd]/i, // Ý, F, M, A, I, S, O, N, D letters in Turkmen months
    abbreviated: /^(ýan\.|few\.|mart|apr\.|maý|iýun|iýul|awg\.|sen\.|okt\.|noý\.|dek\.)/i,
    wide: /^(ýanwar|fewral|mart|aprel|maý|iýun|iýul|awgust|sentýabr|oktýabr|noýabr|dekabr)/i,
};

const parseMonthPatterns = {
    narrow: [/^ý/i, /^f/i, /^m/i, /^a/i, /^m/i, /^i/i, /^i/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],

    any: [
        /^ýan/i,
        /^few/i,
        /^mar/i,
        /^apr/i,
        /^maý/i,
        /^iýun/i,
        /^iýul/i,
        /^awg/i,
        /^sen/i,
        /^okt/i,
        /^noý/i,
        /^dek/i,
    ],
};

const matchDayPatterns = {
    narrow: /^[ýdscpạş]/i,
    short: /^(ýş|du|si|ça|pe|an|şb)/i,
    abbreviated: /^(ýek|duş|siş|çar|pen|ann|şen)/i,
    wide: /^(ýekşenbe|duşenbe|sişenbe|çarşenbe|penşenbe|anna|şenbe)/i,
};

const parseDayPatterns = {
    narrow: [/^ý/i, /^d/i, /^s/i, /^ç/i, /^p/i, /^a/i, /^ş/i],
    any: [/^ýek/i, /^duş/i, /^siş/i, /^çar/i, /^pen/i, /^ann/i, /^şen/i],
};

const matchDayPeriodPatterns = {
    narrow: /^(öö|ýö|gijesi|türkegi|ertir|günortadan soň|agşam|gije)/i,
    abbreviated: /^(öö|ýö|gijesi|türkegi|ertir|günortadan soň|agşam|gije)/i,
    wide: /^(öňünden|ýakyn|gijesi|türkegi|ertir|günortadan soň|agşam|gije)/i,
};

const parseDayPeriodPatterns = {
    any: {
        am: /^öö/i,
        pm: /^ýö/i,
        midnight: /^gijesi/i,
        noon: /^türkegi/i,
        morning: /^er/i,
        afternoon: /^günortadan/i,
        evening: /^agşam/i,
        night: /^gije/i,
    },
};

export const match = {
    ordinalNumber: buildMatchPatternFn({
        matchPattern: matchOrdinalNumberPattern,
        parsePattern: parseOrdinalNumberPattern,
        valueCallback: value => parseInt(value, 10),
    }),

    era: buildMatchFn({
        matchPatterns: matchEraPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseEraPatterns,
        defaultParseWidth: "any",
    }),

    quarter: buildMatchFn({
        matchPatterns: matchQuarterPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseQuarterPatterns,
        defaultParseWidth: "any",
        valueCallback: index => index + 1,
    }),

    month: buildMatchFn({
        matchPatterns: matchMonthPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseMonthPatterns,
        defaultParseWidth: "any",
    }),

    day: buildMatchFn({
        matchPatterns: matchDayPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseDayPatterns,
        defaultParseWidth: "any",
    }),

    dayPeriod: buildMatchFn({
        matchPatterns: matchDayPeriodPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseDayPeriodPatterns,
        defaultParseWidth: "any",
    }),
};
