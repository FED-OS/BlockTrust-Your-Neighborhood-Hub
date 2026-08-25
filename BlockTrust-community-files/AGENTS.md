# AGENTS.md

Operating manual for AI agents (Claude, Codex, Copilot Workspace, GPT, etc.) contributing to **BlockTrust**.

> Short version: **vanilla web, no build step, mobile-first, theme-aware, persist via `Store`, toast-not-alert, read `CLAUDE.md` for the deep rules.**

## Project in one paragraph

BlockTrust is a neighborhood social platform (Nextdoor-style) shipped as a single-page, installable **PWA** built with plain HTML/CSS/JS. It has a feed of posts (lost/found pets, local pros, events, news, urgent alerts), a Premium tier with reward escrow, a notifications center, a pros directory, an events calendar, and a profile page. All demo data lives in `js/data.js`; all user state persists to `localStorage` via `js/storage.js`.

## Before you write any code

1. Read `CLAUDE.md` — it has the hard rules and conventions.
2. Read `README.md` — feature list and architecture.
3. Skim `js/app.js` to understand rendering patterns (`renderFeed`, `renderPostCard`, `switchTab`, `toast`).
4. Skim `css/theme.css` for available design tokens (`--accent`, `--bg-card`, `--r-lg`, etc.).

## Standard task loop

1. **Reproduce/observe** the current behavior (serve locally — see below).
2. **Make the smallest change** that satisfies the task, in the right file.
3. **Verify** in a browser: both themes, a mobile width (≤ 600px), and that state still persists after reload.
4. **Update docs**: `CHANGELOG.md` (Unreleased), and `README.md`/`usage.md`/`ROADMAP.md` if behavior changed.
5. **Commit** with a Conventional Commit message.

## Running locally

```bash
cd BlockTrust-main
python3 -m http.server 8000
```

⚠️ The service worker caches aggressively. When iterating:
- unregister the SW in DevTools → Application → Service Workers, **or**
- test in an incognito window, **or**
- bump `CACHE_NAME` in `sw.js` after asset changes.

## What "done" looks like

A task is done only when **all** of these are true:

- [ ] Code runs with no console errors.
- [ ] Works in light **and** dark theme.
- [ ] Works at a mobile width (375–600px) and a desktop width (≥ 900px).
- [ ] No new `alert()`/`prompt()`/`confirm()` for non-destructive UX (use `toast()`).
- [ ] State that should persist does persist across a full reload.
- [ ] `CHANGELOG.md` updated.
- [ ] No `node_modules`, `package.json`, or build artifacts added.

## Common pitfalls

| Pitfall | Fix |
| --- | --- |
| Edits don't show up | SW cache. Unregister SW + hard reload, or bump `CACHE_NAME`. |
| New color is invisible in dark mode | You hard-coded a hex. Use a `--var` defined in both themes. |
| Post disappears on reload | You didn't push it into `S.posts` and `persist()`. |
| New tab not reachable | You added a `#tab-x` but no nav link / FAB / `switchTab` call. |
| `toast is not defined` | `toast` is scoped inside the IIFE in `app.js`. Call it from within app code, not inline `onclick`. |

## Working with the data layer

- **Seed/demo content** → `js/data.js` (`SEED_POSTS`, `PROS`, `EVENTS`, `NOTIFICATIONS_SEED`, `HOODS`, `CATEGORIES`, `CAT_META`).
- **User state** → `Store` in `js/storage.js`. Defaults live in `defaults`. Use `Store.get()`, `Store.set()`, `Store.update(fn)`, `Store.reset()`.
- Never read/write `localStorage` directly outside `storage.js`.

## Adding a new section (checklist)

1. Add `<section id="tab-x" class="tab-content">` in `index.html`.
2. Add a nav `<a data-tab="x">` in `.bottom-nav` **or** a `.fab` button.
3. Add `'x'` to the `TABS` array in `app.js`.
4. Add a `renderX()` function and call it from `switchTab()`.
5. Add the section title to the category bar hide/show logic if needed.

## Style & tone of docs

- Friendly, neighborly, a little playful (we're a neighborhood app). Emojis are welcome in user-facing docs, sparingly in technical docs.
- Be concrete: file paths, function names, copy-pasteable commands.

## Security & sensitive work

- Never commit API keys, secrets, or real user data.
- If a task touches auth/payments/free-speech policy, **stop and ask the user** before proceeding.
- Suspected vulnerabilities → follow `SECURITY.md`, not a public issue.

## Agents should ask the user when

- The task is ambiguous or could be read two very different ways.
- A change would break backward compatibility or the no-framework/no-build rule.
- Anything touches monetization, moderation policy, or real personal data.
