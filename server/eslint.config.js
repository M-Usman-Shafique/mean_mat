import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default defineConfig([
    {
        ignores: ["node_modules/**", "dist/**", "coverage/**"],
    },
    {
        files: ["**/*.ts"],
        ignores: [],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parser: tsparser,
            parserOptions: {
                project: "./tsconfig.eslint.json",
                tsconfigRootDir: import.meta.dirname,
            },
            globals: globals.node,
        },
        plugins: {
            "@typescript-eslint": tseslint,
            prettier: eslintPluginPrettier,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...eslintConfigPrettier.rules,
            "prettier/prettier": "warn",
            // "no-console": "warn",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
    {
        files: ["**/*.test.ts", "**/*.spec.ts"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parser: tsparser,
            parserOptions: {
                project: "./tsconfig.eslint.json",
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            prettier: eslintPluginPrettier,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...eslintConfigPrettier.rules,
            "prettier/prettier": "warn",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
]);
