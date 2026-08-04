import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";


export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    ignores: [
      "node_modules/**",
      ".next/**",

      // backup files
      "**/*.backup.*",
      "**/*.backup.ts",
      "**/*.backup.tsx",
      "**/*-backup.ts",
      "**/*-backup.tsx",
      "backup*",

      // old temporary files
      "**/*.old.*",
      "**/*.tmp.*",
    ],

    rules: {

      // TypeScript practical rules
      "@typescript-eslint/no-explicit-any": "off",

      // React 19 strict effect rule
      "react-hooks/set-state-in-effect": "off",

      // JSX apostrophe rule
      "react/no-unescaped-entities": "off",

      // warnings only
      "prefer-const": "warn",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],

      // Image optimization later
      "@next/next/no-img-element": "warn",

    },
  },
]);
