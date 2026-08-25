---
name: Bug report
about: Report something that is broken or behaves incorrectly
title: "[BUG] "
labels: bug
assignees: ""
---

## Describe the bug

A clear and concise description of what the bug is.

## Is this actually a bug?

Before filing, please check that your report is not one of these **expected
behaviors** (they are documented, not bugs):

- [ ] **Profanity is not filtered.** Uncensored dictionaries are an intentional
  feature, not a bug. Do not report swear words appearing in output.
- [ ] **Grammar / word order is not reshuffled.** This is phrase substitution,
  not a neural model. Output reads like a phrasebook. (See README → "The Honest
  Tradeoff".)
- [ ] **Unknown words pass through unchanged.** If a word is not in the
  dictionary, it appears verbatim in the output. This is by design — add it to
  the dictionary instead of filing a bug.
- [ ] **Pivot pairs can be rougher than direct pairs.** A two-step
  `X → English → Y` translation may lose nuance. This is a known tradeoff.

If your issue is one of the above, it is **not a bug** — close this and consider
a `feature_request` instead (e.g. "add dictionary entries for X").

## To reproduce

Steps to reproduce the behavior:

1. Open `index.html`
2. Set source language to: `<language>`
3. Set target language to: `<language>`
4. Type: `<exact input text>`
5. See output: `<what you got>`

## Expected behavior

What you expected to see, and why.

## Actual behavior

What you actually saw.

## Language pair

- Source: `<code, e.g. en>`
- Target: `<code, e.g. es>`

## Input / output

```
Input:   <paste exact input>
Output:  <paste exact output>
Expected: <paste what you expected, if different>
```

## Environment

- Browser + version: `<e.g. Firefox 124>`
- OS: `<e.g. Linux>`
- How did you run it: `[ ] opened index.html directly  [ ] static server  [ ] embedded elsewhere`
- Project version / commit: `<git SHA or "v1.0.0">`

## Does it reproduce with `node test_engine.js`?

If you can reproduce the bad translation headlessly, paste the line here:

```
node test_engine.js
# [xx->yy] "..."  =>  "..."   <-- the wrong one
```

## Screenshots

If applicable, add screenshots. You can drop them into this issue.

## Additional context

Anything else relevant. If you have a suggested dictionary fix, include the
exact entry you would add:

```js
{ en: "...", xx: "..." }
```
