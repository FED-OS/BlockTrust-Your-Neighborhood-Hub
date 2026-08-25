# Getting Started

This page gets you from a fresh clone to a running BlockTrust app in your
browser as fast as possible, then points you at the next things to read. It is
the friendly companion to the root `README.md` and `CONTRIBUTING.md`, with the
common pitfalls called out explicitly so you do not lose an hour to them.

---

## Prerequisites

You need a modern web browser (Chrome, Edge, Firefox, or Safari) and a way to
serve static files over HTTP. No Node.js, no package manager, no build tools.
If you have Python 3 installed, you already have a static server via
`python3 -m http.server`. If you do not, any other static server — `npx serve`,
`php -S localhost:8000`, a VS Code live-server extension — works equally well.

---

## Step 1 — Get the code

Fork the repository on GitHub and clone your fork, or clone the canonical repo
if you just want to run it:

```bash
git clone <your-fork-url>
cd BlockTrust-main
```

There is nothing to install. The repository contains the running app.

---

## Step 2 — Serve it

From the repository root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser. The app loads with no console
errors and you land on the Home feed.

`localhost` is a secure context, which matters: service workers and PWA
features only run on secure origins, so the app's offline caching and
installability work here just as they would in production.

---

## Step 3 — Have a look around

Click through the six tabs in the bottom navigation: Home, Alerts, Pros, Events,
Profile, Premium. Toggle the theme with the button in the app bar. Create a post
with the central **+** button and watch it appear at the top of the feed. Like
a post, comment on it, save it. Reload the page — everything you did persists,
because it is all stored in your browser's `localStorage`.

---

## The one pitfall to know: the service worker

Almost every new contributor hits this once. You edit a file, refresh, and
nothing changes. The service worker is serving a cached copy of the app.

The fix, while developing:

- In DevTools → Application → Service Workers, check **Update on reload**, or
  click **Unregister**, then reload. Or run in the console:

  ```js
  navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister())).then(() => location.reload());
  ```

For a real release, you bump `CACHE_NAME` in `sw.js` so installed users get the
update. This is covered in `DEPLOYMENT.md` and `ADR-0007`.

---

## Step 4 — Make a change

Pick something small. A good first change is adding a seed post to
`js/data.js`: copy an existing entry in `SEED_POSTS`, change the text, save,
clear the service worker as above, and reload. Your post appears in the feed.

For anything beyond a seed edit, read `CONTRIBUTING.md` for the hard rules
(no frameworks, persistence through `Store`, toasts not alerts, theme-aware
CSS, mobile-first) and `CLAUDE.md` / `AGENTS.md` for the conventions.

---

## Where to go next

- [Architecture Overview](./Architecture-Overview) — understand the files.
- [Component Guide](./Component-Guide) — build a new UI piece the right way.
- [Data Layer Guide](./Data-Layer-Guide) — work with `Store` and seed data.
- `ROADMAP.md` — see what is planned and where your help fits.
- GitHub Discussions — ask questions, propose ideas, meet the community.

You are now running BlockTrust. Welcome aboard.
