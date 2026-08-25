# Citations and Acknowledgements

BlockTrust is built from original source code and uses no third-party
JavaScript libraries, CSS frameworks, or build tools. This page exists to record
the standards, inspirations, and external assets that influenced or appear in
the project, so that credit is visible and licence obligations are met. It is
updated whenever a new external dependency or asset is introduced; if you add
one in a pull request, add a row here and confirm compatibility with the MIT
licence.

---

## Web standards and platform features used

BlockTrust relies solely on features built into modern web browsers. No
polyfills are shipped. The following standards make the app possible:

- **HTML5** — the document structure and semantic elements in `index.html`.
- **CSS Custom Properties (CSS Variables)** — the theming system in
  `css/theme.css` that powers light and dark modes.
- **CSS Flexbox and Grid** — layout throughout the design system.
- **Service Workers (W3C)** — offline caching and PWA installability in `sw.js`.
- **Web App Manifest** — installability metadata in `manifest.json`.
- **Web Storage (`localStorage`)** — client-side persistence in `js/storage.js`.
- **Fetch API** — used by the service worker for network-first caching.

These are open web standards, not third-party code, so no attribution or
licence obligation attaches to them beyond using a standards-compliant browser.

---

## Design and product inspirations

BlockTrust's product concept — a neighbourhood-scale, free-speech-friendly
social space with alerts, a pros directory, events, and a reward model — is
inspired by the gap left by incumbent neighbourhood platforms that prioritise
advertising and surveillance over community trust. The project deliberately
takes the opposite stance on data and speech, as documented in `GOVERNANCE.md`.

The clean, mobile-first, card-based visual language draws broadly from modern
progressive web app conventions rather than any single design system. No
proprietary design assets were copied. The BlockTrust logo (`assets/logo.svg`)
is an original work created for this project and is covered by the project's
MIT licence.

---

## Community and documentation standards

Several project files follow widely-used community templates so that
contributors find familiar structures:

- The **Code of Conduct** adapts the spirit of the Contributor Covenant, the
  de-facto standard for open-source community codes. The Contributor Covenant
  is licensed under CC BY 4.0; our adapted text is original wording that
  reflects BlockTrust's free-speech stance and is released under the project's
  MIT licence.
- The **issue and pull-request templates**, **SECURITY policy**, and
  **GOVERNANCE** structure follow conventions popularised by GitHub's own
  community-file guidelines. The wording is original.

These inspirations are acknowledged so contributors understand the lineage;
they impose no licence obligation on BlockTrust.

---

## Third-party assets

| Asset | Location | Licence | Notes |
|-------|----------|---------|-------|
| BlockTrust logo | `assets/logo.svg` | MIT (project) | Original work. |
| Seed post imagery | — | — | Seed posts use CSS gradients (`imageBg`) rather than external images, so no image assets are bundled. |

If a future release bundles external images, fonts, or icons, they must be
listed here with their licence and source URL, and confirmed compatible with
MIT. Prefer CC0, MIT, BSD, or Apache-2.0 assets; avoid GPL-only assets because
they would force a licence change on the whole project.

---

## Fonts

BlockTrust uses the browser's default system font stack (no web fonts are
loaded). This keeps the app fast, offline-friendly, and free of font-licensing
concerns. If a web font is introduced later, it must be listed in the table
above with its licence.

---

## How to add a citation

When your pull request introduces a new external dependency, asset, or
substantial inspiration:

1. Add a row to the relevant table above with the asset name, location,
   licence, and a short note.
2. Confirm the licence is compatible with MIT. If unsure, open a Discussion
   before merging.
3. If the licence requires attribution in the UI or docs, add it where required.
4. Update `CHANGELOG.md` to mention the new dependency.

This keeps BlockTrust honest about what it stands on.
