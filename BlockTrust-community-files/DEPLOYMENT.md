# Deployment Guide

BlockTrust is a static Progressive Web App: there is no server code to run, no
database to provision, and no build step to execute. Deployment is, in the
simplest case, copying a handful of files to any static host. This guide walks
through the supported deployment targets, the environment requirements, the
service-worker cache considerations that catch first-time deployers, and the
post-deploy verification checklist. Read it once before your first deploy and
keep the cache-section handy — it is the single most common source of "my update
didn't ship" reports.

Because the app is dependency-free, every deployment target produces the same
result as long as it serves the files over HTTPS with correct MIME types and
honours the relative paths in `index.html`. There is no `.env` to fill in and no
secrets to manage; the only configuration is the service-worker cache version,
which you bump per release.

---

## Prerequisites

Before deploying you need the BlockTrust source tree, which is just the contents
of the repository root:

```
index.html
manifest.json
sw.js
css/theme.css
js/data.js
js/storage.js
js/app.js
assets/logo.svg
```

No `node_modules`, no `dist/`, no compiled output. Whatever is in the repository
is exactly what gets served. Ensure you are deploying from a clean checkout with
no uncommitted changes so that the deployed bytes match a known commit.

You also need a host that serves over **HTTPS**. Service workers — and therefore
PWA installability and offline support — only function on a secure origin.
`http://localhost` is treated as secure for local testing, but any public
deployment must be HTTPS.

---

## Option A — GitHub Pages (recommended for the canonical project)

GitHub Pages is free, HTTPS by default, and keeps the deployed site next to the
source.

1. Push the repository to GitHub.
2. In the repo settings, go to **Pages**.
3. Set **Source** to `Deploy from a branch`, choose your default branch, and
   set the folder to `/ (root)`.
4. Save. The site goes live at `https://<user>.github.io/BlockTrust/` within a
   minute.

If the repository is named something other than the project root, or if you
deploy from a `docs/` folder, adjust accordingly. Because BlockTrust uses only
relative paths, it works correctly even under a project-page subpath.

**Cache note:** after each release, bump `CACHE_NAME` in `sw.js` (e.g.
`blocktrust-v2` → `blocktrust-v3`) so returning users get the new version on
their next visit. Commit the bump in the same release.

---

## Option B — Netlify or Vercel (drag-and-drop or Git-connected)

Both hosts offer instant static deploys.

For a **drag-and-drop** deploy, zip the repository root and drop it onto the
Netlify or Vercel dashboard. No build command, no publish directory
configuration beyond pointing at the root.

For a **Git-connected** deploy, import the repository and set:

- Build command: *(leave empty)*
- Publish directory: `/` (or `.`)

Every push to the connected branch triggers a new deploy. Remember to bump
`CACHE_NAME` in `sw.js` as part of each release commit so the service worker
hands out the fresh files.

---

## Option C — Any static file host (S3, Cloudflare Pages, nginx, Apache)

BlockTrust runs anywhere static files are served.

- **S3 + CloudFront:** upload the files to a bucket, enable static website
  hosting, and front it with CloudFront for HTTPS. Set the default root object
  to `index.html`.
- **Cloudflare Pages:** connect the repo or upload the folder; no build step.
- **nginx:** point a server block's `root` at the deployed directory and add
  `try_files $uri /index.html` so deep links resolve.
- **Apache:** drop the files in a virtual host's document root; an optional
  `.htaccess` with `FallbackResource /index.html` handles deep links.

Ensure the host serves `.svg` as `image/svg+xml`, `.json` as
`application/json`, and `.js` as `text/javascript`. Almost all hosts do this
correctly by default.

---

## Option D — Local preview

For development or local demos, serve the directory with any static server.
From the repository root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Any port works; `localhost` is a secure
context so the service worker and PWA features function. For testing the
offline behaviour, use the browser's DevTools *Application → Service Workers →
Offline* toggle rather than killing the server, so the SW lifecycle stays
predictable.

---

## The service-worker cache (read this once)

`sw.js` caches the core files on install and serves them network-first with a
cache fallback. This means updates appear on the *next* page load after the new
service worker activates, not instantly. Two practical implications:

1. **Always bump `CACHE_NAME`** in `sw.js` when you ship a release. The
   constant looks like `const CACHE_NAME = 'blocktrust-v2';`. Increment the
   number. On the next visit, the browser detects the new name, installs the
   new SW, and swaps the cache.
2. **When debugging locally**, the SW can mask your edits. If a change is not
   showing up, unregister the SW and clear storage from DevTools
   (*Application → Service Workers → Unregister* and *Clear site data*), or run
   this in the console:

   ```js
   navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister())).then(() => location.reload());
   ```

These gotchas are documented in `AGENTS.md` and `ADR-0007` as well.

---

## Post-deploy verification checklist

After deploying, walk through this list in a fresh browser profile (or after
clearing site data) so you see what a new visitor sees:

- [ ] The app loads with no console errors.
- [ ] Light and dark themes both toggle and look correct.
- [ ] Creating a post places it at the top of the Home feed and persists after
      reload.
- [ ] Liking, commenting, and saving work and persist.
- [ ] The Alerts tab shows notifications and marks them read.
- [ ] The Pros directory renders pro cards.
- [ ] Events render and RSVP updates the going-count.
- [ ] Profile shows stats and the edit flow works.
- [ ] Premium subscribe unlocks the badge and toasts confirmation.
- [ ] The app is installable (the browser shows an install prompt or *Install
      app* menu item).
- [ ] With the server stopped and offline toggled in DevTools, the app still
      loads from cache.

If any item fails, first rule out a stale service worker before investigating
the code.

---

## Rollback

Because each deploy is a static file set tagged to a commit, rollback is
trivial: redeploy the previous commit. If a bad `CACHE_NAME` bump shipped,
users on the bad version will pick up the rolled-back version on their next
visit because the rollback commit's SW activates and takes over the cache. There
is no database to restore and no migration to reverse.
