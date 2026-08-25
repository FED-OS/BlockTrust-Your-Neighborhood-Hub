// ============================================================
// BLOCKTRUST — STORE (state + localStorage persistence)
// ============================================================
// A tiny reactive store. State lives in memory; changes are
// persisted to localStorage so posts/likes/comments/profile
// survive refreshes. A simple pub/sub lets the UI re-render.

const STORE_KEY = "blocktrust_v2";

const Store = (() => {
  let state = null;
  const subs = new Set();

  function defaultState() {
    return {
      version: 2,
      me: { ...DEFAULT_ME },
      users: structuredCloneSafe(SEED_USERS),
      posts: structuredCloneSafe(SEED_POSTS),
      alerts: [],            // {id, postId, type, text, read, createdAt}
      theme: "light",        // light | dark
      premium: false,
      draft: "",             // saved composer draft
      activeCategory: "all",
      sort: "recent",        // recent | top | urgent
      lastSeen: Date.now(),
    };
  }

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      // Merge with defaults to handle new fields on upgrade
      const base = defaultState();
      return { ...base, ...parsed, me: { ...base.me, ...(parsed.me || {}) } };
    } catch (e) {
      console.warn("Store load failed, using defaults:", e);
      return defaultState();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      // Most likely quota (base64 images). Try saving without images.
      console.warn("Store save failed (likely quota):", e);
      Toast.show("Storage full — images may not persist.", "warn");
    }
  }

  function init() {
    state = load();
    // generate any missing alert timestamps
    notify();
  }

  function getState() { return state; }

  function update(mutator) {
    mutator(state);
    save();
    notify();
  }

  function subscribe(fn) {
    subs.add(fn);
    return () => subs.delete(fn);
  }

  function notify() {
    subs.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } });
  }

  // ---- Domain actions ----

  function addPost({ title, content, category, location, tags, boosted, reward, image }) {
    const post = {
      id: "p" + Date.now(),
      userId: "me",
      category: category || "news",
      title: title || "",
      content: content || "",
      location: location || state.me.neighborhood,
      tags: (tags || []).filter(Boolean),
      boosted: !!boosted,
      urgent: category === "urgent",
      reward: Math.max(0, parseInt(reward) || 0),
      rewardStatus: (parseInt(reward) || 0) > 0 ? "open" : null,
      image: image || null,
      likes: 0,
      liked: false,
      createdAt: Date.now(),
      comments: [],
    };
    update(s => { s.posts.unshift(post); });
    pushAlert({ postId: post.id, type: "post", text: `Your post "${post.title || 'untitled'}" was published.` });
    return post;
  }

  function deletePost(postId) {
    update(s => { s.posts = s.posts.filter(p => p.id !== postId); });
  }

  function toggleLike(postId) {
    update(s => {
      const p = s.posts.find(x => x.id === postId);
      if (!p) return;
      p.liked = !p.liked;
      p.likes += p.liked ? 1 : -1;
      if (p.liked && p.userId !== "me") {
        pushAlertRaw(s, { postId, type: "like", text: `Someone liked your post "${p.title || 'untitled'}".`, read: false });
      }
    });
  }

  function addComment(postId, text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return;
    update(s => {
      const p = s.posts.find(x => x.id === postId);
      if (!p) return;
      const c = { id: "c" + Date.now(), userId: "me", text: trimmed, createdAt: Date.now() };
      p.comments.push(c);
      if (p.userId !== "me") {
        pushAlertRaw(s, { postId, type: "comment", text: `New comment on "${p.title || 'untitled'}": "${trimmed.slice(0, 50)}"`, read: false });
      }
    });
  }

  function claimReward(postId) {
    update(s => {
      const p = s.posts.find(x => x.id === postId);
      if (!p || p.rewardStatus !== "open") return;
      p.rewardStatus = "claimed";
      pushAlertRaw(s, { postId, type: "reward", text: `Reward claim submitted for $${p.reward}. Pending verification.`, read: false });
    });
  }

  function releaseReward(postId) {
    update(s => {
      const p = s.posts.find(x => x.id === postId);
      if (!p || p.rewardStatus !== "claimed") return;
      p.rewardStatus = "released";
      const fee = Math.round(p.reward * 0.1);
      pushAlertRaw(s, { postId, type: "reward", text: `Reward of $${p.reward} released. Platform fee $${fee}. You receive $${p.reward - fee}.`, read: false });
    });
  }

  function pushAlert(a) {
    update(s => pushAlertRaw(s, { ...a, read: false }));
  }

  function pushAlertRaw(s, a) {
    s.alerts.unshift({ id: "a" + Date.now() + Math.random().toString(36).slice(2, 6), createdAt: Date.now(), ...a });
    if (s.alerts.length > 100) s.alerts.length = 100;
  }

  function markAlertsRead() {
    update(s => { s.alerts.forEach(a => a.read = true); });
  }

  function clearAlerts() {
    update(s => { s.alerts = []; });
  }

  function updateProfile(patch) {
    update(s => { s.me = { ...s.me, ...patch }; });
  }

  function setTheme(theme) {
    update(s => { s.theme = theme; });
  }

  function setPremium(v) {
    update(s => { s.premium = !!v; });
  }

  function setCategory(cat) {
    update(s => { s.activeCategory = cat; });
  }

  function setSort(sort) {
    update(s => { s.sort = sort; });
  }

  function saveDraft(text) {
    update(s => { s.draft = text || ""; });
  }

  function resetAll() {
    state = defaultState();
    save();
    notify();
  }

  function getUser(id) {
    if (id === "me") return state.me;
    return state.users[id] || { id, name: "Unknown", initials: "?", role: "member", neighborhood: "—", verified: false };
  }

  return {
    init, getState, subscribe, update,
    addPost, deletePost, toggleLike, addComment,
    claimReward, releaseReward,
    markAlertsRead, clearAlerts,
    updateProfile, setTheme, setPremium, setCategory, setSort, saveDraft,
    resetAll, getUser,
  };
})();
