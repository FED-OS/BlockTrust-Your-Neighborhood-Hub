# Theming Guide

BlockTrust's theming system is built entirely on CSS custom properties (CSS
variables) and a single `data-theme` attribute on the root element. It is one
of the simplest possible systems that still gives you a full, instant, persistent
light/dark toggle with no flash and no JavaScript colour logic. This guide
explains how it works, how to use it when writing new styles, and how to avoid
the common mistakes that break dark mode.

---

## How it works

In `css/theme.css`, the `:root` selector defines the full set of design tokens
— colours, spacing, radii, shadows, and motion — with the **light theme**
values. A separate `[data-theme="dark"]` selector overrides only the colour
tokens with dark-theme values. Every component in the app references these
tokens via `var(--bt-…)` and never references a literal colour.

Toggling the theme is a single line of JavaScript in `app.js`:

```js
document.documentElement.setAttribute('data-theme', theme);
```

wrapped in `applyTheme()`, which reads the choice from `Store` on load and
updates the attribute on toggle. The choice is persisted, so it survives reloads
and reinstalls. Because the toggle only changes which colour values the tokens
resolve to, the switch is instant and flicker-free — there is no re-render and
no transition jank.

---

## The token categories

The tokens fall into a few groups. Familiarise yourself with them so you reach
for the right one:

- **Surfaces** — page background, card background, elevated surfaces, and their
  alt variants. Use these for any container background.
- **Ink** — primary text, secondary text, muted text, and inverse text. Use
  these for text colour; never pick a raw hex.
- **Borders** — default border colour and stronger border colour. Use these for
  `border` and `outline`.
- **Brand** — the green accent scale used for the logo, primary actions, active
  states, and highlights.
- **Status** — success, warning, danger, and info colours for toasts, badges,
  and alerts.
- **Spacing** — a small scale of padding/margin/gap values for consistent rhythm.
- **Radii** — small, medium, large, and pill radii.
- **Shadows** — subtle and elevated shadow definitions.
- **Motion** — durations and easing curves for the few transitions in the app.

When you need a value that does not exist as a token, prefer adding a token over
hard-coding a literal, especially for colours. A new colour literal is a dark-
mode bug waiting to happen.

---

## Writing theme-aware styles

The rule is simple: **never write a literal colour in a component style.** Every
colour — background, text, border, shadow, gradient stop — comes from a token.

Good:

```css
.post-card {
  background: var(--bt-surface);
  color: var(--bt-ink);
  border: 1px solid var(--bt-border);
}
```

Bad:

```css
.post-card {
  background: #ffffff;  /* breaks dark mode */
  color: #1a1f2e;       /* breaks dark mode */
  border: 1px solid #e2e8f0;
}
```

Because the dark theme overrides the colour tokens, a component written with
tokens automatically looks correct in both themes with zero extra CSS. You
should not need to write any `[data-theme="dark"]` rules for a new component. If
you do, it usually means a token is missing or you used a literal somewhere —
fix the root cause rather than patching it in the dark override.

---

## Adding a new token

If you genuinely need a new colour (e.g. a new status type), add it to both
`:root` and `[data-theme="dark"]`:

```css
:root {
  --bt-status-notice: #f59e0b;
}
[data-theme="dark"] {
  --bt-status-notice: #fbbf24;
}
```

Then use `var(--bt-status-notice)` in your component. Keep token names
descriptive and grouped with the others.

---

## The theme toggle

The toggle button in the app bar calls `toggleTheme()`, which flips the stored
value and calls `applyTheme()`. If you add another control that should respect
the theme (e.g. a settings switch), reuse the same `Store` key and `applyTheme`
rather than introducing a parallel mechanism.

---

## Common mistakes

- **Hard-coding a colour.** The single most common dark-mode bug. Use tokens.
- **Forgetting that `rgba()` literals with hardcoded RGB also break dark mode.**
  If you need transparency over a surface, use `color-mix` or a token with an
  alpha channel, or define a token for the translucent colour.
- **Adding a `@media (prefers-color-scheme)` query in component CSS.** BlockTrust
  does not use the media query for theming — it uses the `data-theme` attribute
  so the user's explicit choice wins. Do not mix the two.
- **Designing only in light mode.** Always toggle dark mode on while styling a
  new component and fix anything that looks wrong before you finish.

If you follow the one rule — tokens, not literals — theming takes care of
itself.
