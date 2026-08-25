<div align="center">

# 🏡 BlockTrust — Your Block, Your Voice

**A modern, free-speech neighborhood social platform for neighbors to connect, share alerts, find trusted local pros, and support each other.**

A zero-dependency, vanilla-JavaScript Progressive Web App — no framework, no build step, no `npm install`. Just open it and run.

</div>

---

## ✨ What's New (v2.0.0 — the 300% upgrade)

BlockTrust was rebuilt from a static single-file demo into a polished, fully-interactive, installable PWA with real data persistence, a full design system, and a complete community/governance file suite.

### 🎨 Design
- Modern **design system** built on CSS custom properties, with glassmorphism app bar, refined typography, and micro-interactions.
- **Dark / Light theme** toggle, instant and flicker-free, persisted across reloads.
- Smooth animations, skeleton/empty states, and a **toast notification system** (no more `alert()`).
- Fully **responsive**, mobile-first, with floating action buttons and a five-item bottom nav.

### ⚙️ Working Features (no more "coming soon")
- **Interactive feed** — like, comment, save/bookmark, and category filtering.
- **Create posts** with category picker, title, body, image, reward, and urgent/boost flags.
- **localStorage persistence** via a central `Store` module — posts, likes, saves, theme, profile & RSVPs survive reloads.
- **Alerts / Notifications** center with unread state and mark-as-read.
- **Verified Local Pros** directory with ratings, badges, and contact actions.
- **Community Events** with RSVP and a live going-count.
- **Profile** page with editable identity, stats, and saved posts.
- **Premium** subscription flow with badge unlock.
- **Neighborhood switcher** (8 neighborhoods).
- **Free-speech card** for uncensored community conversation.

### 📦 Rich Demo Data
- 8 neighborhoods, 8 categories, **12 seed posts**, **6 verified pros**, **5 events**, **6 notifications** — realistic content out of the box.

### 📱 PWA
- Installable, offline-ready service worker with cache versioning, app manifest with SVG icon.

---

## 🗂️ Project Structure

```
BlockTrust-main/
├── index.html              # App shell & all sections
├── css/theme.css           # Full design system + dark mode tokens
├── js/
│   ├── data.js             # Seed posts, pros, events, notifications, categories
│   ├── storage.js          # Store module — localStorage state layer
│   └── app.js              # All app logic (rendering, interactions, tabs)
├── assets/
│   ├── logo.svg            # App icon
│   └── social-preview.png  # Social media preview image
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (offline cache)
├── styles.css              # Stylesheet for standalone Markdown docs
├── LICENSE                 # MIT
├── README.md
│
│   ── Community & governance ──
├── CONTRIBUTING.md         # How to contribute
├── CODE_OF_CONDUCT.md      # Community standards
├── GOVERNANCE.md           # Decision-making & roles
├── SUPPORT.md              # Where to get help
├── SECURITY.md             # Vulnerability reporting
├── COPYING.md              # Plain-language licence summary
├── CITATIONS.md            # Acknowledgements & third-party assets
├── DISCUSSION_TEMPLATE.md  # Starter text for Discussions
│
│   ── Project docs ──
├── ADR.md                  # Architecture Decision Records
├── ROADMAP.md              # Phased project vision
├── DEPLOYMENT.md           # Deployment guide
├── SUMMARY.md              # Two-minute project overview
├── CHANGELOG.md            # Release history
├── todo.md                 # Public, short-term task list
├── usage.md                # End-user guide
├── SOCIAL_PREVIEW.md       # Preview image & generation prompts
│
│   ── AI agent guidance ──
├── CLAUDE.md               # Project rules for AI agents
├── AGENTS.md               # Operating manual for AI agents
│
│   ── Templates (root copies) ──
├── PULL_REQUEST_TEMPLATE.md
├── bug_report.md
├── feature_request.md
│
│   ── .github/ ──
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── DISCUSSION_WELCOME_README.md
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       ├── feature_request.md
│       ├── custom.md
│       └── config.yml
│
│   ── Wiki ──
└── wiki/
    ├── Home.md
    ├── Getting-Started.md
    ├── Architecture-Overview.md
    ├── Component-Guide.md
    ├── Data-Layer-Guide.md
    ├── Theming-Guide.md
    ├── Deployment-Recipes.md
    ├── Free-Speech-and-Moderation.md
    └── Glossary.md
```

---

## 🚀 Run Locally

There is no build step and no server code. Any static file server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

`localhost` is a secure context, so the service worker and PWA features work as they would in production.

> **Service worker gotcha:** if your edits don't appear after a refresh, the SW is serving a cached copy. Unregister it in DevTools → Application → Service Workers, or run in the console:
> ```js
> navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister())).then(() => location.reload());
> ```
> See `DEPLOYMENT.md` and `ADR-0007` for the full story.

---

## 🌐 Deploy

BlockTrust is fully client-side — copy the files to any static host. See `DEPLOYMENT.md` for GitHub Pages, Netlify, Vercel, S3+CloudFront, nginx, and Apache recipes, plus the post-deploy verification checklist.

The one operational rule: **bump `CACHE_NAME` in `sw.js` on each release** so returning users receive the update.

---

## 🛠️ Tech Stack
- **Frontend:** Vanilla HTML, CSS, JavaScript — no framework, no build step, no dependencies.
- **Persistence:** `localStorage` via the `Store` module.
- **PWA:** Web App Manifest + Service Worker with cache versioning.
- **Icons:** Font Awesome 6 (CDN), emoji.
- **Fonts:** Inter (Google Fonts CDN).
- **Theming:** CSS custom properties + `data-theme` attribute.

---

## 🤝 Contributing

Contributions are welcome! Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full guide. The short version: clone, serve, edit, refresh, open a pull request following the [PR template](./.github/PULL_REQUEST_TEMPLATE.md). New contributors — look for issues labelled `good first issue`.

Please read [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) before participating. BlockTrust's free-speech stance is core to the project: the only content removed is hate speech, illegal content, and spam. See [`GOVERNANCE.md`](./GOVERNANCE.md) and the wiki's [Free Speech & Moderation](./wiki/Free-Speech-and-Moderation.md) page.

---

## 📚 Documentation

| Want to… | Read |
|----------|------|
| Get a two-minute overview | [`SUMMARY.md`](./SUMMARY.md) |
| Run or deploy | [`DEPLOYMENT.md`](./DEPLOYMENT.md), [`usage.md`](./usage.md) |
| Understand the architecture | [`ADR.md`](./ADR.md), [Architecture Overview](./wiki/Architecture-Overview.md) |
| See what's planned | [`ROADMAP.md`](./ROADMAP.md), [`todo.md`](./todo.md) |
| Contribute code | [`CONTRIBUTING.md`](./CONTRIBUTING.md), [`CLAUDE.md`](./CLAUDE.md), [`AGENTS.md`](./AGENTS.md) |
| Get help | [`SUPPORT.md`](./SUPPORT.md), [Discussions](https://github.com/discussions) |
| Report a security issue | [`SECURITY.md`](./SECURITY.md) |
| Browse the wiki | [Wiki Home](./wiki/Home.md) |

---

## 🔒 Privacy

In the current version, all your data — posts, likes, saves, RSVPs, profile, theme — lives in your browser's `localStorage` and never leaves your device. A future optional backend (see `ROADMAP.md` Phase 2) will minimise stored data, support full deletion, and never sell or share it.

---

## 📄 License

MIT — see [`LICENSE`](./LICENSE). A plain-language summary is in [`COPYING.md`](./COPYING.md).

---

<div align="center">

Built with ❤️ for neighborhoods. **Your block, your voice.**

</div>
