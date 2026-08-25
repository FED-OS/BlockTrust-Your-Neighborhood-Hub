# BlockTrust — Usage Guide

This guide is for the people who *use* BlockTrust, not just the people who
develop it. Whether you installed the app on your phone, opened it in a browser,
or are considering running an instance for your own neighbourhood, this document
walks you through every feature, how to use it, and the few behaviours that are
worth knowing in advance. It is written assuming no technical background — if
you can use a web browser, you can use BlockTrust.

BlockTrust is a neighbourhood social app. Think of it as a block party that
lives on your phone: a small, trusted space where neighbours share urgent
alerts, recommend local professionals, organise events, and reward each other
for being helpful. It is built to be fast, private, and respectful of free
speech — there is no advertising, no algorithm deciding what you see, and no
selling of your data.

---

## Getting the app

You can use BlockTrust in any modern browser by visiting the deployed URL. For
the best experience, install it as an app: in most browsers, an *Install app*
or *Add to Home Screen* option appears in the menu (or as a prompt in the
address bar on mobile). Installing puts a BlockTrust icon on your home screen,
launches the app full-screen, and enables offline use. Because BlockTrust is a
Progressive Web App, the installed version is the same app, just wrapped for a
more app-like feel — there is no separate download from an app store.

Once installed, the app works even without an internet connection, showing you
the posts, alerts, and events it has already loaded. New content syncs when you
are back online.

---

## The home feed

When you open BlockTrust you land on the Home feed, a stream of posts from your
neighbourhood. Each post shows who wrote it, which neighbourhood it is from,
when it was posted, a category, and the post's text. Some posts include an image
or a highlighted banner for urgent or rewarded posts.

You can interact with a post in several ways. Tap the **heart** to like it — the
count updates and your like is remembered across reloads. Tap **comment** to add
a reply; your comment appears immediately under the post and is saved. Tap the
**bookmark** to save the post for later; saved posts are yours privately and
persist on your device. Tap a **category pill** at the top to filter the feed to
a single topic, and tap it again to return to all posts.

At the top of the feed you will find a free-speech card, a highlighted area for
uncensored community conversation that does not fit the tidy category model. It
can be opened and closed at your preference, and your choice is remembered.

To write your own post, tap the prominent **+** button. A composer opens where
you choose a category, write a title and body, optionally tag the post as urgent
or rewarded, and post. Your new post appears at the top of the feed and is saved
to your device.

---

## Alerts

The Alerts tab collects everything that wants your attention: urgent
neighbourhood advisories, replies to your posts, mentions, and event reminders.
Unread alerts are visually distinguished; viewing the Alerts tab marks them as
read so the badge count clears. This is where you check "what happened while I
was away" without doom-scrolling a feed — the list is finite and neighbourhood-
relevant.

---

## The Pros directory

The Pros tab is a directory of vetted local professionals — plumbers,
electricians, tutors, gardeners, and the like — recommended by neighbours. Each
pro has a card showing their trade, neighbourhood, and a short blurb. The point
is to trade trustworthy recommendations within the block instead of relying on
anonymous review sites where you cannot tell who is real. Tap a pro's contact
button to reach out. If you are a pro yourself, the Profile tab is where your
details live.

---

## Events

The Events tab lists neighbourhood gatherings: block parties, clean-ups, yard
sales, meetings. Each event card shows the date, location, a description, and a
live count of how many neighbours are going. Tap **RSVP** to add yourself to the
going-count; tap again to change your mind. Your RSVPs are remembered, and
events you are going to show up in your Alerts as reminders approach.

---

## Your profile

The Profile tab is your identity in BlockTrust. It shows your name, your
neighbourhood, your stats (posts, likes received, comments), and lets you edit
your details. You can also switch your neighbourhood here, which changes whose
posts you see in the feed. Everything you enter is stored on your device; there
is no account server in the current version, so your profile is private to you.

---

## Premium

The Premium tab describes BlockTrust's optional membership. Premium unlocks
power features — promoted posts, priority placement in the Pros directory, and
advanced event tools — and visibly funds the project so it stays independent of
advertising. Importantly, **core neighbourhood communication is never
paywalled**: you can always read, post, alert, and RSVP for free. Tapping
subscribe unlocks the premium badge on your profile and confirms with a toast.
In this version the transaction is modelled in the UI; real billing arrives in
a later phase described in the Roadmap.

---

## Theme and preferences

BlockTrust ships in light and dark themes. Toggle between them with the theme
button in the app bar; your choice is remembered across reloads and
reinstalls. The app is mobile-first, so it looks best on a phone, but it scales
gracefully to a tablet or desktop browser if you prefer a larger view.

---

## Your data and privacy

In the current version, everything you do — your posts, likes, saves, RSVPs,
profile, and theme — is stored locally in your browser. It never leaves your
device. This means your data is private by construction, but it also means it
lives on the device where you created it; clearing your browser data, or using
a different device, starts you fresh. A future phase will introduce optional
cross-device sync, described in the Roadmap, with a firm commitment to
minimise stored data and never sell or share it.

To reset the app to its initial demo state, the forthcoming settings panel will
offer a one-tap reset. For now, clearing site data in your browser's DevTools
or settings accomplishes the same thing.

---

## Free speech on BlockTrust

BlockTrust is built on a free-speech commitment: the only content the platform
removes is hate speech, illegal content, and spam. Everything else is
protected, even when it is unpopular or uncomfortable. This applies to the
app's own spaces and is the default policy for any instance an operator may run.
The project's governance and code of conduct spell out the boundaries and the
reasoning, and they are deliberately narrow. If you are used to platforms that
police tone and topic, BlockTrust will feel different — that is the point.

---

## Getting help

If something is not working, first try the service-worker tip in `SUPPORT.md`
(unregister the service worker and clear site data, then reload) — a stale
cache is the most common cause of odd behaviour after an update. For questions,
use GitHub Discussions. For bugs, open an issue with the bug-report template.
For security issues, follow the private process in `SECURITY.md`. See
`SUPPORT.md` for the full routing.

Welcome to the block.
