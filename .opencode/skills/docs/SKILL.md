---
name: docs
description: |
  Use when the user asks to write, update, generate, or review documentation for the Psyke project.
  Use for README, JSDoc comments, inline code docs, API docs, component documentation, or setup guides.
  Do NOT use for debugging, implementing features, or code review.
---

# Documentation Skill — Psyke

Guidelines for writing and maintaining documentation in the Psyke project.

## Reading the codebase first

Before writing any documentation, you MUST read the relevant source files to understand the actual implementation. Never write docs based on assumptions.

## What to document

| Artifact | Location | Format |
|---|---|---|
| Project overview | `README.md` | Markdown |
| Component API | JSDoc above component | `/** ... */` |
| Hook behavior | JSDoc above hook | `/** ... */` |
| API service methods | JSDoc above each function | `/** ... */` |
| Types/interfaces | JSDoc or inline comments | `/** ... */` |
| Store (Zustand) | Brief comment per action | Line comment |
| Complex logic | Inline comments | Line comment |

## JSDoc style (TypeScript)

```typescript
/**
 * Breve descrição do que a função/componente faz.
 *
 * @param nomeDoParametro - Descrição do parâmetro
 * @returns Descrição do retorno
 */
```

For components, document props via the interface (no need to repeat in JSDoc).

## README updates

When updating `README.md`:
- Keep the stack table up to date
- Document environment variables in `.env.example`
- Update setup instructions if dependencies change
- Add migration notes for breaking changes

## What NOT to document

- Obvious code (self-documenting naming)
- Internal implementation details that may change
- Boilerplate that follows established patterns

## Verification

After writing docs, verify nothing is broken:

```bash
npx tsc --noEmit
npm run lint
```
