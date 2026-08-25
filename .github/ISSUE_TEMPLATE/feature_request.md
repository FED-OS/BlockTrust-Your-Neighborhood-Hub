---
name: Feature request
about: Suggest a new dictionary entry, language, or engine improvement
title: "[FEAT] "
labels: enhancement
assignees: ""
---

## Is your feature request related to a problem?

A clear description of the problem. e.g. "I can't translate common food terms
from English to Portuguese because the words aren't in the dictionary."

## The proposed solution

What you want to happen.

### Pick the kind of feature (check one):

- [ ] **New dictionary entries** (more words/phrases for better coverage)
- [ ] **New language** (note: the project is scoped to the top 10 by total
  speakers — adding an 11th changes the scope; explain why)
- [ ] **Engine improvement** (smarter matching, better pivot, etc.)
- [ ] **UI / UX** (layout, controls, accessibility)
- [ ] **Documentation**
- [ ] **Other**

## If this is dictionary entries, list them

Use the exact entry format. One object per line. Provide entries for **all 9**
non-English dictionaries when possible so pivots stay consistent:

```js
{ en: "hello", zh: "你好", hi: "नमस्ते", es: "hola", fr: "bonjour",
  ar: "مرحبا", bn: "হ্যালো", pt: "olá", ru: "привет", ur: "ہیلو" }
```

If you only know a subset, that's fine — list what you have:

```js
{ en: "...", es: "..." }
{ en: "...", fr: "..." }
```

## Alternatives you have considered

Any alternative solutions or features you've considered.

## Tradeoff check

This project is deliberately **offline, dependency-free, and uncensored**.
Features that break any of these are unlikely to be accepted:

- Adding an API / network call → **will be rejected** (core design principle).
- Adding an npm/runtime dependency → **will be rejected**.
- Filtering profanity → **will be rejected** (uncensored by design).
- A neural / ML translation model → out of scope (see README "Honest Tradeoff").

Does your feature respect all three constraints? If not, explain your case.

## Additional context

Screenshots, mockups, links, or anything else.
