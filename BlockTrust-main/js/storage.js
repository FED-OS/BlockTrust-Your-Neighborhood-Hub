// ============================================================
// BLOCKTRUST — STORAGE LAYER (localStorage persistence)
// ============================================================
const Store = (() => {
  const KEY = 'blocktrust_state_v2';

  const defaults = {
    theme: 'light',
    hood: 'Maplewood',
    profile: {
      name: 'Alex Rivera',
      initials: 'AR',
      bio: 'Loving life in the neighborhood 🏡',
      premium: false,
      joined: '2024',
    },
    posts: [],          // user-created posts (newest first)
    liked: {},          // postId -> true
    saved: {},          // postId -> true
    notifsRead: {},     // notifId -> true
    goingEvents: {},    // eventId -> true
    freeSpeechOpen: false,
    seedVersion: 0,
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(defaults);
      const data = JSON.parse(raw);
      // shallow merge to add new default keys
      return { ...structuredClone(defaults), ...data,
        profile: { ...defaults.profile, ...(data.profile||{}) } };
    } catch (e) {
      console.warn('Store load failed, resetting.', e);
      return structuredClone(defaults);
    }
  }

  let state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Store save failed', e); }
  }

  return {
    get() { return state; },
    set(partial) { state = { ...state, ...partial }; save(); },
    update(fn) { fn(state); save(); },
    reset() { state = structuredClone(defaults); save(); },
    save,
  };
})();
window.Store = Store;
