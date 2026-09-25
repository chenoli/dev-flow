/**
 * Strict rule set shared by every package that ships React code
 * (apps/web via eslint-config-next, packages/ui standalone).
 * react-hooks rules are errors, not warnings — exhaustive-deps bugs are a
 * recurring source of stale-closure incidents, so they must fail the build.
 */
export const reactStrictRules = {
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "error",

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
  "@typescript-eslint/no-non-null-assertion": "warn",
};

export default reactStrictRules;
