# Contributing to BlockTrust

First of all, thank you for being here. BlockTrust is a community project, and
every contribution — a typo fix, a bug report, a feature idea, a polished pull
request — makes the neighbourhood better. This guide explains how to get the
code running, how to make changes that fit the project's architecture, and how
to submit your work so it can be reviewed and merged quickly. It is written so
that a first-time contributor can follow it end to end without asking anyone
anything, but if you do get stuck, `SUPPORT.md` and GitHub Discussions are
there for you.

BlockTrust is a vanilla-JavaScript Progressive Web App with no framework, no
build step, and no dependencies. That means contributing is refreshingly simple:
you clone, you serve, you edit, you refresh, you open a pull request. There is
nothing to install and nothing to compile. The trade-off is that the project has
a few hard rules — documented in `CLAUDE.md` and `AGENTS.md` — that keep the
codebase clean and the app fast. Please read those rules before your first
non-trivial change; they are short and they will save you rework.

---

## Getting set up

You need a modern browser and a way to serve static files. No Node.js is
required.

1. Fork the repository and clone your fork locally.
2. From the repository root, start a static server. The canonical command is
   `python3 -m http.server 8000`, but any static server works.
3. Open `http://localhost:8000` in your browser. The app should load with no
   console errors.

`localhost` is a secure context, so the service worker and PWA features work as
they would in production. This also means the service worker will cache the app
— see the "Service worker gotcha" section below, because it bites almost every
new contributor once.

---

## Repository layout

```
index.html          app shell: app bar, tabs, modal, nav, toasts
css/theme.css       the entire design system (tokens + components)
js/data.js          seed data on window.BT_DATA
js/storage.js       Store module: all localStorage persistence
js/app.js           application logic (rendering, events, tabs)
sw.js               service worker (offline cache)
manifest.json       PWA manifest
assets/logo.svg     project logo
.github/            issue/PR templates, discussions README, config.yml
```

Architectural decisions behind this layout are in `ADR.md`. The short version:
each file has one job, state flows through `Store`, and `app.js` is the only
place that touches the DOM.

---

## The hard rules

These are the load-bearing constraints. Breaking them is the most common reason
a pull request is requested-for-changes.

- **No frameworks, no libraries, no build step.** Vanilla JS, CSS, and HTML
  only. Do not add a `package.json`, do not import a CDN script, do not
  introduce a bundler.
- **All persistence goes through `Store`.** Never call `localStorage` directly
  outside `js/storage.js`. If you need new durable state, add a key to the
  `Store` defaults object and bump the key version only if the schema is
  incompatible.
- **No `alert`, `confirm`, or `prompt`.** Use `toast(message, type)` for user
  feedback. The types are `success`, `error`, and `info`.
- **Theme-aware CSS only.** Never hard-code a colour in a component. Use the
  CSS custom properties defined in `:root` so dark mode works automatically.
- **Mobile-first.** Build for a phone-width screen first, then enhance for
  larger screens with `min-width` media queries. Do not design desktop-first
  and shrink.
- **Accessibility matters.** Use semantic HTML, label your controls, and ensure
  the keyboard can reach every interactive element.

---

## Making a change

1. **Create a branch** from `main` with a descriptive name, e.g.
   `fix/events-rsvp-count` or `feat/settings-panel`.
2. **Make your edit.** Because there is no build step, you see your change the
   moment you refresh the browser. Test in both light and dark theme, and at a
   narrow (phone) and wide (desktop) width.
3. **If you add seed content**, put it in `js/data.js` on the `window.BT_DATA`
   object following the existing shape.
4. **If you add a new component**, style it in `css/theme.css` using the
  existing tokens, and render it from `js/app.js`.
5. **If you change durable state**, update the `Store` defaults and, if needed,
   the CHANGELOG.
6. **Update `CHANGELOG.md`** under an `[Unreleased]` heading describing your
   change in user-facing terms.
7. **Update docs** if your change affects behaviour. The README, AGENTS.md,
   CLAUDE.md, and ADR.md should stay accurate.

---

## Service worker gotcha

When you edit a file and refresh, you may see no change. This is almost always
the service worker serving a cached copy. To bypass it during development:

- In DevTools → Application → Service Workers, check *Update on reload*, or
  click *Unregister*, then reload.
- Or run, in the console:

  ```js
  navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister())).then(() => location.reload());
  ```

Once your change is verified, remember that for a *release* you must bump
`CACHE_NAME` in `sw.js` so users get the update (see `DEPLOYMENT.md`).

---

## Opening a pull request

1. Push your branch to your fork.
2. Open a pull request against `main`. The PR template (`.github/PULL_REQUEST_TEMPLATE.md`)
   will guide you through a summary, related issue, type of change, screenshots,
   and a checklist.
3. The checklist asks you to confirm: code follows the style rules, you tested
   on mobile and desktop in both light and dark themes, you introduced no build
   step or dependency, persistence goes through `Store`, you used toasts not
   alerts, and you updated `data.js` / `CHANGELOG` as needed. Please actually
   tick these — they are not decoration.
4. Include before/after screenshots for visual changes. For an app this visual,
   a screenshot communicates more than a paragraph.
5. Wait for review. A maintainer will comment, request changes, or merge.
   Please respond to review feedback constructively; review is collaborative,
   not adversarial.

---

## Commit messages

Use the imperative mood in the subject line: "Add settings panel", not "Added
settings panel". Keep the subject under 72 characters. Reference issues and
ADRs in the body where relevant, e.g. `Refs #42`, `See ADR-0006`. Small fixes
can have a one-line commit; larger changes benefit from a body explaining the
why.

A conventional prefix is appreciated but not required, e.g.
`fix(events): correct RSVP count after un-RSVP`, `feat(profile): add data
export`, `docs: clarify service worker cache bump`.

---

## Code style

- Two-space indentation, no tabs.
- Single quotes for strings in JavaScript.
- `const` by default, `let` only when reassignment is needed, no `var`.
- Functions that render DOM return HTML strings assembled with template
  literals; the caller injects them via `innerHTML`.
- CSS class names are kebab-case and grouped by component with a comment header.
- Keep `app.js` readable; if a function grows past ~40 lines, consider splitting
  it.

---

## Reporting bugs and requesting features

If you find a bug, open an issue with the bug-report template. If you have a
feature idea, start in Discussions → Ideas so the community can discuss it
before code is written. See `SUPPORT.md` for the full routing.

---

## Recognition

All contributors are valued. Significant merged contributions are acknowledged
in release notes and, optionally, in a contributors list. The project does not
gatekeep credit — if you made the project better, you belong in the history.

Welcome, and thank you for building BlockTrust with us.
