import perfectionist from "eslint-plugin-perfectionist";

// Import order convention (see the dev-flow block in CLAUDE.md):
// 0. directives/side-effects (untouched — not import declarations)
// 1. external packages — React first, then alphabetical
// 2. app imports — one group per context (@scope/*, ../_lib, ../_stores, ...),
//    contexts sorted alphabetically
// 3. type imports — alphabetical, always last
export const importOrderConfig = {
  plugins: { perfectionist },
  rules: {
    "perfectionist/sort-imports": [
      "error",
      {
        type: "alphabetical",
        order: "asc",
        ignoreCase: true,
        newlinesBetween: 1,
        groups: [
          "side-effect-style",
          "side-effect",
          "react",
          ["default-external", "default-builtin"],
          ["named-external", "named-builtin"],
          "components",
          "config",
          "db",
          "hooks",
          "lib",
          "models",
          "providers",
          "shared",
          "stores",
          "ui",
          ["default-parent", "default-sibling", "default-index"],
          ["named-parent", "named-sibling", "named-index"],
          ["type-external", "type-internal", "type-builtin", "type-parent", "type-sibling", "type-index"],
        ],
        // `modifiers: ["value"]` keeps type-only specifiers out of these
        // context groups so they fall through to the type-* groups instead.
        customGroups: [
          { groupName: "react", elementNamePattern: "^react(-dom)?$", modifiers: ["value"] },
          { groupName: "shared", elementNamePattern: "^@scope/shared", modifiers: ["value"] },
          { groupName: "ui", elementNamePattern: "^@scope/ui", modifiers: ["value"] },
          { groupName: "db", elementNamePattern: "^@scope/db", modifiers: ["value"] },
          { groupName: "config", elementNamePattern: "^@scope/config", modifiers: ["value"] },
          { groupName: "providers", elementNamePattern: "/_providers/", modifiers: ["value"] },
          { groupName: "stores", elementNamePattern: "/_stores/", modifiers: ["value"] },
          { groupName: "lib", elementNamePattern: "/_lib/", modifiers: ["value"] },
          { groupName: "hooks", elementNamePattern: "/_hooks/", modifiers: ["value"] },
          { groupName: "models", elementNamePattern: "/_models/", modifiers: ["value"] },
          { groupName: "components", elementNamePattern: "/_components/", modifiers: ["value"] },
        ],
      },
    ],
  },
};

export default importOrderConfig;
