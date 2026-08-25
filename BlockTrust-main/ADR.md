# Architecture Decision Records (ADR)

This document records the significant architectural, technical, and product
decisions made during the design and evolution of **BlockTrust**, a
neighborhood-first social app built as a vanilla JavaScript Progressive Web
Application. Each record follows a lightweight ADR format: context, decision,
status, and consequences. Records are immutable once marked *Accepted* — if a
decision is later reversed, a new ADR is written that supersedes the old one.

The purpose of this log is twofold. First, it gives every contributor — human
or AI agent — a clear trail of *why* the codebase looks the way it does, so that
future changes are made with full context instead of from scratch. Second, it
acts as a guardrail against drift: the hard rules captured here (no frameworks,
no build step, `localStorage` persistence, toast-not-alert) are the load-bearing
constraints that keep BlockTrust fast, inspectable, and trivially deployable.

The numbering is sequential and never reused. Dates use ISO 8601. When an ADR
supersedes an earlier one, the header of the new record references the old ADR
number and the old record is annotated with a *Superseded by ADR-XXX* note.

---

## ADR-0001 — Use vanilla JavaScript with no framework or build step

- **Date:** 2025-08-20
- **Status:** Accepted

### Context

BlockTrust began life as a single-file demo, and the upgrade goal was to make it
a polished, feature-complete app without sacrificing the property that made it
attractive in the first place: a contributor can open the repository, double
click `index.html`, and the app runs. Introducing a framework (React, Vue, Svelte)
or a bundler (Vite, Webpack, esbuild) would add install steps, lock in a Node
toolchain, complicate the service-worker cache, and make every change a rebuild.
For a community app whose primary surface is a small set of tabs and a feed, the
DOM is small enough that direct manipulation is cheap and readable.

### Decision

BlockTrust ships as a dependency-free vanilla JavaScript PWA. There is no
`package.json`, no `node_modules`, no transpilation, and no bundler. Source files
are served and executed as-is. The three scripts (`js/data.js`,
`js/storage.js`, `js/app.js`) are loaded in order from `index.html` and share
state through the `window.BT_DATA` object and the `Store` module.

### Consequences

**Positive.** The barrier to contribution is effectively zero — any browser is a
fully functional development environment. Code review maps one-to-one to the
running app. Deployment is a static file copy. The service worker can cache the
exact bytes the browser will execute, with no hash mismatch risk.

**Negative.** There is no component reuse beyond copy-paste of render functions,
no type checking, and no tree-shaking. As the app grows, `app.js` will need to be
split into more modules loaded in order, and developers must exercise discipline
to avoid reimplementing utilities that a framework would give them for free.

---

## ADR-0002 — Persist all user state in `localStorage` via a `Store` module

- **Date:** 2025-08-20
- **Status:** Accepted

### Context

BlockTrust needs to remember the user's theme preference, chosen neighborhood,
created posts, liked post ids, saved posts, read notifications, RSVP'd events,
free-speech-card open state, and premium subscription flag. The simplest zero-
backend persistence option available in every browser is `localStorage`. A
naive approach would scatter `localStorage.getItem` / `setItem` calls across the
codebase, which makes it hard to reason about the schema, migrate versions, or
reset state for testing.

### Decision

All persistence flows through a single `Store` IIFE module (`js/storage.js`)
keyed under `blocktrust_state_v2`. The module exposes `load`, `save`, `get`,
`set`, `update`, and `reset`. `load()` deep-merges saved state over a defaults
object on startup, so missing keys are backfilled automatically. The `v2`
suffix in the key allows a clean break from the pre-upgrade `v1` schema without
writing a migration. Any code that reads or writes durable state must go through
`Store`; direct `localStorage` access elsewhere is a lint error.

### Consequences

**Positive.** There is exactly one place to look for the data schema and one
place to change it. `Store.reset()` clears everything for a clean demo.
Bumping the key (e.g. to `v3`) is the supported migration path.

**Negative.** `localStorage` is synchronous, has a ~5 MB cap, and is per-origin.
This is fine for a single-user demo but blocks any future multi-device sync; that
would require a backend, which is explicitly out of scope for the current
architecture (see ADR-0006).

---

## ADR-0003 — Tab-based single-page architecture with `switchTab()`

- **Date:** 2025-08-20
- **Status:** Accepted

### Context

BlockTrust has six top-level surfaces: Home feed, Alerts, Pros directory,
Events, Profile, and Premium. A traditional multi-page site would force a full
reload on each navigation, losing in-memory state and breaking the smooth app
feel. A client-side router (hash- or history-based) is the standard solution.

### Decision

The app uses a single `index.html` containing all six `<section>` panels, only
one of which has the `.active` class at a time. Navigation is centralised in
`switchTab(tabId)`, which is the single function that toggles the active class on
both the section and the corresponding bottom-nav / category-bar button, then
re-renders that panel's content. The `TABS` array enumerates the valid ids.
Welcome-banner feature tiles carry `data-go` attributes that `switchTab` reads,
so the banner acts as a second navigation surface.

