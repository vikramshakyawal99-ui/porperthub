import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([

  {
    ignores: [
      "node_modules/**",
      ".next/**",

      // backup folders
      "backup_old/**",
      "create-og.js",
      "make-admin.js",
      "test-firestore.js",
      "backup/**",

      // backup files
      "**/*.backup.*",
      "**/*.backup.ts",
      "**/*.backup.tsx",
      "**/*-backup.ts",
      "**/*-backup.tsx",

      // temporary files
      "**/*.old.*",
      "**/*.tmp.*",
      "**/*.step1.*",
      "**/*.before-*.*",

  // local/debug scripts
  "check-all-roles.js",
  "check-owner-claim.js",
  "check-user-role.js",
  "check-user.js",
  "list-users.js",
  "make-owner.js",
  "remove-owner-admin-claim.js",
    ],
  },

  ...nextVitals,
  ...nextTs,

  {
    rules: {

      // allow practical TS usage
      "@typescript-eslint/no-explicit-any": "off",

      // React rules
      "react-hooks/set-state-in-effect": "off",
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

      // image optimization later
      "@next/next/no-img-element": "warn",

    },
  },

]);
