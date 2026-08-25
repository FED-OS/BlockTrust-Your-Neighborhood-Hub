# Component Guide

This guide explains how BlockTrust's UI components are built and how to add a
new one that fits the existing system. It is the practical companion to the
[Architecture Overview](./Architecture-Overview) and the theming rules in
`CLAUDE.md`. The component model is simple because there is no framework: a
component is a render function that returns an HTML string, plus a block of CSS
in `theme.css` that styles the classes that string uses. This page walks through
an existing component in detail, then gives a checklist for adding your own.

---

## Anatomy of a component: the post card

The post card is the most repeated component in the app, so it is the best
example. It is produced by `renderPostCard(post)` in `js/app.js`, which returns
a template literal containing the full HTML for one post: the author row (avatar,
name, role, neighbourhood, timestamp), the title and content, optional image or
rewarded badge, the category pill and tags, and the action row (like, comment,
save). The classes it uses — `.post-card`, `.post-author`, `.post-avatar`,
`.post-title`, `.post-actions`, and so on — are all defined in `css/theme.css`
under a `/* Post card */` comment header.

The styling follows three rules that every component should follow:

1. **No literal colours.** Every colour comes from a CSS custom property
   (`var(--bt-…)`) defined on `:root`, so dark mode works automatically.
2. **Mobile-first.** The card is designed for a phone-width column first; any
   wider-screen adjustments use `min-width` media queries, never `max-width`
   shrink-downs.
3. **Spacing from tokens.** Padding, margin, and gaps use the spacing tokens so
   the rhythm is consistent across components.

After the feed is rendered, `bindPostEvents()` attaches click handlers to the
like, comment, and save buttons on each card. Those handlers update `Store`,
save, and update the DOM — the standard data-flow loop described in the
Architecture Overview.

---

## The render-and-bind pattern

Most components follow the same shape:

1. A `renderX(items)` function maps over a data array and returns joined HTML,
   which is injected into a container via `innerHTML`.
2. A `bindXEvents()` function (or inline delegation) attaches the interactive
   handlers after the render.
3. The tab's top-level render function (e.g. `renderFeed`, `renderAlerts`,
   `renderPros`, `renderEvents`, `renderProfile`) calls both and handles the
   empty-state case when there is no data.

When you add a component, follow this shape so it behaves predictably and so
other contributors recognise the pattern.

---

## Adding a new component: step by step

Say you want to add a "neighbourhood selector" card for the Profile tab.

**1. Pick the classes.** Decide on a BEM-ish, kebab-case naming scheme, e.g.
`.hood-card`, `.hood-card__title`, `.hood-card__meta`. Prefixing with the
component name avoids collisions.

**2. Write the CSS** in `css/theme.css` under a new comment header
(`/* Hood card */`). Use only tokens for colour and spacing. Add a dark-mode
override only if a token does not already cover the case — usually none is
needed because the tokens flip automatically.

**3. Write the render function** in `js/app.js`. It takes the relevant data
(possibly from `Store.get` or `window.BT_DATA`), returns an HTML string built
with a template literal, and is called from the parent tab's render function.
Remember to escape any user-provided text before interpolating it.

**4. Bind events.** If the card has interactive elements, attach handlers either
inline in the render function's parent or via a dedicated `bind…Events()`
function called after render. Handlers update `Store`, save, and update the DOM.

**5. Handle the empty state.** If the component can have no data, render a
`.empty-state` block (the class already exists in `theme.css`) with a helpful
message instead of a blank container.

**6. Test in both themes and both widths.** Toggle dark mode and resize the
browser narrow and wide. Fix any tokens you missed.

**7. Update docs.** If the component is significant, mention it in the
CHANGELOG under `[Unreleased]` and, if it changes architecture, consider an ADR.

---

## Existing components reference

The components currently in the app, with the file locations of their styles:

- **App bar** — top bar with logo, title, theme toggle. `css/theme.css`
  `/* App bar */`.
- **Category bar** — horizontal filter pills. `/* Category bar */`.
- **Welcome banner** — feature grid with `data-go` navigation tiles.
  `/* Welcome banner */`.
- **Post card** — feed item with author, content, actions. `/* Post card */`.
- **Badges** — role, urgent, rewarded, premium pills. `/* Badges */`.
- **Free-speech card** — collapsible highlighted conversation. `/* Free speech */`.
- **Alerts list** — notification rows with read state. `/* Alerts */`.
- **Pro grid** — professional directory cards. `/* Pro grid */`.
- **Events** — event cards with RSVP. `/* Events */`.
- **Profile** — identity, stats, edit. `/* Profile */`.
- **Premium** — membership pitch and subscribe. `/* Premium */`.
- **Bottom nav** — five-item navigation bar. `/* Bottom nav */`.
- **FABs** — floating action buttons for Pros and Premium. `/* FABs */`.
- **Modal** — post composer. `/* Modal */`.
- **Toasts** — notification stack. `/* Toasts */`.
- **Empty state** — placeholder for empty containers. `/* Empty state */`.

When in doubt about how to style something, find the closest existing component
and mirror its structure.

---

## Common mistakes

- **Hard-coding a colour** (e.g. `color: #16a34a`) instead of using a token.
  This breaks dark mode. Always use `var(--bt-…)`.
- **Designing desktop-first.** Build for 360–400px wide first; enhance upward.
- **Forgetting to re-bind events after re-render.** If you replace a container's
  `innerHTML`, its old event listeners are gone; re-bind them.
- **Interpolating user text without escaping.** This is an XSS risk. Escape
  before interpolating.
- **Adding a framework or a CDN script.** This violates ADR-0001 and will be
  requested-for-changes in review.

Following this guide keeps new components consistent, theme-aware, and
maintainable.
