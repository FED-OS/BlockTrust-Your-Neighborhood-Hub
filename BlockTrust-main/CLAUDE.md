# CLAUDE.md

Guidance for Claude (and any AI coding agent) working in the **BlockTrust** repository.

BlockTrust is a vanilla-HTML/CSS/JS neighborhood community web app (Nextdoor-style) deployed as a static PWA. There is **no build step, no framework, no package manager, and no backend required** to run the demo. Keep it that way unless explicitly told otherwise.

## Repository layout

```
index.html            App shell + all section markup (single page, tab-based)
css/theme.css         Full design system + dark/light theme (CSS variables)
js/data.js            Seed data: HOODS, CATEGORIES, PROS, EVENTS, NOTIFICATIONS, SEED_POSTS
js/storage.js         Store: localStorage state layer (load/save/update/reset)
js/app.js             All app logic: rendering, tabs, post creation, comments, toasts
assets/logo.svg       App icon
manifest.json         PWA manifest
sw.js                 Service worker (offline cache, cache v2)
```

## Hard rules

1. **No frameworks.** No React, Vue, Tailwind, Bootstrap, jQuery. Vanilla only. No bundler.
2. **No build step.** Files must run by opening `index.html` or via `python3 -m http.server`.
3. **Don't break the architecture.** Keep CSS in `css/`, data in `js/data.js`, persistence in `js/storage.js`, logic in `js/app.js`. Inline styles only for tiny one-offs.
4. **Persist state with the `Store`** (`js/storage.js`). Don't sprinkle raw `localStorage` calls.
5. **Never use `alert()`/`prompt()`/`confirm()` for new UX.** Use the `toast()` helper. (A couple of legacy `confirm()`/`prompt()` calls remain for destructive actions — fine to keep but prefer toasts.)
6. **Theme-aware.** Any new color must come from a `--var` in `css/theme.css` and work in **both** `:root` (light) and `[data-theme="dark"]`.
7. **Mobile-first.** Always test small widths. The bottom nav + FABs are the primary navigation.
8. **Accessibility.** Use semantic tags, `aria-label`s on icon buttons, visible focus states.

## Conventions

- JavaScript: ES2020+, `camelCase`, 4-space indent, single quotes, trailing commas.
- CSS: BEM-ish class names, kebab-case, 4-space indent, grouped by section with comment banners.
- IDs for JS hooks: `camelCase`. Data attributes: `data-kebab`.
- Time: store timestamps as `Date.now()` ms; display via `timeAgo()` in `app.js`.
- New post/event/pro types must be added to `js/data.js` seed arrays and any new category to `CATEGORIES` + `CAT_META`.

## How to run / verify

```bash
cd BlockTrust-main
python3 -m http.server 8000
# open http://localhost:8000
```

When verifying in the sandbox, remember: the service worker caches aggressively. After changing files, **unregister the SW** and hard-reload, or test in an incognito context, or bump `CACHE_NAME` in `sw.js`.

## Where to put things

| You want to… | Put it in |
| --- | --- |
| Add a demo post/event/pro | `js/data.js` |
| Add a UI section/tab | `index.html` + a `#tab-x` section + a nav link + a `renderX()` in `app.js` |
| Add a new color/spacing token | `css/theme.css` (both themes) |
| Add persisted user state | `Store` defaults in `js/storage.js` |
| Add a toast | call `toast(msg, type, icon)` |
| Add offline-cached asset | `urlsToCache` in `sw.js` + bump `CACHE_NAME` |

## Don't

- Don't add `node_modules`, `package.json`, or `dist/` build output.
- Don't introduce Supabase/Stripe keys in the repo. The demo is fully client-side.
- Don't remove the free-speech guidelines card or the seed data without being asked.
- Don't commit large binaries. Use SVG or external CDN/Unsplash URLs.

## Commit messages

Conventional Commits:

```
feat(feed): add image upload to post modal
fix(theme): dark mode toggle not persisting on iOS Safari
docs: add SECURITY.md and CODE_OF_CONDUCT
chore(sw): bump cache version to v3
```

## When in doubt

Read `README.md`, `AGENTS.md`, and `CONTRIBUTING.md`. If a task is ambiguous, ask the user rather than guessing — especially for anything touching the free-speech policy or monetization (premium/boost/reward escrow).
