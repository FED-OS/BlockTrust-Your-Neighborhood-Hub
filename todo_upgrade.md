# BlockTrust 300% Upgrade — Task Tracker

## Architecture overhaul
- [ ] Make app data-driven: posts stored as JS array, rendered dynamically
- [ ] LocalStorage persistence (posts, likes, comments, profile, theme, drafts)
- [ ] Split into modular source files (data, store, render, ui, events) assembled by build.js

## New features
- [ ] Full Comments system (add/view, persisted) — replaces "coming soon" alert
- [ ] Alerts tab (real, with unread badges + notification center)
- [ ] Profile tab (editable user profile, avatar, neighborhood, my-posts, stats)
- [ ] Dark mode (toggle, persisted, system-preference aware)
- [ ] Image attachments on posts (FileReader → base64, persisted)
- [ ] Post composer upgrade: category select, title, image, location field
- [ ] Real like/comment/share with counts persisted
- [ ] Post detail view (click a post → full view with comments)
- [ ] Reward escrow simulation (deposit/claim/release flow with status)
- [ ] Verified-pro / moderator / official badges as real user roles
- [ ] Toast notifications (replace all alert() calls)
- [ ] Empty states + loading skeletons
- [ ] Pull-to-refresh / refresh button
- [ ] Sort options (Recent / Top / Urgent first)

## Polish
- [ ] Improved responsive design + mobile bottom sheet modals
- [ ] Smooth animations/transitions
- [ ] Accessibility (ARIA, keyboard nav, focus traps in modals)
- [ ] PWA upgrade: better service worker (offline app shell), app icons generated

## Docs & meta
- [ ] Upgraded README (features, screenshots, architecture)
- [ ] LICENSE (MIT)
- [ ] CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, SUPPORT.md
- [ ] CHANGELOG.md
- [ ] .gitignore (already good — review)
- [ ] Social preview image

## Verify & deliver
- [ ] Build green, app works end-to-end in browser
- [ ] Screenshots captured (home, dark mode, comments, profile, alerts, composer)
- [ ] All files delivered
