# BlockTrust — Public Project Todo

This is the community-visible todo list for BlockTrust. It tracks the work that
is in flight or planned for the current phase, so contributors can see what is
being worked on, pick up something that is unclaimed, and avoid duplicating
effort. Unlike the Roadmap (which describes the long-term vision across phases),
this file is the short-term, actionable list. It is updated as work progresses
and trimmed as items ship.

If you would like to take on an item, comment on the relevant issue or
Discussion, or open a draft pull request referencing it so others know it is
claimed. Items marked **(good first issue)** are suitable for new contributors.

---

## Phase 1 — Solid Foundation (in progress)

### In flight
- [ ] Wire up cross-post search across the Home feed, Pros directory, and
      Events (the search input exists; the handler is a stub).
- [ ] Add a Settings panel with neighbourhood selector, data export to JSON,
      and one-tap `Store.reset()`.

### Planned — polish
- [ ] **(good first issue)** Add pull-to-refresh on the Home feed.
- [ ] **(good first issue)** Make like/comment interactions optimistic so the UI
      updates before persistence confirms.
- [ ] **(good first issue)** Improve keyboard accessibility on the post modal:
      focus trap, Escape to close, Enter to submit.
- [ ] **(good first issue)** Add `aria-label`s to the FAB stack and icon-only
      buttons for screen readers.
- [ ] Add empty-state illustrations for Pros and Events when there is no
      content.
- [ ] Add a "load more" / pagination affordance for long feeds.

### Planned — content
- [ ] Expand seed data in `js/data.js`: more neighbourhoods, more pros, more
      events, richer starter posts.
- [ ] Add a second seed user so the Profile and author flows feel less lonely.

---

## Phase 2 — Optional Backend (research / design)

These items are design and discussion work, not yet implementation. Each will
need an ADR before code lands.

- [ ] Draft ADR for the sync protocol and the `Store` adapter interface.
- [ ] Prototype a magic-link / passkey authentication flow with no passwords.
- [ ] Define the minimal server-side data model for posts, comments, and
      notifications.
- [ ] Spec the `localStorage` ↔ server reconciliation logic.
- [ ] Investigate neighbourhood boundary sources (geo / admin).

---

## Maintenance

- [ ] Review and bump `CACHE_NAME` in `sw.js` for the next release.
- [ ] Sweep the wiki for accuracy against the current codebase.
- [ ] Triage stale issues and Discussions; close or label.

---

## Done (recent)

- [x] Community file suite (templates, conduct, governance, security, docs).
- [x] v2.0.0 rebuild: multi-file vanilla-JS PWA with six tabs, theme system,
      `Store`, toasts, service worker.

---

## How this list is maintained

The Lead Maintainer and maintainers keep this file current. Anyone may propose
an addition by opening a Discussion prefixed `Todo:` with a description and,
where possible, a suggested scope. Proposed items that the maintainers accept
are added here. Completed items are moved to the *Done* section with the release
they shipped in, and eventually archived to the `CHANGELOG.md`.
