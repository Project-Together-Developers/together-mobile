# CLAUDE.md

## Rules (Strict)

Follow all rules. Ask questions until 95% confident before coding.

## Naming

- kebab-case for files/folders

## Types

- No `any`
- Use strict TS: types, interfaces, generics

## Structure

- Modular, reusable
- Shared logic → utils/types/enums/interfaces/mocks
- No duplication

## React

- One component per .tsx

## Comments

- No comments

## Errors

- Use enums only (no hardcoded messages)
- FE/BE enums must stay in sync

## i18n

- No hardcoded UI text
- Always update translations

## Enforcement

- If rule conflict → stop, explain, suggest compliant option
