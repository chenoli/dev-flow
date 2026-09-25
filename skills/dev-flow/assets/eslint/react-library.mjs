import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

import { importOrderConfig } from "./import-order.mjs";
import { kebabCaseFilenames } from "./kebab-case.mjs";
import { reactStrictRules } from "./react-rules.mjs";
import { splitTypeImportsConfig } from "./split-type-imports.mjs";

/**
 * Standalone strict config for React packages that don't use Next.js
 * (e.g. packages/ui), so they don't inherit eslint-config-next's setup.
 */
export const reactLibraryConfig = tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "coverage/**"] },
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  {
    settings: { react: { version: "detect" } },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactStrictRules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  kebabCaseFilenames,
  splitTypeImportsConfig,
  importOrderConfig,
);

export default reactLibraryConfig;
