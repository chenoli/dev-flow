import checkFile from "eslint-plugin-check-file";

/**
 * Enforces kebab-case filenames project-wide. Only checks the filename
 * itself (not folders), since Next.js route conventions
 * (`[id]`, `(auth)`, `_components`) aren't kebab-case by nature.
 */
export const kebabCaseFilenames = {
  plugins: { "check-file": checkFile },
  rules: {
    "check-file/filename-naming-convention": [
      "error",
      { "**/*.{ts,tsx,js,jsx}": "KEBAB_CASE" },
      { ignoreMiddleExtensions: true },
    ],
  },
};

export default kebabCaseFilenames;
