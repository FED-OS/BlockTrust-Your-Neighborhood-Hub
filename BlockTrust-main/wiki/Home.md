# BlockTrust Wiki — Home

Welcome to the BlockTrust wiki. This is the long-form knowledge base for the
project: the place for guides, deep dives, and reference material that is too
detailed or too tutorial-shaped for the top-level Markdown files in the
repository root. The root files (`README.md`, `CONTRIBUTING.md`, `ADR.md`,
`ROADMAP.md`, and so on) are the authoritative, always-current source of truth;
the wiki expands on them with examples, walkthroughs, and how-tos.

If you are new to BlockTrust, start with the [Getting Started](./Getting-Started)
page. If you want to understand why the codebase is shaped the way it is, read
[Architecture Overview](./Architecture-Overview). If you are extending the app,
the [Component Guide](./Component-Guide) and [Data Layer Guide](./Data-Layer-Guide)
explain the patterns to follow. For deployment help, see the root
`DEPLOYMENT.md`; the wiki's [Deployment Recipes](./Deployment-Recipes) page
adds extra host-specific notes.

---

## Wiki pages

- **[Getting Started](./Getting-Started)** — from clone to running app in five
  minutes, with the common pitfalls called out.
- **[Architecture Overview](./Architecture-Overview)** — a tour of the files,
  the data flow, and the design principles, expanded from `ADR.md`.
- **[Component Guide](./Component-Guide)** — how each UI component is built and
  how to add a new one that fits the system.
- **[Data Layer Guide](./Data-Layer-Guide)** — working with `Store`, the seed
  data in `data.js`, and the persistence model.
- **[Theming Guide](./Theming-Guide)** — the CSS custom property system, light
  and dark mode, and how to keep new styles theme-aware.
- **[Deployment Recipes](./Deployment-Recipes)** — host-specific notes beyond
  the root `DEPLOYMENT.md`.
- **[Free Speech & Moderation](./Free-Speech-and-Moderation)** — the project's
  content policy in plain language, expanded from `GOVERNANCE.md`.
- **[Glossary](./Glossary)** — terms used in the codebase and community.

---

## How this wiki is maintained

The wiki is part of the repository under the `wiki/` directory and versioned
alongside the code, so it stays in sync with the app it documents. Anyone may
propose changes via pull request; see `CONTRIBUTING.md` for the workflow. When
the codebase changes in a way that invalidates a wiki page, the page should be
updated in the same pull request.

Welcome to the block.
