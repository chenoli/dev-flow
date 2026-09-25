import { splitInlineTypeImports } from "./rules/split-inline-type-imports.mjs";

export const splitTypeImportsConfig = {
  plugins: { local: { rules: { "split-inline-type-imports": splitInlineTypeImports } } },
  rules: { "local/split-inline-type-imports": "error" },
};

export default splitTypeImportsConfig;
