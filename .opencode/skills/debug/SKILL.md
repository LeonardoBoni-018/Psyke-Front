---
name: debug
description: |
  Use when the user reports a bug, error, unexpected behavior, crash, or UI glitch in the Psyke system.
  Use when investigating a runtime error, type error, lint error, or failed build.
  Use when asked to fix, debug, troubleshoot, or investigate an issue.
  Do NOT use for implementing new features or writing tests.
---

# Debug Skill — Psyke

Systematic workflow for debugging issues in the Psyke frontend.

## 1. Reproduce and classify

- **Where**: component, page, hook, API call, route, build, or type?
- **When**: on load, on interaction, on submit, on navigation?
- **Error message**: copy the full error from console/terminal
- **Severity**: blocker / high / medium / low

## 2. Gather evidence

Run the relevant commands first:

```bash
npx tsc --noEmit        # Type errors
npm run lint             # ESLint errors
npm run dev              # Runtime errors (check browser console)
```

Check browser DevTools:
- Console tab → full error + stack trace
- Network tab → failed API calls (status, payload, response)
- React DevTools → component props/state if available

## 3. Common failure patterns in this project

| Symptom | Likely cause | Where to look |
|---|---|---|
| Blank white page | Uncaught import error, missing RouteObject export | Router.tsx, lazy imports |
| "Failed to resolve import" | File renamed but import not updated | Router.tsx, barrel files |
| Module not providing export | Type-only import at runtime | Import statements (use `import type`) |
| 401 loop | Token refresh failure | axios.ts interceptor |
| UI not updating | Missing key prop, stale closure | Component re-render logic |
| Build fails | TS strict errors, unused vars | Run `tsc --noEmit` |

## 4. Fix strategy

1. Identify the **minimal reproduction**
2. Write the fix in the **smallest scope possible**
3. Verify: `npx tsc --noEmit` + `npm run lint`
4. Test manually in the browser

## 5. If stuck

- Search the codebase for related patterns with grep
- Check if the issue is a regression (recent changes)
- Consider if it's a dependency version issue (`package.json`)
