function declension(scheme, count) {
    if (scheme.one !== undefined && count === 1) {
        return scheme.one;
    }

    const rem10 = count % 10;
    const rem100 = count % 100;

    if (rem10 === 1 && rem100 !== 11) {
        return scheme.singularNominative.replace("{{count}}", String(count));
    } else if (rem10 >= 2 && rem10 <= 4 && (rem100 < 10 || rem100 > 20)) {
        return scheme.singularGenitive.replace("{{count}}", String(count));
    } else {
        return scheme.pluralGenitive.replace("{{count}}", String(count));
    }
}

function buildLocalizeTokenFn(scheme) {
    return (count, options) => {
        if (options?.addSuffix) {
            if (options.comparison && options.comparison > 0) {
                if (scheme.future) {
                    return declension(scheme.future, count);
                } else {
                    return "şu wagtlaýyn " + declension(scheme.regular, count);
                }
            } else {
                if (scheme.past) {
                    return declension(scheme.past, count);
                } else {
                    return declension(scheme.regular, count) + " ozal";
                }
            }
        } else {
            return declension(scheme.regular, count);
        }
    };
}

const formatDistanceLocale = {
    lessThanXSeconds: buildLocalizeTokenFn({
        regular: {
            one: "bir sekuntdan az",
            singularNominative: "{{count}} sekuntdan az",
            singularGenitive: "{{count}} sekuntdan az",
            pluralGenitive: "{{count}} sekuntdan az",
        },
        future: {
            one: "bir sekuntdan az wagt soň",
            singularNominative: "{{count}} sekuntdan az wagt soň",
            singularGenitive: "{{count}} sekuntdan az wagt soň",
            pluralGenitive: "{{count}} sekuntdan az wagt soň",
        },
    }),

    xSeconds: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} sekunt",
            singularGenitive: "{{count}} sekunt",
            pluralGenitive: "{{count}} sekunt",
        },
        past: {
            singularNominative: "{{count}} sekunt ozal",
            singularGenitive: "{{count}} sekunt ozal",
            pluralGenitive: "{{count}} sekunt ozal",
        },
        future: {
            singularNominative: "{{count}} sekuntdan soň",
            singularGenitive: "{{count}} sekuntdan soň",
            pluralGenitive: "{{count}} sekuntdan soň",
        },
    }),

    halfAMinute: (_count, options) => {
        if (options?.addSuffix) {
            if (options.comparison && options.comparison > 0) {
                return "ýarym minutdan soň";
            } else {
                return "ýarym minut ozal";
            }
        }

        return "ýarym minut";
    },

    lessThanXMinutes: buildLocalizeTokenFn({
        regular: {
            one: "bir minutdan az",
            singularNominative: "{{count}} minutdan az",
            singularGenitive: "{{count}} minutdan az",
            pluralGenitive: "{{count}} minutdan az",
        },
        future: {
            one: "bir minutdan az wagt soň",
            singularNominative: "{{count}} minutdan az wagt soň",
            singularGenitive: "{{count}} minutdan az wagt soň",
            pluralGenitive: "{{count}} minutdan az wagt soň",
        },
    }),

    xMinutes: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} minut",
            singularGenitive: "{{count}} minut",
            pluralGenitive: "{{count}} minut",
        },
        past: {
            singularNominative: "{{count}} minut ozal",
            singularGenitive: "{{count}} minut ozal",
            pluralGenitive: "{{count}} minut ozal",
        },
        future: {
            singularNominative: "{{count}} minutdan soň",
            singularGenitive: "{{count}} minutdan soň",
            pluralGenitive: "{{count}} minutdan soň",
        },
    }),

    aboutXHours: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} sagat çemesi",
            singularGenitive: "{{count}} sagat çemesi",
            pluralGenitive: "{{count}} sagat çemesi",
        },
        future: {
            singularNominative: "{{count}} sagat çemesi soň",
            singularGenitive: "{{count}} sagat çemesi soň",
            pluralGenitive: "{{count}} sagat çemesi soň",
        },
    }),

    xHours: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} sagat",
            singularGenitive: "{{count}} sagat",
            pluralGenitive: "{{count}} sagat",
        },
    }),

    xDays: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} gün",
            singularGenitive: "{{count}} gün",
            pluralGenitive: "{{count}} gün",
        },
    }),

    aboutXWeeks: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} hepde çemesi",
            singularGenitive: "{{count}} hepde çemesi",
            pluralGenitive: "{{count}} hepde çemesi",
        },
        future: {
            singularNominative: "{{count}} hepde çemesi soň",
            singularGenitive: "{{count}} hepde çemesi soň",
            pluralGenitive: "{{count}} hepde çemesi soň",
        },
    }),

    xWeeks: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} hepde",
            singularGenitive: "{{count}} hepde",
            pluralGenitive: "{{count}} hepde",
        },
    }),

    aboutXMonths: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} aý çemesi",
            singularGenitive: "{{count}} aý çemesi",
            pluralGenitive: "{{count}} aý çemesi",
        },
        future: {
            singularNominative: "{{count}} aý çemesi soň",
            singularGenitive: "{{count}} aý çemesi soň",
            pluralGenitive: "{{count}} aý çemesi soň",
        },
    }),

    xMonths: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} aý",
            singularGenitive: "{{count}} aý",
            pluralGenitive: "{{count}} aý",
        },
    }),

    aboutXYears: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} ýyl çemesi",
            singularGenitive: "{{count}} ýyl çemesi",
            pluralGenitive: "{{count}} ýyl çemesi",
        },
        future: {
            singularNominative: "{{count}} ýyl çemesi soň",
            singularGenitive: "{{count}} ýyl çemesi soň",
            pluralGenitive: "{{count}} ýyl çemesi soň",
        },
    }),

    xYears: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} ýyl",
            singularGenitive: "{{count}} ýyl",
            pluralGenitive: "{{count}} ýyl",
        },
    }),

    overXYears: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} ýyldan köp",
            singularGenitive: "{{count}} ýyldan köp",
            pluralGenitive: "{{count}} ýyldan köp",
        },
        future: {
            singularNominative: "{{count}} ýyldan hem köp soň",
            singularGenitive: "{{count}} ýyldan hem köp soň",
            pluralGenitive: "{{count}} ýyldan hem köp soň",
        },
    }),

    almostXYears: buildLocalizeTokenFn({
        regular: {
            singularNominative: "{{count}} ýyl töweregi",
            singularGenitive: "{{count}} ýyl töweregi",
            pluralGenitive: "{{count}} ýyl töweregi",
        },
        future: {
            singularNominative: "{{count}} ýyl töweregi soň",
            singularGenitive: "{{count}} ýyl töweregi soň",
            pluralGenitive: "{{count}} ýyl töweregi soň",
        },
    }),
};

export const formatDistance = (token, count, options) => {
    return formatDistanceLocale[token](count, options);
};
