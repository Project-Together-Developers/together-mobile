# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start --port 8002  
npx expo start --ios --port 8002
npx expo start --android --port 8002
```

No test runner or linter is configured. TypeScript checking:
```bash
npx tsc --noEmit
```

## Docs (read only when needed)
For API conventions, read `docs/api.md`
For state management guidelines, read `docs/state-management.md`
For routing and auth guard, read `docs/routing-and-auth.md`
For i18n guidelines, read `docs/i18n.md`
For project rules, read `docs/project-rules.md`
