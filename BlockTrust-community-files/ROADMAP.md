# BlockTrust Roadmap

This roadmap describes the planned evolution of BlockTrust from its current
state — a polished, single-user, vanilla-JavaScript Progressive Web App — into a
real multi-user neighborhood platform. It is organised into phases that are
intentionally sequenced so that each one is independently shippable and useful.
Dates are estimates, not commitments; the project is community-driven and moves
at the pace of available contributors. Nothing here is a promise, but it is the
shared vision that pull requests and discussions should be measured against.

The guiding principle throughout is that BlockTrust should never lose the
properties that make it special today: it should remain fast, privacy-respecting,
free-speech-protective, and runnable by anyone who can open a browser. Features
that would compromise those properties are explicitly out of scope and belong in
a fork, not the main line.

---

## Phase 1 — Solid Foundation *(current, largely complete)*

The goal of Phase 1 was to take the original single-file demo and rebuild it as a
structured, themeable, offline-capable PWA without introducing a build step or a
framework. That work is done and deployed.

- [x] Split the monolith into `index.html`, `css/theme.css`, `js/data.js`,
      `js/storage.js`, `js/app.js`, `sw.js`, `manifest.json`, and `assets/logo.svg`.
- [x] Design system with CSS custom properties and full light/dark theme toggle.
- [x] `Store` module centralising all `localStorage` persistence under a
      versioned key.
- [x] Six functional tabs: Home feed, Alerts, Pros directory, Events, Profile,
      and Premium.
- [x] Post creation modal, likes, comments, save-for-later, and category pills.
- [x] Toast notification system replacing all native dialogs.
- [x] Service worker with cache versioning for installable offline use.
- [x] Community files: issue/PR templates, code of conduct, contributing guide,
      security policy, governance, ADRs, and AI-agent guidance.

**Remaining polish for Phase 1** (good first issues):

- [ ] Add search across posts, pros, and events (the search input exists but is
      a stub).
- [ ] Add pull-to-refresh and optimistic UI on like/comment.
- [ ] Improve keyboard accessibility and screen-reader labelling on the post
      modal and FAB stack.
- [ ] Add a settings panel for neighbourhood selection, data export, and
      `Store.reset()`.

---

## Phase 2 — Optional Backend & Real Accounts

Phase 2 introduces an *optional* backend so that BlockTrust can become a true
multi-user app while keeping the static, no-backend path alive for anyone who
wants the pure front-end experience. The key design constraint is that the
front-end must not be rewritten; the backend is a drop-in sync layer that the
`Store` module talks to when configured, and falls back to `localStorage` when
not.

- [ ] Define a minimal sync protocol (likely REST + Server-Sent Events) and an
      `adapter` interface inside `Store` so the persistence target is pluggable.
- [ ] User accounts with magic-link or passkey authentication — no passwords.
- [ ] Server-side post storage, real comment threads, and a notification fan-out
      service.
- [ ] Cross-device state sync that reconciles `localStorage` with the server on
      load and on change.
- [ ] Real neighbourhood boundaries (geo or admin-defined) so users see only
      their own block.
- [ ] A reference backend implementation, self-hostable, MIT-licensed, that the
      front-end can point at via a config flag.

This phase is the largest and will be broken into sub-proposals, each with its
own ADR. The free-speech and privacy commitments in the Governance document apply
fully here: the backend must minimise stored data, support end-to-end deletion,
and never sell or share user content.

---

## Phase 3 — Trust, Reputation, and the Reward Escrow

Phase 3 turns BlockTrust's reward-escrow and premium concepts — currently UI-
only — into working economic primitives that incentivise helpful, honest
neighborhood participation without creating a surveillance economy.

- [ ] Define a reputation score derived from neighbour endorsements and verified
      helpful actions, with a public algorithm and no hidden weighting.
- [ ] Implement the reward escrow: a poster stakes a small amount to reward the
      best answer to a question; the stake is released to the chosen responder
      and refundable if unresolved.
- [ ] Premium membership as a real, optional subscription that unlocks power
      features (promoted posts, pro-directory placement, advanced events) and
      funds the project — never paywalls core neighborhood communication.
- [ ] Anti-abuse economics: costed actions for promoted posts to prevent spam
      without silencing legitimate speech.

Money movement will use a third-party processor; BlockTrust will never custody
funds itself in this phase.

---

## Phase 4 — Native Mobile & Deep Integrations

Once the web app and optional backend are stable, Phase 4 wraps BlockTrust in
native shells and connects it to the platforms neighbours already use.

- [ ] Capacitor or Tauri wrapper for iOS and Android, reusing 100% of the web
      codebase, so the app is installable from app stores without a rewrite.
- [ ] Deep linking and share-sheet integration so a neighbour can share a post
      or event into BlockTrust from any other app.
- [ ] Native push notifications routed through the Phase 2 notification service.
- [ ] Optional calendar sync (CalDAV / Google Calendar) for events.
- [ ] Optional import from existing neighborhood groups (with explicit consent
      and a clear mapping flow).

---

## Phase 5 — Moderation Tooling & Community Self-Governance

The final phase invests in the social infrastructure that lets communities
govern themselves at scale while honouring the free-speech stance in the
Governance document.

- [ ] Community-elected moderators per neighbourhood, with transparent logs of
      every action.
- [ ] A federation / interoperability layer so independent BlockTrust instances
      can share public posts across neighborhoods that opt in.
- [ ] An appeals system for any moderation action, with a documented escalation
      path.
- [ ] Public, auditable moderation policy templates that each neighborhood can
      adopt and amend.

---

## How to influence this roadmap

The roadmap is a living document. To propose a change, open a Discussion in the
*Ideas* category with the prefix `Roadmap:` and describe the phase it belongs to,
the problem it solves, and a rough sketch of the work. Proposals that gather
community support are promoted into this file via a pull request. Large
architectural additions require an accompanying ADR (see `ADR.md`).

If you want to work on something already listed here, comment on the relevant
Discussion or open a draft pull request referencing the checklist item so others
don't duplicate effort.
