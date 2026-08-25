# BlockTrust Governance

This document describes how decisions are made in the BlockTrust project, who
makes them, and how power is kept transparent and accountable. BlockTrust is a
community-owned, open-source project under the MIT licence, and its governance
is designed to be lightweight, visible, and resistant to capture. The goal is
the minimum structure necessary to keep the project healthy, inclusive, and true
to its mission of a free-speech-friendly, privacy-respecting neighbourhood
social platform.

Governance here means three things: **decision-making** (how code and policy
changes are proposed, reviewed, and accepted or rejected), **community
standards** (how we treat each other, enforced through the Code of Conduct), and
**product direction** (what gets built, captured in the Roadmap and influenced
through Discussions). Each is addressed below.

---

## Roles

### Contributors

Anyone who opens an issue, writes a pull request, answers a question, or
participates in a Discussion is a contributor. Contributors do not need any
formal status to participate. All contributions are reviewed under the same
standards described in `CONTRIBUTING.md`.

### Maintainers

Maintainers are contributors who have earned the trust of the community through
sustained, high-quality work and who have been granted write access to the
repository. Maintainers review pull requests, triage issues, merge accepted
changes, and steward the Roadmap. A maintainer is added by nomination in a
public Discussion followed by a consensus agreement among existing maintainers;
a maintainer may step down at any time, and may be removed for Code of Conduct
violations through the process in that document.

### Lead Maintainer

The Lead Maintainer is the maintainer with final responsibility for the
repository, including break-glass access and the authority to make urgent
decisions (e.g. reverting a harmful commit or responding to a security
incident). The Lead Maintainer role exists to ensure there is always someone
accountable; it is not a dictatorship. Routine decisions are made collectively
by the maintainers, and the Lead is expected to defer to consensus except in
emergencies. The Lead can be replaced by a maintainer vote.

---

## Decision-making

BlockTrust uses a **consensus-seeking** model with a clear escalation path. The
vast majority of decisions — bug fixes, features, docs, design tweaks — are made
through the normal pull-request workflow: a contributor proposes, maintainers
and the community review, and a maintainer merges once there is agreement and
the checks in `CONTRIBUTING.md` are satisfied.

For larger decisions that affect architecture, policy, or direction, the
process is:

1. **Propose** in a GitHub Discussion in the relevant category (Ideas for
   features, Announcements for policy, Q&A for clarification). Architectural
   changes require an Architecture Decision Record (see `ADR.md`).
2. **Discuss** openly. Maintainers facilitate, summarise points of contention,
   and seek common ground.
3. **Decide.** If consensus is reached, the proposal is accepted and a pull
   request implements it. If consensus cannot be reached after a good-faith
   effort, the maintainers hold a vote; a simple majority of maintainers
   decides, with the Lead Maintainer breaking ties.
4. **Record.** Every significant decision is recorded in an ADR, a CHANGELOG
   entry, or a governance commit so the reasoning is visible to future
   contributors.

Urgent decisions — a security vulnerability, a legal threat, or a harmful
commit — may be made immediately by any maintainer and reported to the rest
afterward. The Lead Maintainer has the authority to act unilaterally in a
genuine emergency and must document the action within 24 hours.

---

## Community standards

All participants — contributors, maintainers, and users — are bound by the
`CODE_OF_CONDUCT.md`. The Code of Conduct is enforced by maintainers, with the
Lead Maintainer as final arbiter. Enforcement is documented but kept private
where necessary to protect the people involved; aggregate trends may be
discussed publicly without identifying individuals.

BlockTrust's free-speech stance is a community standard, not in tension with the
Code of Conduct. The rule is simple: the only content the project removes or
censors is **hate speech, illegal content, and spam**. Everything else is
protected, even when it is unpopular or uncomfortable. This applies to the
project's own spaces (Discussions, issues, the wiki) and is the default policy
the software ships with for instances operators may run. Maintainers who attempt
to censor lawful, non-hateful speech outside those three categories are acting
against the project's mission and should be challenged through governance.

---

## Product direction

The `ROADMAP.md` is the project's shared vision. It is maintained by the
maintainers but shaped by the community. Anyone can propose a change to the
Roadmap by opening a Discussion prefixed `Roadmap:`; proposals that gather
support are promoted into the file via pull request. Major directional shifts
require both a Discussion and, where architectural, an ADR.

The Roadmap is deliberately phased so that each phase is independently useful.
No phase is allowed to compromise the project's core properties: no build step,
no surveillance, no paywalling of core neighbourhood communication, and no
censorship beyond the three categories above.

---

## Transparency

Governance is only legitimate when it is visible. To that end:

- All decisions happen in public GitHub spaces (issues, pull requests,
  Discussions, the wiki) except where privacy is required to protect
  individuals (e.g. Code of Conduct reports or security reports before a fix
  is available).
- Maintainer nominations, votes, and role changes are announced in Discussions.
- Every architectural decision is recorded in `ADR.md`.
- Every release is recorded in `CHANGELOG.md`.
- The project's finances, if any (e.g. Premium revenue, sponsorship), are
  reported publicly on a regular cadence once they exist.

---

## Privacy and data

BlockTrust's governance extends to the data the project itself holds. Today the
project holds no user data — the app is client-only and stores everything in the
user's browser. When a backend is introduced per the Roadmap, the governance
commitments are:

- Collect the minimum data necessary to provide the service.
- Never sell or share user data with third parties.
- Support full deletion of a user's data on request.
- Publish what data is stored and why, in plain language.

These are not aspirations; they are conditions the maintainers agree to uphold
and that the community can hold them to.

---

## Changes to this document

This governance model is itself governed by the same process it describes.
Substantive changes to `GOVERNANCE.md` require a public Discussion, an ADR-style
record of the reasoning, and maintainer consensus. Editorial corrections may be
made via normal pull request.

If you believe governance is being abused, the path is: raise it in a
Discussion, or, if that is not safe, contact the Lead Maintainer privately. The
project exists for its community, not the other way around.
