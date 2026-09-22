import next from "eslint-config-next";
import tseslint from "typescript-eslint";

const eslintConfig = [
  {
    // Phase 2B waiver: Chat is frozen pending the delete-or-rebuild decision.
    // These two files carry the only chat lint errors; the rest of the chat
    // vertical (conversation-list, validations/chat) still lints normally.
    ignores: ["src/components/chat/chat-widget.tsx", "src/lib/socket.ts"],
  },
  ...next,
  // eslint-config-next 16 no longer enables the TypeScript rules itself;
  // keep the project's previous lint surface via typescript-eslint recommended.
  ...tseslint.configs.recommended,
  {
    rules: {
      // eslint-plugin-react-hooks v7 enables the React Compiler rules in its
      // recommended preset (v5, the previous baseline, did not). Downgrade the
      // new rule families to warnings until the ~19 findings are adopted in a
      // dedicated task; no inline suppressions were added for them.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/use-memo": "warn",
      "react-hooks/incompatible-library": "warn",
    },
  },
];

export default eslintConfig;
