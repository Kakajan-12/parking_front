import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  "baseDirectory": import.meta.dirname,
});

const eslintConfig = [
  {
    "ignores": [
      ".next/**",
      "public/**",
      "next.config.js",
      "postcss.config.js",
      "node_modules/**",
      "src/locale/**",
      "src/openapi/**",
    ],
  },
  ...compat.config({
    "extends": ["next/core-web-vitals", "next/typescript", "prettier"],
    "rules": {
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-ignore": "allow-with-description" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
        },
      ],
      "semi": ["error", "always"],

      "no-undef": "off",
      "no-console": "warn",

      "react/react-in-jsx-scope": "off",
      // "tailwindcss/no-custom-classname": "warn",
      "unicorn/prevent-abbreviations": "off",
      "import/order": [
        "error",
        {
          "groups": [["builtin", "external"], ["internal"], ["parent", "sibling", "index"]],
          "pathGroups": [
            { "pattern": "react", "group": "external", "position": "before" },
            { "pattern": "next", "group": "external", "position": "before" },
            { "pattern": "next/**", "group": "external", "position": "before" },
          ],
          "pathGroupsExcludedImportTypes": ["builtin"], // only exclude builtin
          "newlines-between": "always",
          "alphabetize": { "order": "asc", "caseInsensitive": false },
          // "importOrderBuiltinModulesToTop": true,
          // "importOrderParserPlugins": ["typescript", "jsx"],
          // "importOrderMergeDuplicateImports": true,
          // "importOrderIgnorePatterns": ["\\.css$"],
        },
      ],
      "quotes": ["error", "double"],
      // "@typescript-eslint/quotes": ["error", "double"]
    },
  }),
];

export default eslintConfig;
