# Getting Support

Thanks for using BlockTrust. This guide points you to the right place depending
on what kind of help you need, so that you get an answer quickly and the right
people see your question. BlockTrust is a community-run project, so most support
happens in the open through other contributors and maintainers rather than a
private helpdesk — which also means your question and its answer help the next
person who has the same issue.

Before opening anything, please spend a minute searching existing issues and
Discussions; the most common questions have already been answered, and a quick
search saves everyone time.

---

## I have a question or want to discuss something

For questions, ideas, feature discussion, and community conversation, use
**GitHub Discussions**. This is the primary community space and the right place
for anything that is not a confirmed bug or a security issue. Discussions are
organised into categories:

- **Announcements** — project news from maintainers.
- **Ideas** — feature proposals and product direction. Prefix Roadmap ideas with
  `Roadmap:`.
- **Q&A** — questions about running, deploying, or extending BlockTrust.
- **Show and tell** — share your instance, fork, or customisation.

The Discussions welcome README in `.github/DISCUSSION_WELCOME_README.md` has the
house rules and quick-start. In short: be civil, stay on topic, and remember the
project's free-speech stance protects everything except hate speech, illegal
content, and spam.

---

## I found a bug

If you can reproduce a concrete defect in the app, open a **bug report** using
the issue template. There is a copy in the repository at
`.github/ISSUE_TEMPLATE/bug_report.md` and a root-level `bug_report.md` for
convenience. A good bug report includes the steps to reproduce, what you
expected, what happened instead, your browser and operating system, and whether
the problem is consistent. Screenshots help enormously. Please check first that
the bug has not already been filed.

One common false-positive: if your changes are not appearing after an edit, the
service worker is likely serving a stale cache. Try unregistering the service
worker and clearing site data (see `DEPLOYMENT.md` and `AGENTS.md`) before
filing — if that fixes it, it is not a BlockTrust bug.

---

## I want to request a feature

Feature requests belong in **Discussions → Ideas** first, so the community can
discuss scope and fit with the Roadmap before anyone writes code. Once a feature
has community support and a maintainer agrees it is in scope, an issue can be
opened with the feature-request template (`.github/ISSUE_TEMPLATE/feature_request.md`
or root `feature_request.md`) to track the implementation work. The template
asks what you want, why you want it, a possible solution, and where it fits in
the app — answering those up front makes the discussion far more productive.

---

## I want to contribute code

See `CONTRIBUTING.md` for the full guide to setting up, running, and submitting
pull requests. The short version: there is no build step, so clone the repo,
serve it locally, make your change, test in a browser, and open a pull request
following the PR template. New contributors are very welcome — look for issues
labelled `good first issue`.

---

## I think the app is misbehaving because of the service worker / cache

This is common enough to deserve its own heading. BlockTrust caches itself for
offline use via a service worker, and that cache can persist an older version of
the app after an update. If the app looks wrong or stale:

1. Open browser DevTools → Application → Service Workers → Unregister.
2. Clear site data (Application → Storage → Clear site data).
3. Reload.

Or, in the console, run:

```js
navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister())).then(() => location.reload());
```

If the problem persists after this, it is a real bug — please file it.

---

## I found a security vulnerability

**Do not open a public issue or Discussion for security problems.** Instead,
follow the private reporting process in `SECURITY.md`. Reporting privately gives
maintainers time to fix the issue before details are public and protects users
in the meantime.

---

## I have a Code of Conduct concern

Reports of harassment or other Code of Conduct violations should be sent to the
maintainers privately. See `CODE_OF_CONDUCT.md` for the reporting path and what
to expect. These reports are handled confidentially to protect the people
involved.

---

## Response expectations

BlockTrust is maintained by volunteers on a best-effort basis. There is no
service-level agreement. As a rough guide, Discussions and issues usually get a
first response within a few days, security reports are acknowledged within 48
hours, and Code of Conduct reports are acknowledged within 24 hours. If you have
not heard back after a week on a non-security matter, a polite follow-up in the
same thread is appropriate.

Thank you for being part of the BlockTrust community.
