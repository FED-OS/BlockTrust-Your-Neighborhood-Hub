# Architecture Overview

This page is an expanded, tutorial-style companion to `ADR.md`. Where the ADRs
record *why* each decision was made, this page explains *how* the resulting
architecture fits together: what each file does, how data flows through the
app, and what the core runtime loop looks like. Read it once when you join the
project and refer back to it whenever you need to place a new piece of code.

---

## The files and their jobs

BlockTrust is deliberately split into a small number of files, each with one
clear responsibility. There is no framework imposing this structure; it is a
discipline the project maintains so that any contributor can hold the whole
system in their head.

`index.html` is the app shell. It contains the static structure that is always
present: the app bar with the logo and theme toggle, the category bar, the six
tab sections (only one visible at a time), the post-creation modal, the bottom
navigation, the floating action buttons, the toast stack, and the `<script>`
tags that load the three JavaScript files in order. It does almost no work
itself; it is the skeleton the JavaScript animates.

`css/theme.css` is the entire visual layer. It defines the design tokens as CSS
custom properties on `:root` — colours, spacing, radii, shadows, motion — and
overrides the colour tokens under `[data-theme="dark"]`. Every component style
(post cards, badges, nav, modal, toasts, events, profile, pros, premium) lives
here, grouped by component with a comment header. Because components reference
tokens and never literal colours, dark mode is automatic.

`js/data.js` is the seed content. It attaches an object to `window.BT_DATA`
containing the neighbourhoods, categories, category metadata, professionals,
events, notifications, and starter posts. This is the app's "database" in its
current single-user, no-backend phase. Adding content means editing this file.

`js/storage.js` is the `Store` module, an IIFE that centralises all
`localStorage` access. It exposes `load`, `save`, `get`, `set`, `update`, and
`reset`. On startup, `load()` deep-merges saved state over a defaults object,
so missing keys are backfilled. The storage key is versioned
(`blocktrust_state_v2`) so schema changes can break cleanly.

`js/app.js` is the application logic, also an IIFE. It contains the rendering
functions, the tab switcher, event binding, post creation, the toast helper,
theme application, and the `init()` that runs on DOMContentLoaded. This is the
only file that touches the DOM.

`sw.js` is the service worker. It caches the core files on install and serves
them network-first with a cache fallback, enabling offline use and PWA
installability. Its `CACHE_NAME` must be bumped per release.

`manifest.json` is the PWA manifest, declaring the app name, icons, theme
colour, display mode, and start URL so the app is installable.

`assets/logo.svg` is the project logo, an inline-friendly SVG.

---

## The data flow

On page load, the scripts run in order. `data.js` populates `window.BT_DATA`.
`storage.js` defines `Store` and calls `Store.load()`, which reads
`localStorage` (or returns defaults) into an in-memory state object. `app.js`
runs `init()` on DOMContentLoaded, which reads the merged state, applies the
theme, renders the Home feed, binds events, and wires up the nav.

From then on, every user action follows the same loop: the user interacts with
the DOM, a handler in `app.js` updates the in-memory state via `Store.set` or
`Store.update`, `Store.save()` persists the change to `localStorage`, and the
relevant render function re-draws the affected part of the DOM from the new
state. There is no separate model/view/controller scaffolding; the loop is
small enough to be implicit and readable.

For example, liking a post: the click handler reads the post id, flips the liked
flag in `Store`, saves, updates the like count in the DOM, and shows nothing
(likes are silent). Creating a post: the modal submit handler reads the form
fields, constructs a post object, prepends it to the posts array in `Store`,
saves, closes the modal, re-renders the feed, and toasts a confirmation.

---

## The tab system

The six tabs — `home`, `alerts`, `pros`, `events`, `profile`, `premium` — are
listed in the `TABS` array in `app.js`. Each corresponds to a `<section>` in
`index.html` with an id like `tab-home`. Only one section has the `.active`
class at a time. `switchTab(tabId)` is the single function that toggles
`.active` on the section and the matching nav button, then calls the render
function for that tab. The welcome banner's feature tiles carry `data-go`
attributes that `switchTab` reads, giving the banner a second navigation
surface.

This design means the URL never changes during navigation, so deep-linking and
back-button support are limited. The door is left open to layer a hash router
on top of `switchTab` later without rewriting it, should deep links become a
requirement.

---

## The rendering pattern

Components are rendered by functions that return HTML strings built with
template literals. `renderPostCard(post)` returns the full HTML for one post;
`renderFeed()` maps over the posts and joins the cards into the feed container's
`innerHTML`. The same pattern applies to alerts, pros, events, and profile.
Event delegation or per-element binding in `bindPostEvents()` attaches the
likes/comments/saves handlers after each render.

The one rule to honour: when interpolating user-provided text into HTML, escape
it to prevent script injection. The current seed data is trusted, but any path
that renders real user input must escape before interpolating. A future
hardening task is to centralise this in an `escapeHtml()` helper.

---

## Design principles in practice

The architecture is the expression of a few principles, all documented as ADRs:

- **Zero-dependency, no build step** (ADR-0001): the app runs by opening a file.
- **One persistence layer** (ADR-0002): all durable state through `Store`.
- **Centralised navigation** (ADR-0003): one `switchTab` to rule them all.
- **Token-based theming** (ADR-0004): colours are variables, not literals.
- **Toasts, not native dialogs** (ADR-0005): feedback is non-blocking and on-brand.
- **No backend yet** (ADR-0006): the app is a high-fidelity front-end prototype.
- **Versioned service worker** (ADR-0007): bump the cache to ship updates.

When you add to the app, ask which principle your change touches and whether it
respects it. If it needs to bend one, that is an ADR-worthy conversation.

---

## Further reading

- `ADR.md` — the decision records behind every choice above.
- [Component Guide](./Component-Guide) — how to build a new component.
- [Data Layer Guide](./Data-Layer-Guide) — `Store` and seed data in depth.
- [Theming Guide](./Theming-Guide) — the token system in practice.
- `CLAUDE.md` and `AGENTS.md` — the rules AI agents and humans follow when editing.
