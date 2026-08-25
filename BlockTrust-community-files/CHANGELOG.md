# Changelog

All notable changes to the BlockTrust project are documented in this file. The
format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
for its releases. Entries are grouped under `Added`, `Changed`, `Fixed`, and
`Removed` headings within each release. Unreleased work lives under the
`[Unreleased]` heading at the top until it is cut into a versioned release.

---

## [Unreleased]

### Added
- Community and governance file suite: issue templates, PR template, Discussions
  welcome README, `config.yml`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`,
  `SECURITY.md`, `GOVERNANCE.md`, `SUPPORT.md`, `ADR.md`, `ROADMAP.md`,
  `DEPLOYMENT.md`, `SUMMARY.md`, `COPYING.md`, `CITATIONS.md`, `usage.md`,
  `CLAUDE.md`, `AGENTS.md`, a public `todo.md`, and this changelog.
- MIT `LICENSE` file.
- Root-level copies of the pull-request, bug-report, and feature-request
  templates for convenience.
- Project wiki with Home and topic pages.
- Social preview image and preview-prompt documentation.

---

## [2.0.0] — 2025-08-20

The "300% upgrade" release: a complete rebuild of the original single-file demo
into a structured, themeable, offline-capable Progressive Web App, with no
framework, no build step, and no dependencies introduced.

### Added
- Multi-file architecture: `index.html` app shell, `css/theme.css` design
  system, `js/data.js` seed data, `js/storage.js` `Store` module, `js/app.js`
  application logic, `sw.js` service worker, `manifest.json`, `assets/logo.svg`.
- Six functional tabs: Home feed, Alerts, Pros directory, Events, Profile, and
  Premium.
- Design system built on CSS custom properties with full light/dark theme
  toggle, persisted via `Store`.
- `Store` module centralising all `localStorage` persistence under the
  versioned key `blocktrust_state_v2`.
- Post creation modal with category, title, body, urgent/rewarded flags, and
  image support.
- Likes, comments, save-for-later, and category-filter pills on the feed.
- Free-speech card on the Home feed, with open/close state persisted.
- Toast notification system (`success`, `error`, `info`) replacing all native
  `alert`/`confirm`/`prompt` dialogs.
- Events with RSVP and a live going-count.
- Pros directory with contactable local-professional cards.
- Profile tab with stats and inline edit.
- Premium subscription flow that unlocks a profile badge and confirms via toast.
- Bottom navigation plus floating action buttons for Pros and Premium.
- Welcome banner with navigable feature tiles.
- Service worker with cache versioning (`blocktrust-v2`) for installable,
  offline-capable PWA behaviour using a network-first strategy with cache
  fallback.
- Seed data: 8 neighbourhoods, 8 categories, 6 professionals, 5 events, 6
  notifications, and 12 starter posts.

### Changed
- Rebuilt `README.md` to document the new architecture, run instructions, and
  deployment.
- `manifest.json` updated to reference the SVG icon and removed missing
  screenshot assets.

### Removed
- Deleted the legacy standalone `blocktrust.js`; its functionality is now split
  across `js/data.js`, `js/storage.js`, and `js/app.js`.
- Removed references to missing PNG icon and screenshot assets from the
  manifest.

---

## [1.0.0] — 2025-08-15

### Added
- Initial single-file BlockTrust demo: a basic neighbourhood social feed in one
  HTML file with inline CSS and JavaScript, demonstrating the core concept of
  alerts, posts, pros, and events on a single page.

---

## Versioning policy

BlockTrust follows Semantic Versioning. Given a version `MAJOR.MINOR.PATCH`:

- **MAJOR** increments for incompatible changes — e.g. a new architecture that
  requires data migration or breaks deployed instances.
- **MINOR** increments for new features that are backward-compatible.
- **PATCH** increments for backward-compatible bug fixes.

The service-worker `CACHE_NAME` is bumped with every release regardless of the
version number change, so that installed users reliably receive the update.
