---
name: code-quality
description: |
  Use when the user asks to check, fix, or enforce code quality — type errors, lint errors, syntax issues, code style, or conventions.
  Use when asked to run type checking, linting, fix TypeScript errors, fix ESLint errors, or review code style.
  Use for "run tsc", "run lint", "check types", "fix lint", "clean up code".
  Do NOT use for debugging runtime behavior, implementing features, or writing docs.
---

# Code Quality Skill — Psyke

Procedures for ensuring code quality: type safety, linting, and conventions.

## 1. Run checks

Always run both commands:

```bash
npx tsc --noEmit    # TypeScript strict checks
npm run lint        # ESLint (recommended + react-refresh + hooks)
```

## 2. Common tsc errors in this project

| Error | Cause | Fix |
|---|---|---|
| `TS5101: baseUrl deprecated` | Deprecated in TS 6+ | Remove `baseUrl`, use `"./src/*"` in paths |
| `TS5090: Non-relative paths` | Missing `./` prefix | Add `./` to path patterns |
| `TS6133: declared but never used` | Unused variable/import | Remove it or prefix with `_` |
| `TS error importing type` | Missing `import type` | Add `type` keyword with `verbatimModuleSyntax` |

## 3. Common ESLint errors

| Rule | Cause | Fix |
|---|---|---|
| `react-refresh/only-export-components` | File exports mix of components and non-components | Add eslint-disable comment at file top |
| `@typescript-eslint/no-unused-vars` | Imported but never used | Remove the import |
| `react-hooks/exhaustive-deps` | Missing hook dependency | Add to dependency array |

## 4. Project-specific conventions to enforce

- `import type` for type-only imports (required by `verbatimModuleSyntax`)
- No `any` — use `unknown` and narrow with type guards
- Interfaces for object shapes, types for unions/primitives
- PascalCase for components and files
- camelCase for functions, variables, hooks
- Named exports over default exports
- No inline styles — use Tailwind with CSS variable tokens
- Lazy load pages — no direct imports in Router.tsx
- No circular dependencies between features

## 5. Auto-fix

Try auto-fix first for formatting issues:

```bash
npx tsc --noEmit --pretty
```

Some ESLint errors can be auto-fixed (but not all in this config).
