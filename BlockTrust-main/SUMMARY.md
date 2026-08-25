# BlockTrust — Project Summary

BlockTrust is a neighborhood-first social web application built as a
zero-dependency, vanilla-JavaScript Progressive Web App. It is designed to be
the digital equivalent of a block party: a small, trusted, free-speech-friendly
space where neighbours share alerts, recommend local professionals, organise
events, and reward helpfulness — without the surveillance, algorithmic ranking,
or ad-targeting that define the incumbent platforms. The project is open source
under the MIT licence and welcomes contributors of every skill level.

This summary is the one document to read if you only have two minutes. It
describes what BlockTrust is, what it currently does, how it is built, how it is
governed, and where it is going. Everything here is expanded in the dedicated
documents linked throughout — this file is the map, those are the territory.

---

## What BlockTrust is

At its core BlockTrust is a mobile-first single-page app with six surfaces.
The **Home feed** shows posts from your chosen neighbourhood, filterable by
category and searchable, with likes, comments, save-for-later, and a free-speech
card that surfaces uncensored community conversation. **Alerts** collects
notifications — urgent advisories, replies, mentions, and event reminders — and
lets you mark them read. The **Pros directory** lists vetted local professionals
so neighbours can trade recommendations instead of relying on anonymous review
sites. **Events** lists neighbourhood gatherings with RSVP and a live going-count.
**Profile** shows your stats and lets you edit your identity. **Premium** offers
an optional membership that unlocks power features and visibly funds the
project, without ever paywalling core neighbourhood communication.

The app installs to the home screen, works offline, remembers your preferences
across reloads, and ships in both light and dark themes that toggle instantly.
It does all of this from a few kilobytes of hand-written HTML, CSS, and
JavaScript — no framework, no bundler, no `npm install`.

---

## How it is built

The codebase is intentionally tiny and inspectable. `index.html` is the app
shell: the app bar, category bar, six tab sections, the post-creation modal, the
bottom navigation, and the toast stack. `css/theme.css` is the entire design
system, built on CSS custom properties so dark mode is a single attribute flip
on the root element. `js/data.js` holds the seed content — neighbourhoods,
categories, professionals, events, notifications, and a dozen starter posts —
exposed on `window.BT_DATA`. `js/storage.js` is the `Store` module that
centralises all `localStorage` persistence under a versioned key, so the data
schema lives in exactly one place. `js/app.js` is the application logic:
rendering, tab switching, post creation, likes, comments, theme toggling, and
the toast system. `sw.js` is the service worker that makes the app installable
and offline-capable, and `manifest.json` is the PWA manifest.

The architecture decisions behind this layout — why no framework, why
`localStorage`, why a tab-based SPA, why CSS custom properties for theming, why
toasts instead of `alert()`, why no backend yet, and why a versioned service-
worker cache — are all documented with context and trade-offs in `ADR.md`.

---

## How it is run

There is no build step and no server. To run BlockTrust locally, serve the
repository root with any static file server — `python3 -m http.server 8000`
from the project folder is the canonical example — and open the URL in a
browser. `localhost` is a secure context, so the service worker and PWA
features work as they would in production. To deploy, copy the files to any
static host; `DEPLOYMENT.md` covers GitHub Pages, Netlify, Vercel, S3, nginx,
and Apache. The one operational detail every deployer must know is to bump the
`CACHE_NAME` constant in `sw.js` on each release so the service worker hands
out the fresh files to returning visitors.

---

## How it is governed

BlockTrust is a community project guided by a lightweight, transparent
governance model described fully in `GOVERNANCE.md`. In short: the repository
maintainers hold final responsibility for what merges, but decisions are made
in the open through GitHub Discussions and pull requests. Every contributor —
human or AI — is expected to follow the `CODE_OF_CONDUCT.md`, and the
`CONTRIBUTING.md` file explains the practical mechanics of opening issues,
proposing features, and submitting pull requests. The project's stance on free
speech, moderation, and privacy is explicit and non-negotiable: the only
content removed is hate speech, illegal content, and spam, and user data is
never sold or shared.

Security vulnerabilities are handled privately through the process in
`SECURITY.md`. Licensing is MIT, documented in `LICENSE` and summarised in
`COPYING.md`. The project cites its inspirations and third-party assets in
`CITATIONS.md`.

---

## Where it is going

The `ROADMAP.md` lays out five phases. Phase 1 — the solid, no-backend PWA you
see today — is essentially complete. Phase 2 introduces an *optional* backend
for real accounts and cross-device sync, designed so the static, no-backend
path keeps working. Phase 3 turns the reward-escrow and premium concepts into
working economic primitives that incentivise helpfulness without creating a
surveillance economy. Phase 4 wraps the web app in native mobile shells and
adds deep integrations. Phase 5 invests in moderation tooling and community
self-governance, including an optional federation layer so independent
BlockTrust instances can interoperate.

Anyone can influence the roadmap by opening a Discussion prefixed `Roadmap:`.
Large architectural additions require an accompanying Architecture Decision
Record.

---

## Quick links

- **Run and deploy:** `README.md`, `DEPLOYMENT.md`, `usage.md`
- **Contribute:** `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `GOVERNANCE.md`
- **Understand the architecture:** `ADR.md`, `CLAUDE.md`, `AGENTS.md`
- **Track progress and direction:** `ROADMAP.md`, `CHANGELOG.md`, `todo.md`
- **Legal and credit:** `LICENSE`, `COPYING.md`, `CITATIONS.md`, `SECURITY.md`
- **Get help:** `SUPPORT.md`, the wiki, and GitHub Discussions

Welcome to the block.
