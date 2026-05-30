---
name: feature
description: |
  Use when the user asks to implement a new feature, create a new page, add a new component, build a new screen, or extend functionality in the Psyke system.
  Use when asked to add, create, implement, build, or develop something new.
  Do NOT use for bug fixes, refactoring, or writing tests.
---

# Feature Implementation Skill — Psyke

Process for implementing new features following the project's architecture.

## 1. Understand the feature

- What is the **user goal**?
- What **existing patterns** are similar?
- Which **feature folder** does it belong to?

## 2. Project structure reference

```
src/
  features/<feature-name>/
    pages/        # Route-level page components (lazy loaded)
    components/   # Feature-specific components
    hooks/        # Feature-specific hooks (use<Name>.ts)
    services/     # API calls (<name>Api.ts)
    store/        # Zustand store if needed
  components/
    shared/       # Reusable across features
    ui/           # Primitive UI components (Button, etc.)
    layout/       # Layout components (Sidebar, Topbar, etc.)
  types/          # Shared type definitions
```

## 3. Implementation order

1. **Types** → `types/<domain>.ts` (interfaces, types, enums)
2. **API service** → `features/<name>/services/<name>Api.ts`
3. **Zustand store** (if needed) → `features/<name>/store/<name>Store.ts`
4. **Components** → `features/<name>/components/<Name>/<Name>.tsx`
5. **Page** → `features/<name>/pages/<Name>Page.tsx`
6. **Route** → Register in `app/Router.tsx` (lazy import)

## 4. Conventions to follow

- **Exports**: named exports (`export function`, not `export default`)
- **Types**: `import type { ... }`, interfaces over types for object shapes
- **Styles**: Tailwind classes with CSS variable tokens only (no inline styles, no raw colors)
- **Forms**: react-hook-form + zodResolver + zod schema
- **Server state**: TanStack Query (useQuery, useMutation)
- **Lazy loading**: pages via `React.lazy()` in Router.tsx
- **Barrel exports**: `index.ts` for component directories when needed

## 5. Verification

Before finishing:

```bash
npx tsc --noEmit
npm run lint
```
