import tseslint from "typescript-eslint";

import { importOrderConfig } from "./import-order.mjs";
import { kebabCaseFilenames } from "./kebab-case.mjs";
import { splitTypeImportsConfig } from "./split-type-imports.mjs";

/**
 * Shared ESLint base for plain TypeScript packages (e.g. packages/db, packages/shared).
 * apps/web and packages/ui use the React-aware configs instead; a NestJS api may keep oxlint.
 */
export const baseConfig = tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "*.config.*"],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-console": "error",
      "no-var": "error",
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
    },
  },
  kebabCaseFilenames,
  splitTypeImportsConfig,
  importOrderConfig,
);

export default baseConfig;
