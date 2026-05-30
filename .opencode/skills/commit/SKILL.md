---
name: commit
description: |
  Use when the user says "commit", "push", "git commit", "fazer commit", "enviar", or asks to stage, commit, and/or push changes.
  Use when asked to prepare, review, or suggest a commit message.
  Use for automating git workflow: stage → commit → push.
  Do NOT use for git history inspection, branch operations, or rebasing.
---

# Commit Skill — Psyke

Automated git workflow: stage, commit, and push changes.

## Workflow

### 1. Inspect the working tree

Run these to understand what changed:

```bash
git status
git diff --stat
```

If there are staged changes, also show:

```bash
git diff --cached --stat
```

### 2. Review changes (brief summary)

Show a compact diff of unstaged files to decide what to stage:

```bash
git diff
```

### 3. Stage files

Stage all tracked files:

```bash
git add -u
```

If there are new untracked files, ask the user before adding them. Only add untracked files that make sense (never add `.env`, `node_modules`, `dist`, or build artifacts).

### 4. Generate commit message

Use the **Conventional Commits** format:

```
<type>(<scope>): <description>

<body>
```

**Types:** `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `perf`, `test`, `ci`

**Scopes:** `auth`, `patients`, `agenda`, `dashboard`, `medical-records`, `financial`, `professionals`, `reports`, `settings`, `router`, `api`, `ui`, `config`, `deps`

Base the message on the actual diff content. Keep the first line under 72 chars.

### 5. Commit

```bash
git commit -m "<message>"
```

### 6. Push (if asked)

```bash
git push
```

If the upstream branch is not set, use:

```bash
git push -u origin <current-branch>
```

## Rules

- **Never commit** without showing the diff/summary first
- **Never force push**
- **Never commit** if there are unfixed type or lint errors (run `npx tsc --noEmit && npm run lint` first)
- **Never commit** `node_modules`, `.env`, `dist`, or secrets
- If the branch has no upstream, confirm before pushing