### Consequences

**Positive.** State stays in memory across tab switches. Rendering is lazy — a
panel is only built when first shown. The nav is the single source of truth for
"where am I."

**Negative.** Back-button support is limited because the URL does not change. If
deep-linking becomes a requirement, a hash router can be layered on top of
`switchTab` without rewriting it, so the door is left open.

---

## ADR-0004 — Theme system via CSS custom properties and `[data-theme]`

- **Date:** 2025-08-20
- **Status:** Accepted

### Context

BlockTrust must support light and dark modes that the user can toggle instantly
and that persist across reloads. The styling is otherwise large (hundreds of
CSS rules across many components), so a per-rule `prefers-color-scheme` media
query would be verbose and error-prone.

### Decision

All colours, spacing, radii, shadows, and motion tokens are defined as CSS
custom properties on `:root` (the light theme). A `[data-theme="dark"]` block on
the `<html>` element overrides only the colour tokens. Toggling the theme is a
single `document.documentElement.setAttribute('data-theme', …)` call wrapped in
`applyTheme()`, with the choice saved via `Store`. No component-level CSS ever
references a literal colour.

### Consequences

**Positive.** Adding dark mode to a new component means writing zero new rules —
it inherits the tokens. The toggle is instant and flicker-free.

**Negative.** Contributors must resist the temptation to hard-code `#fff` or
`#000`. The lint rule in `CLAUDE.md` flags this.

---

## ADR-0005 — Replace `alert()` with a toast system

- **Date:** 2025-08-20
- **Status:** Accepted

### Context

Native `alert()`, `confirm()`, and `prompt()` are modal, blocking, ugly, and
unstyleable. They break the app's visual language and freeze the page.

### Decision

All user feedback flows through a `toast(message, type)` function that pushes a
self-dismissing notification into a `#toastStack` container styled by
`theme.css`. The toast types are `success`, `error`, and `info`, each with a
distinct colour and icon. Confirm-style interactions are handled inline in the
UI (e.g. the Premium subscribe button directly changes state and toasts),
never via `confirm()`.

### Consequences

**Positive.** Feedback is non-blocking, on-brand, and theme-aware. There is a
single, documented way to tell the user something.

**Negative.** Truly blocking confirmation (e.g. "delete everything?") would
require a custom modal; the current codebase avoids destructive actions that
need one.

---

## ADR-0006 — No backend in the current architecture; backend is a future phase

- **Date:** 2025-08-20
- **Status:** Accepted

### Context

A real neighborhood social app needs accounts, cross-device sync, real posts
from other people, and moderation. None of that exists today, and building it
would change the project's character from "open `index.html` and run" to
"provision a database."

### Decision

The current architecture is deliberately single-user and client-only. All data
is seed data (`js/data.js`) plus the user's own `localStorage` mutations. The
ROADMAP captures a future "Phase 2" that would introduce an optional backend,
but until then the app is a high-fidelity, fully-interactive front-end
prototype. The reward-escrow and premium features are modelled in the UI but do
not move real money.

### Consequences

**Positive.** The app is trivially deployable to any static host and works
fully offline.

**Negative.** There is no real social graph. Contributors proposing features
that require a server should route them through the ROADMAP's Phase 2 rather
than bolting on ad-hoc fetch calls.

---

## ADR-0007 — Service worker with cache versioning and network-first strategy

- **Date:** 2025-08-20
- **Status:** Accepted

### Context

To qualify as an installable PWA and to work offline, BlockTrust registers a
service worker. The hard lesson from development was that a stale cache can
serve an old `index.html` indefinitely, making edits appear to do nothing even
after a hard reload.

### Decision

`sw.js` uses a `CACHE_NAME` constant (currently `blocktrust-v2`) that must be
bumped on every meaningful release. The fetch handler is network-first with a
cache fallback, so updates appear on the next load after the new SW activates,
and the user is never left without content when offline. The README and AGENTS.md
both carry a prominent warning that, when debugging, the SW must be bypassed or
the cache cleared.

### Consequences

**Positive.** Offline works; updates eventually propagate.

**Negative.** Developers must remember to bump `CACHE_NAME`. Forgetting it is
the single most common "my change didn't ship" bug, documented in the pitfalls
table of `AGENTS.md`.

---

## How to propose a new ADR

1. Copy the template above (Context → Decision → Consequences) with the next
   free number and today's date.
2. Set **Status: Proposed**.
3. Open a pull request titled `ADR-00XX — <short title>`.
4. Discuss in the PR; when consensus is reached, set **Status: Accepted** and
   merge.
5. If an ADR is later overturned, do not delete it — add a *Superseded by
   ADR-00YY* line and write the replacement ADR that references it.
