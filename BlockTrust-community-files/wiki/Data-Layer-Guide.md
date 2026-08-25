# Data Layer Guide

This guide covers everything you need to work with data in BlockTrust: the
`Store` module that handles persistence, the seed data in `js/data.js`, and the
patterns for reading and writing state safely. It expands on ADR-0002 (the
`Store` decision) with concrete usage examples. If your change touches anything
that should survive a page reload, read this first.

---

## The Store module

`Store` is an IIFE in `js/storage.js` that is the single gateway to
`localStorage`. It exists so that the data schema lives in one place, so that
schema evolution is controlled, and so that no code scatters raw
`localStorage.getItem` / `setItem` calls that are hard to reason about.

### What Store holds

The defaults object inside `Store` defines the full schema. It currently
includes:

- `theme` — `'light'` or `'dark'`.
- `hood` — the user's selected neighbourhood id.
- `profile` — the user's identity object (name, initials, avatar gradient, bio,
  neighbourhood).
- `posts` — the array of user-created posts (seed posts are merged at read time,
  not stored, so they can be updated by editing `data.js`).
- `liked` — an object mapping post ids to a boolean.
- `saved` — an object mapping post ids to a boolean.
- `notifsRead` — an object mapping notification ids to a boolean.
- `goingEvents` — an object mapping event ids to a boolean.
- `freeSpeechOpen` — a boolean for the free-speech card's open state.
- `premium` — a boolean for the premium subscription flag.

When you need a new piece of durable state, add a key to this defaults object.
`Store.load()` deep-merges saved state over defaults, so existing users get the
new key backfilled automatically with its default value — no migration needed
for additive changes.

### The API

- `Store.load()` — reads `localStorage`, parses it, deep-merges over defaults,
  and caches the result in memory. Called once at startup.
- `Store.save()` — serialises the in-memory state and writes it to
  `localStorage`. Called after every mutation.
- `Store.get(key)` — returns the value of a top-level key from the in-memory
  state.
- `Store.set(key, value)` — sets a top-level key, saves, and returns the value.
- `Store.update(key, fn)` — reads a key, passes its value to `fn`, sets the
  result, saves, and returns it. Use this for nested mutations so you do not
  have to read-modify-write manually.
- `Store.reset()` — clears `localStorage` and reloads defaults. Used for the
  "reset to demo state" affordance and for testing.

### Usage examples

Reading the current theme:

```js
const theme = Store.get('theme'); // 'light' or 'dark'
```

Toggling the theme and persisting:

```js
Store.set('theme', Store.get('theme') === 'dark' ? 'light' : 'dark');
applyTheme();
```

Adding a like to a post:

```js
Store.update('liked', liked => {
  liked[postId] = true;
  return liked;
});
```

Creating a post:

```js
const posts = Store.get('posts');
posts.unshift(newPost);
Store.set('posts', posts);
renderFeed();
toast('Post published', 'success');
```

The pattern is always: read or update via `Store`, save happens automatically
inside `set`/`update`, then re-render the affected DOM.

---

## The seed data

`js/data.js` attaches an object to `window.BT_DATA` containing all the content
that ships with the app. This is the app's "database" in the current no-backend
phase. The shapes are:

- `HOODS` — an array of neighbourhood objects (id, name, descriptor).
- `CATEGORIES` — an array of category ids.
- `CAT_META` — an object mapping category ids to metadata (label, icon, colour).
- `PROS` — an array of professional directory entries.
- `EVENTS` — an array of event objects.
- `NOTIFICATIONS_SEED` — an array of notification objects.
- `SEED_POSTS` — an array of starter post objects, each with id, author,
  initials, avatar gradient, role, hood, timestamp, title, content, category,
  tags, likes, commentList, and optional reward/boosted/image/imageBg fields.

When you want to add content — a new neighbourhood, a new pro, a new event, more
starter posts — you edit the relevant array in `data.js` following the existing
shape. Because seed posts are not stored in `localStorage` (only user-created
posts are), updating the seed is as simple as editing the file; every user sees
the new seed on their next load.

### Merging seed and user data

The app's full post list is the concatenation of the user's `Store.get('posts')`
and `window.BT_DATA.SEED_POSTS`, with user posts shown first. The `allPosts()`
helper in `app.js` performs this merge. Likes and saves are keyed by post id, so
a user can like a seed post and the like persists even though the seed post
itself is not in `localStorage`.

---

## Schema evolution

The storage key is `blocktrust_state_v2`. The `v2` suffix is deliberate: it
lets the project break cleanly from the pre-upgrade `v1` schema without writing
a migration. If a future change makes the schema incompatible (e.g. renaming or
restructuring keys in a way that `load()`'s merge cannot paper over), bump the
key to `blocktrust_state_v3`. Existing users' old state is simply ignored (left
in `localStorage` under the old key) and they start fresh from the new defaults.
This is a blunt instrument — it loses user data — so prefer additive changes
that the merge handles gracefully whenever possible.

For additive changes (adding a new key with a default), no bump is needed; just
add the key to the defaults object. The merge backfills it for everyone.

---

## Testing and reset

Because all state is in `localStorage`, testing is straightforward: call
`Store.reset()` (or clear site data in DevTools) to return to a pristine demo
state. There is no database to tear down. When debugging a data-related bug,
clearing state and reproducing from defaults is almost always the fastest path
to clarity.

---

## Rules to follow

- **Never call `localStorage` directly** outside `js/storage.js`. All access
  goes through `Store`.
- **Add new state to the defaults object**, not as ad-hoc keys.
- **Save after every mutation** — `set` and `update` do this for you; if you
  mutate a nested object in place, call `Store.save()` yourself.
- **Re-render after mutating** so the DOM reflects the new state.
- **Escape user-provided text** before rendering it into HTML.

Following these keeps the data layer predictable and the app's persistence
behaviour consistent.
