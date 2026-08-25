# Security Policy

BlockTrust takes the security of its users and its codebase seriously. This
document explains how to report a vulnerability, what to expect once you do, and
the versions of the project that are currently eligible for security fixes. If
you believe you have found a security issue, please read this page carefully
before reporting — following the process below protects users while a fix is
prepared and gets you a faster, more useful response.

Because BlockTrust is a client-only Progressive Web App in its current phase,
the security surface is smaller than a typical web service: there is no server,
no database, and no user accounts to compromise. Nonetheless, client-side issues
matter. Cross-site scripting through user-generated content, service-worker
cache poisoning, insecure manifest or permission requests, and any flaw that
could leak a user's locally-stored data are all in scope. When a backend is
introduced in a later phase, this policy will expand to cover server-side
reporting.

---

## Reporting a vulnerability

**Do not open a public GitHub issue or Discussion for security reports.**
Public reports expose users to attack before a fix is available. Instead,
report privately using one of these methods:

1. **GitHub Security Advisories** (preferred). In the repository, go to the
   *Security* tab → *Advisories* → *New draft security advisory*. This keeps the
   report private to the maintainers and lets us coordinate a fix and a
   coordinated disclosure.
2. **Email.** If you cannot use advisories, send the details to the project's
   security contact listed in the repository's *Security* tab or in
   `SUPPORT.md`. Encrypt sensitive reports if possible; the maintainer public
   key, if published, will be linked from the same place.

Please include, where applicable:

- A description of the issue and its impact.
- The steps to reproduce, including the browser and version.
- The relevant file or code path (e.g. `js/app.js`, `sw.js`).
- Any proof-of-concept, kept minimal.
- Your preferred public credit name, or a request to remain anonymous.

---

## What to expect

We acknowledge every valid security report within **48 hours**. After
acknowledgement, we will:

- Confirm the issue and assess its severity and scope.
- Work with you to coordinate a fix and a disclosure timeline.
- Develop and test a patch.
- Release the fix and, once users have had a reasonable window to update,
  publish a security advisory crediting you (unless you prefer to remain
  anonymous).

We do not currently offer a monetary bug bounty, as the project is volunteer-
run. We are deeply grateful for responsible disclosure and will recognise
contributors publicly in our advisories and release notes.

---

## Supported versions

BlockTrust is in active development and only the latest minor release receives
security fixes. When a new version is released, the previous version is
supported for critical security fixes for a short grace period, after which
users are expected to update. Because the app is a static PWA with a
self-updating service worker, most users receive updates automatically on their
next visit.

| Version | Supported          | Notes |
|---------|--------------------|-------|
| 2.x     | ✅ Current         | Active development. |
| 1.x     | ❌ End of life     | The single-file demo; superseded by 2.0.0. |

---

## Scope and out of scope

**In scope:**

- Cross-site scripting (XSS) via user-generated posts, comments, or profile
  fields.
- Service-worker cache poisoning or stale-cache disclosure of sensitive data.
- Insecure manifest configuration, overly broad permissions, or mixed-content
  issues on deployed instances.
- Any flaw that exposes a user's `localStorage` data to an unauthorised party.
- Vulnerabilities in the build/deploy path (e.g. if a dependency were ever
  introduced — currently none exist).

**Out of scope:**

- Reports that require physical access to the user's unlocked device.
- Bugs that can only be reproduced by a user intentionally sabotaging their own
  local data.
- Issues in third-party hosting platforms (GitHub Pages, Netlify, etc.) rather
  than in BlockTrust itself.
- Spam or content-moderation concerns — those belong in Discussions or the
  Code of Conduct process, not here.

---

## Safe content handling

BlockTrust renders user-generated content into the DOM. The current
implementation uses `innerHTML` with template literals assembled from seed and
user data. Contributors extending the rendering path must ensure that any text
sourced from user input is treated as text, not as HTML, to prevent script
injection. When in doubt, escape user-provided strings before interpolating
them. A future hardening task (tracked in the public `todo.md`) is to introduce
a single `escapeHtml()` helper used at every injection point.

Thank you for helping keep BlockTrust and its users safe.
