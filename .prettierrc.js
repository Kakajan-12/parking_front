// prettier.config.js
module.exports = {
    semi: true,
    singleQuote: false,
    trailingComma: "all",
    arrowParens: "avoid",
    printWidth: 100,
    tabWidth: 4,

    plugins: ["@trivago/prettier-plugin-sort-imports"],

    importOrder: [
        "^react$",
        "^next$",
        "^next(/.*|$)",
        "<THIRD_PARTY_MODULES>",
        "^@/(?!.*\\.css$).*",   // Aliases, excluding CSS
        "^[./](?!.*\\.css$).*", // Relatives, excluding CSS
        "\\.css$",              // 🔑 All CSS imports last
    ],

    importOrderSeparation: true,
    importOrderBuiltinModulesToTop: true,
    importOrderParserPlugins: ["typescript", "jsx"],
    importOrderMergeDuplicateImports: true,

    // 🔑 this ensures ALL `.css` files are ignored by the sort plugin
    importOrderIgnorePatterns: ["\\.css$"],
};
