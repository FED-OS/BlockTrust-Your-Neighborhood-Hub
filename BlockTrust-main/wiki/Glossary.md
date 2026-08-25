# Glossary

Terms used in the BlockTrust codebase, documentation, and community. If you
encounter a word that is not here, please open a Discussion or pull request to
add it — the glossary should grow with the project.

---

**ADR** — Architecture Decision Record. A short document capturing the context,
decision, and consequences of a significant technical or product choice. See
`ADR.md`.

**Agent** — an AI agent (like Claude or another coding assistant) operating on
the codebase. `AGENTS.md` is the operating manual for agents; `CLAUDE.md` is the
project-specific guidance. See those files.

**App bar** — the top bar of the app, containing the logo, the current view
title, the neighbourhood indicator, and the theme toggle.

**Bottom nav** — the primary navigation bar at the bottom of the screen with
five items: Home, Alerts, Post (central +), Events, Profile.

**Cache name** — the `CACHE_NAME` constant in `sw.js` that versions the service
worker cache. Bumped on each release so returning users receive the update.

**Category bar** — the horizontal row of filter pills below the app bar that
filters the Home feed by topic.

**Contributor Covenant** — the widely-adopted open-source Code of Conduct
template that BlockTrust's Code of Conduct adapts in spirit with original
wording.

**FAB** — Floating Action Button. BlockTrust uses FABs for the Pros directory
and Premium access, stacked above the bottom nav.

**Free-speech card** — a highlighted, collapsible area on the Home feed for
uncensored community conversation that does not fit the tidy category model. Its
open/closed state is persisted.

**Going-count** — the live number of neighbours who have RSVP'd to an event.

**Hood** — shorthand for "neighbourhood," used throughout the codebase and seed
data (e.g. `HOODS`, `Store.get('hood')`).

**`localStorage`** — the browser's synchronous key-value persistence API.
BlockTrust uses it via the `Store` module only.

**Manifest** — `manifest.json`, the Web App Manifest that makes BlockTrust
installable as a PWA.

**PWA** — Progressive Web App. A web app that is installable, works offline, and
behaves like a native app, enabled by a service worker and a manifest.

**Reward escrow** — a planned economic primitive where a poster stakes a small
amount to reward the best answer to a question. Currently modelled in the UI
only; full implementation is a Roadmap Phase 3 item.

**RSVP** — a user's response to an event indicating they plan to attend.
Tracked in `Store` under `goingEvents`.

**Seed data** — the starter content in `js/data.js` (neighbourhoods,
categories, pros, events, notifications, posts) exposed on `window.BT_DATA`.

**Service worker** — `sw.js`, a script that runs in the background to cache the
app for offline use and enable PWA installability.

**Store** — the IIFE module in `js/storage.js` that centralises all
`localStorage` access. The single gateway to durable state.

**SwitchTab** — the function in `app.js` that toggles which of the six tab
sections is active and re-renders it. The single point of navigation.

**Tab** — one of the six top-level views: Home, Alerts, Pros, Events, Profile,
Premium. Enumerated in the `TABS` array.

**Theme** — the light or dark visual mode, controlled by a `data-theme`
attribute on the root element and a set of CSS custom properties. Toggled by
`toggleTheme()`, persisted via `Store`.

**Toast** — a self-dismissing notification shown via `toast(message, type)`.
Types are `success`, `error`, and `info`. Replaces native `alert`/`confirm`/
`prompt`.

**Token** — a CSS custom property (e.g. `--bt-ink`) that holds a design value.
All component styles reference tokens, never literal colours, so theming is
automatic.
