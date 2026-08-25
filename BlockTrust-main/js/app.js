// ============================================================
// BLOCKTRUST — MAIN APP LOGIC
// ============================================================
(() => {
  const { HOODS, CATEGORIES, CAT_META, PROS, EVENTS, NOTIFICATIONS_SEED, SEED_POSTS } = window.BT_DATA;
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  // ---------- Toasts ----------
  const toastStack = $('#toastStack');
  function toast(msg, type='success', icon) {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const ic = icon || ({success:'fa-check-circle',error:'fa-times-circle',info:'fa-info-circle',gold:'fa-crown'}[type] || 'fa-check-circle');
    t.innerHTML = `<i class="fas ${ic} lead"></i><span>${msg}</span>`;
    toastStack.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 2800);
  }

  // ---------- State ----------
  const S = Store.get();
  function persist() { Store.save(); }

  // ---------- Theme ----------
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', S.theme);
    const btn = $('#themeToggle');
    if (btn) btn.innerHTML = S.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  function toggleTheme() {
    S.theme = S.theme === 'dark' ? 'light' : 'dark';
    persist(); applyTheme();
    toast(S.theme === 'dark' ? 'Dark mode on 🌙' : 'Light mode on ☀️', 'info', 'fa-palette');
  }

  // ---------- Posts: combine seed + user posts ----------
  function allPosts() {
    return [...S.posts, ...SEED_POSTS].sort((a,b) => (b.boosted?1:0) - (a.boosted?1:0) || (b.timestamp - a.timestamp));
  }

  // ---------- Helpers ----------
  function timeAgo(ts) {
    const s = Math.floor((Date.now()-ts)/1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s/60)+'m ago';
    if (s < 86400) return Math.floor(s/3600)+'h ago';
    return Math.floor(s/86400)+'d ago';
  }
  function roleBadge(role) {
    const map = {
      official:   ['badge-official','fa-check-circle','Official'],
      urgent:     ['badge-urgent','fa-exclamation-triangle','Urgent'],
      found:      ['badge-found','fa-check-circle','Found!'],
      pro:        ['badge-pro','fa-shield-alt','Verified Pro'],
      moderator:  ['badge-moderator','fa-gavel','Moderator'],
      event:      ['badge-event','fa-calendar-alt','Event Host'],
    };
    const r = map[role]; if (!r) return '';
    return `<span class="badge ${r[0]}"><i class="fas ${r[1]}"></i> ${r[2]}</span>`;
  }

  // ---------- Render Feed ----------
  function renderFeed() {
    const feed = $('#feedContainer');
    if (!feed) return;
    const posts = allPosts();
    const activeCat = S.activeCat || 'all';
    const q = (S.query || '').toLowerCase().trim();

    const filtered = posts.filter(p => {
      const cats = p.category.split(' ');
      const catOk = activeCat === 'all' || cats.includes(activeCat);
      const qOk = !q || (p.title+' '+p.content+' '+p.tags.join(' ')).toLowerCase().includes(q);
      return catOk && qOk;
    });

    if (filtered.length === 0) {
      feed.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-leaf"></i>
          <h4>No posts here yet</h4>
          <p>Be the first to share something with your neighborhood.</p>
        </div>`;
      return;
    }

    feed.innerHTML = filtered.map(renderPostCard).join('');
    bindPostEvents();
  }

  function renderPostCard(p) {
    const liked = S.liked[p.id] ? 'liked' : '';
    const saved = S.saved[p.id] ? 'saved' : '';
    const cls = [p.boosted&&'boosted', p.category.includes('urgent')&&'urgent', p.category.includes('found')&&'found'].filter(Boolean).join(' ');
    const rewardTag = p.reward ? `<span class="post-tag reward"><i class="fas fa-dollar-sign"></i> $${p.reward} Reward</span>` : '';
    const boostedTag = p.boosted ? `<span class="post-tag boosted-tag"><i class="fas fa-bolt"></i> Boosted</span>` : '';
    const imgBlock = p.image ? `<div class="post-image ${p.imageBg||''}">${p.image}</div>` : '';
    const ribbon = p.boosted ? `<div class="boosted-ribbon"><i class="fas fa-bolt"></i> Boosted</div>` : '';
    const comments = (p.commentList||[]).map(c => `
      <div class="comment">
        <div class="c-avatar post-avatar ${c.g||'g1'}">${c.initials}</div>
        <div class="c-body">
          <div class="c-user">${c.user}</div>
          <div class="c-text">${c.text}</div>
          <div class="c-meta">${c.time}</div>
        </div>
      </div>`).join('');
    const commentCount = (p.commentList||[]).length;
    const likeCount = (p.likes||0) + (S.liked[p.id]?1:0);

    return `
    <article class="post-card ${cls}" data-id="${p.id}" data-category="${p.category}">
      ${ribbon}
      <div class="post-header">
        <div class="post-avatar ${p.avatarG||'g1'}">${p.initials}</div>
        <div style="flex:1;min-width:0;">
          <div class="post-user">${p.author} ${roleBadge(p.role)}</div>
          <div class="post-neighborhood"><i class="fas fa-map-marker-alt"></i> ${p.hood} • ${p.time || timeAgo(p.timestamp)}</div>
        </div>
        <button class="post-more" aria-label="More"><i class="fas fa-ellipsis-h"></i></button>
      </div>
      ${p.title ? `<div class="post-title">${p.title}</div>` : ''}
      <div class="post-content">${p.content}</div>
      ${imgBlock}
      <div class="post-tags">
        <span class="post-tag location"><i class="fas fa-map-marker-alt"></i> ${p.hood}</span>
        ${rewardTag}${boostedTag}
        ${(p.tags||[]).filter(t=>t.startsWith('#')).map(t=>`<span class="post-tag">${t}</span>`).join('')}
      </div>
      <div class="post-actions">
        <button class="like-btn ${liked}" data-id="${p.id}"><i class="fas fa-heart"></i> <span class="cnt">${likeCount}</span></button>
        <button class="comment-btn" data-id="${p.id}"><i class="fas fa-comment"></i> <span>${commentCount}</span></button>
        <button class="save-btn ${saved}" data-id="${p.id}"><i class="fas fa-bookmark"></i></button>
        <button class="share-btn" data-id="${p.id}"><i class="fas fa-share-alt"></i></button>
        ${p.reward ? `<span class="spacer"></span><button class="claim-btn" data-reward="${p.reward}"><i class="fas fa-hand-holding-usd"></i> Claim</button>` : ''}
      </div>
      <div class="comments-wrap" data-id="${p.id}">
        ${comments}
        <div class="comment-input">
          <input type="text" placeholder="Write a comment..." data-id="${p.id}" />
          <button class="send-comment" data-id="${p.id}"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </article>`;
  }

  function bindPostEvents() {
    $$('.like-btn').forEach(b => b.onclick = () => {
      const id = b.dataset.id;
      S.liked[id] = !S.liked[id];
      persist();
      b.classList.toggle('liked', S.liked[id]);
      const cnt = b.querySelector('.cnt');
      cnt.textContent = (parseInt(cnt.textContent) + (S.liked[id]?1:-1));
    });
    $$('.save-btn').forEach(b => b.onclick = () => {
      const id = b.dataset.id;
      S.saved[id] = !S.saved[id];
      persist();
      b.classList.toggle('saved', S.saved[id]);
      toast(S.saved[id] ? 'Saved to your bookmarks 🔖' : 'Removed from bookmarks', S.saved[id]?'gold':'info', 'fa-bookmark');
    });
    $$('.comment-btn').forEach(b => b.onclick = () => {
      const wrap = $(`.comments-wrap[data-id="${b.dataset.id}"]`);
      wrap.classList.toggle('open');
    });
    $$('.share-btn').forEach(b => b.onclick = () => {
      const p = allPosts().find(x=>x.id===b.dataset.id);
      const url = location.origin + location.pathname + '#post-' + p.id;
      if (navigator.share) navigator.share({title:p.title||'BlockTrust post', text:p.content, url}).catch(()=>{});
      else { navigator.clipboard?.writeText(url); toast('Link copied to clipboard 🔗','info','fa-link'); }
    });
    $$('.claim-btn').forEach(b => b.onclick = () => {
      const r = parseInt(b.dataset.reward);
      const fee = Math.round(r*0.1);
      toast(`Reward claim started: $${r} • fee $${fee} • you get $${r-fee} 💰`, 'gold', 'fa-hand-holding-usd');
    });
    $$('.post-more').forEach(b => b.onclick = (e) => {
      e.stopPropagation();
      const card = b.closest('.post-card');
      const id = card.dataset.id;
      // only allow delete for user posts
      if (S.posts.some(p=>p.id===id)) {
        if (confirm('Delete this post?')) {
          S.posts = S.posts.filter(p=>p.id!==id);
          persist(); renderFeed();
          toast('Post deleted 🗑️', 'info', 'fa-trash');
        }
      } else {
        toast('Only your own posts can be managed', 'info', 'fa-info-circle');
      }
    });
    $$('.send-comment').forEach(b => b.onclick = () => sendComment(b.dataset.id));
    $$('.comment-input input').forEach(inp => {
      inp.onkeydown = e => { if (e.key==='Enter') sendComment(inp.dataset.id); };
    });
  }

  function sendComment(id) {
    const inp = $(`.comment-input input[data-id="${id}"]`);
    const text = inp.value.trim();
    if (!text) return;
    let target = S.posts.find(p=>p.id===id);
    if (target) {
      target.commentList = target.commentList||[];
      target.commentList.push({ user:S.profile.name, initials:S.profile.initials, g:'g1', text, time:'just now' });
    } else {
      const seed = SEED_POSTS.find(p=>p.id===id);
      if (seed) { seed.commentList = seed.commentList||[]; seed.commentList.push({ user:S.profile.name, initials:S.profile.initials, g:'g1', text, time:'just now' }); }
    }
    persist();
    const wrap = $(`.comments-wrap[data-id="${id}"]`);
    // re-render just this card's comments
    const card = wrap.closest('.post-card');
    const post = allPosts().find(p=>p.id===id);
    const fresh = renderPostCard(post);
    card.outerHTML = fresh;
    const newWrap = $(`.comments-wrap[data-id="${id}"]`);
    newWrap.classList.add('open');
    bindPostEvents();
    toast('Comment posted 💬', 'success', 'fa-comment');
  }

  // ---------- Render category pills ----------
  function renderPills() {
    const bar = $('#categoryPills');
    if (!bar) return;
    bar.innerHTML = CATEGORIES.map(c => {
      const extra = c.id==='urgent' ? 'urgent' : (c.id==='services' ? 'gold' : '');
      return `<button class="pill ${extra} ${S.activeCat===c.id?'active':''}" data-cat="${c.id}"><i class="fas ${c.icon}"></i> ${c.label}</button>`;
    }).join('');
    $$('.pill', bar).forEach(p => p.onclick = () => {
      S.activeCat = p.dataset.cat; persist();
      $$('.pill', bar).forEach(x=>x.classList.toggle('active', x===p));
      renderFeed();
    });
  }

  // ---------- Tabs ----------
  const TABS = ['home','alerts','pros','events','profile','premium'];
  function switchTab(tabId) {
    if (!TABS.includes(tabId)) return;
    $$('.tab-content').forEach(t => t.classList.remove('active'));
    const el = $('#tab-'+tabId); if (el) el.classList.add('active');
    $$('.bottom-nav a[data-tab]').forEach(a => a.classList.toggle('active', a.dataset.tab===tabId));
    const catBar = $('#categoryBar');
    if (catBar) catBar.style.display = (tabId==='home') ? '' : 'none';
    window.scrollTo({top:0, behavior:'smooth'});
    if (tabId==='home') renderFeed();
    if (tabId==='alerts') renderAlerts();
    if (tabId==='pros') renderPros();
    if (tabId==='events') renderEvents();
    if (tabId==='profile') renderProfile();
  }

  // ---------- Alerts / Notifications ----------
  function renderAlerts() {
    const list = $('#notifList');
    if (!list) return;
    const items = NOTIFICATIONS_SEED;
    list.innerHTML = items.map(n => {
      const unread = !S.notifsRead[n.id];
      const iconMap = { urgent:['urgent','fa-exclamation-circle'], found:['found','fa-paw'], event:['event','fa-calendar-alt'], pro:['pro','fa-shield-alt'], reply:['reply','fa-comment-dots'] };
      const [cls, ic] = iconMap[n.type] || ['reply','fa-bell'];
      return `
      <div class="notif ${unread?'unread':''}" data-id="${n.id}">
        <div class="n-icon ${cls}"><i class="fas ${ic}"></i></div>
        <div class="n-body">
          <div class="n-title">${n.title}</div>
          <div class="n-text">${n.text}</div>
          <div class="n-time">${n.time}</div>
        </div>
        ${unread ? '<div class="n-dot"></div>' : ''}
      </div>`;
    }).join('');
    $$('.notif', list).forEach(el => el.onclick = () => {
      S.notifsRead[el.dataset.id] = true; persist();
      el.classList.remove('unread'); el.querySelector('.n-dot')?.remove();
      updateNotifDot();
    });
    updateNotifDot();
  }
  function updateNotifDot() {
    const unread = NOTIFICATIONS_SEED.filter(n => !S.notifsRead[n.id]).length;
    const dot = $('#notifDot');
    if (dot) dot.style.display = unread ? 'grid' : 'none';
  }

  // ---------- Pros ----------
  function renderPros() {
    const grid = $('#proGrid');
    if (!grid) return;
    grid.innerHTML = PROS.map(p => `
      <div class="pro-card">
        <div class="p-avatar post-avatar ${p.g}">${p.initials}</div>
        <h4>${p.name} <span class="badge badge-verified"><i class="fas fa-shield-alt"></i></span></h4>
        <div class="trade">${p.trade}</div>
        <div class="rating"><i class="fas fa-star"></i> ${p.rating} <span style="color:var(--text-muted);font-weight:500;">(${p.reviews})</span></div>
        <div class="p-tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>
        <div class="p-tags" style="margin-top:5px;"><span><i class="fas fa-map-marker-alt" style="font-size:9px;"></i> ${p.hood}</span></div>
        <div class="p-contact">
          <button class="msg" data-pro="${p.name}"><i class="fas fa-comment"></i> Message</button>
          <button class="call" data-pro="${p.name}"><i class="fas fa-phone"></i> Call</button>
        </div>
      </div>`).join('');
    $$('.pro-card .msg').forEach(b => b.onclick = () => toast(`Message request sent to ${b.dataset.pro} ✉️`,'success','fa-comment'));
    $$('.pro-card .call').forEach(b => b.onclick = () => toast(`Connecting you to ${b.dataset.pro}… 📞`,'info','fa-phone'));
  }

  // ---------- Events ----------
  function renderEvents() {
    const list = $('#eventList');
    if (!list) return;
    list.innerHTML = EVENTS.map(e => {
      const going = S.goingEvents[e.id];
      const attendees = ['g1','g2','g3','g4'].map(g=>`<span class="post-avatar ${g}" style="width:24px;height:24px;font-size:9px;">${e.host.slice(0,2)}</span>`).join('');
      return `
      <div class="event-card">
        <div class="event-date"><div class="m">${e.month}</div><div class="d">${e.date}</div></div>
        <div class="event-body">
          <h4>${e.title}</h4>
          <div class="e-meta">
            <span><i class="fas fa-clock"></i> ${e.time}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${e.loc}</span>
            <span><i class="fas fa-user"></i> Hosted by ${e.host}</span>
          </div>
          <div class="e-att">
            <div class="attendees">${attendees}</div>
            <span>${e.going + (going?1:0)} going</span>
          </div>
        </div>
        <button class="rsvp-btn ${going?'going':''}" data-id="${e.id}">${going?'✓ Going':'RSVP'}</button>
      </div>`;
    }).join('');
    $$('.rsvp-btn').forEach(b => b.onclick = () => {
      const id = b.dataset.id;
      S.goingEvents[id] = !S.goingEvents[id]; persist();
      renderEvents();
      toast(S.goingEvents[id] ? "You're going! 🎉" : 'RSVP cancelled', S.goingEvents[id]?'success':'info', 'fa-calendar-check');
    });
  }

  // ---------- Profile ----------
  function renderProfile() {
    const p = S.profile;
    const myPosts = S.posts;
    const mySaved = allPosts().filter(x => S.saved[x.id]);
    const likedCount = Object.values(S.liked).filter(Boolean).length;
    const goingCount = Object.values(S.goingEvents).filter(Boolean).length;

    $('#profileName').textContent = p.name;
    $('#profileAvatar').textContent = p.initials;
    $('#profileHood').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${S.hood} • Joined ${p.joined}`;
    $('#profileBio').textContent = p.bio;
    $('#statPosts').textContent = myPosts.length;
    $('#statSaved').textContent = mySaved.length;
    $('#statLiked').textContent = likedCount;

    const premiumBadge = $('#profilePremium');
    premiumBadge.style.display = p.premium ? '' : 'none';

    // my posts tab
    const mp = $('#myPostsList');
    if (mp) {
      mp.innerHTML = myPosts.length ? myPosts.map(renderPostCard).join('') :
        `<div class="empty-state"><i class="fas fa-pen"></i><h4>No posts yet</h4><p>Tap the + button to share something with your neighborhood.</p></div>`;
      bindPostEvents();
    }
    const sv = $('#mySavedList');
    if (sv) {
      sv.innerHTML = mySaved.length ? mySaved.map(renderPostCard).join('') :
        `<div class="empty-state"><i class="fas fa-bookmark"></i><h4>Nothing saved</h4><p>Bookmark posts to find them here later.</p></div>`;
      bindPostEvents();
    }
  }

  // ---------- Hood switcher ----------
  function cycleHood() {
    const i = HOODS.indexOf(S.hood);
    S.hood = HOODS[(i+1) % HOODS.length];
    persist();
    $('#hoodLabel').textContent = S.hood;
    toast(`Switched to ${S.hood} 📍`, 'info', 'fa-map-marker-alt');
    if ($('#tab-home').classList.contains('active')) renderFeed();
    if ($('#tab-profile').classList.contains('active')) renderProfile();
  }

  // ---------- Post Modal ----------
  const modal = $('#postModal');
  let selectedCat = 'news';
  let selectedEmoji = '📝';

  function openModal() {
    modal.classList.add('active');
    $('#postContent').value = '';
    $('#postTitle').value = '';
    $('#boostSwitch').checked = false;
    $('#rewardAmount').value = '';
    selectCat('news'); selectEmoji('📝');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#postContent').focus(), 250);
  }
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  function selectCat(c) {
    selectedCat = c;
    $$('.cat-opt').forEach(o => o.classList.toggle('selected', o.dataset.cat===c));
  }
  function selectEmoji(e) {
    selectedEmoji = e;
    $$('.emoji-row button').forEach(o => o.classList.toggle('selected', o.emoji===e));
  }

  function createPost(boosted) {
    const content = $('#postContent').value.trim();
    const title = $('#postTitle').value.trim();
    if (!content) { toast('Please write something first ✍️', 'error', 'fa-pen'); return; }
    const reward = parseInt($('#rewardAmount').value) || 0;
    const meta = CAT_META[selectedCat] || CAT_META.news;
    const post = {
      id: 'user-'+Date.now(),
      author: S.profile.name,
      initials: S.profile.initials,
      avatarG: 'g1',
      role: S.profile.premium ? 'pro' : 'user',
      hood: S.hood,
      timestamp: Date.now(),
      time: 'just now',
      title: title || (selectedCat==='urgent' ? '🚨 '+content.slice(0,40) : ''),
      content,
      category: selectedCat,
      tags: ['#'+meta.label.replace(/[\s&]/g,'')],
      likes: 0,
      commentList: [],
      reward: reward > 0 ? reward : undefined,
      boosted: boosted,
      image: selectedEmoji !== '📝' ? selectedEmoji : undefined,
      imageBg: selectedCat==='urgent'?'urgent-bg':(selectedCat==='events'?'event-bg':(selectedCat==='found'?'found-bg':'')),
    };
    S.posts.unshift(post);
    persist();
    closeModal();
    switchTab('home');
    S.activeCat = 'all'; persist(); renderPills(); renderFeed();
    // scroll new post into view
    setTimeout(() => {
      const el = $(`.post-card[data-id="${post.id}"]`);
      el?.scrollIntoView({behavior:'smooth', block:'center'});
      el?.animate([{filter:'brightness(1.2)'},{filter:'brightness(1)'}], {duration:800});
    }, 200);
    let msg = 'Post published! ✅';
    if (boosted) msg += ' Boosted ($4.99).';
    if (reward) msg += ` Reward $${reward} • fee $${Math.round(reward*0.1)}.`;
    toast(msg, boosted?'gold':'success', boosted?'fa-bolt':'fa-check-circle');
  }

  // ---------- Premium subscribe (demo) ----------
  function subscribe() {
    S.profile.premium = true; persist();
    toast('Welcome to Premium! 👑 All features unlocked.', 'gold', 'fa-crown');
    renderProfile();
    $('#premiumNavDot')?.classList.add('is-prem');
  }

  // ---------- Free speech toggle ----------
  function initFreeSpeech() {
    const tog = $('#freeSpeechToggle');
    const c = $('#freeSpeechContent');
    const a = $('#freeSpeechArrow');
    if (S.freeSpeechOpen) { c.classList.add('open'); a.classList.add('open'); }
    tog.onclick = () => {
      c.classList.toggle('open'); a.classList.toggle('open');
      S.freeSpeechOpen = c.classList.contains('open'); persist();
    };
  }

  // ---------- Search ----------
  function initSearch() {
    const inp = $('#searchInput');
    let t;
    inp.oninput = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        S.query = inp.value; persist();
        if ($('#tab-home').classList.contains('active')) renderFeed();
      }, 180);
    };
  }

  // ---------- Profile edit ----------
  function editProfile() {
    const name = prompt('Your name:', S.profile.name);
    if (name && name.trim()) { S.profile.name = name.trim(); S.profile.initials = name.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase(); }
    const bio = prompt('Short bio:', S.profile.bio);
    if (bio !== null) S.profile.bio = bio.trim();
    persist();
    $('#avatarTop').textContent = S.profile.initials;
    renderProfile();
    toast('Profile updated ✨', 'success', 'fa-user-edit');
  }

  // ---------- Init ----------
  function init() {
    applyTheme();
    // top avatar
    $('#avatarTop').textContent = S.profile.initials;
    $('#hoodLabel').textContent = S.hood;
    S.activeCat = S.activeCat || 'all';
    S.query = S.query || '';

    renderPills();
    renderFeed();
    initFreeSpeech();
    initSearch();
    updateNotifDot();

    // theme
    $('#themeToggle').onclick = toggleTheme;
    $('#hoodSwitch').onclick = cycleHood;
    $('#avatarTop').onclick = () => switchTab('profile');

    // bottom nav
    $$('.bottom-nav a[data-tab]').forEach(a => {
      a.onclick = e => { e.preventDefault(); switchTab(a.dataset.tab); };
    });
    // FAB shortcuts
    $$('.fab').forEach(b => b.onclick = () => switchTab(b.dataset.tab));
    // welcome feature grid
    $$('.feature-item[data-go]').forEach(el => el.onclick = () => {
      const g = el.dataset.go;
      if (g === 'lost') { switchTab('home'); S.activeCat='lost'; persist(); renderPills(); renderFeed(); }
      else switchTab(g);
    });
    // post button
    $('#openPostModal').onclick = e => { e.preventDefault(); openModal(); };

    // modal
    $('#closePostModal').onclick = closeModal;
    $('#postModal').onclick = e => { if (e.target===modal) closeModal(); };
    document.addEventListener('keydown', e => { if (e.key==='Escape' && modal.classList.contains('active')) closeModal(); });
    $$('.cat-opt').forEach(o => o.onclick = () => selectCat(o.dataset.cat));
    $$('.emoji-row button').forEach(o => o.onclick = () => selectEmoji(o.emoji));
    $('#submitPost').onclick   = () => createPost($('#boostSwitch').checked);
    $('#submitPostFree').onclick = () => createPost(false);

    // premium
    $('#subscribeBtn').onclick = subscribe;
    $('#editProfileBtn').onclick = editProfile;
    $$('.ptab').forEach(t => t.onclick = () => {
      $$('.ptab').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      $$('.profile-pane').forEach(p => p.style.display = 'none');
      $('#pane-'+t.dataset.pane).style.display = '';
    });

    // deep link to post
    const hash = location.hash;
    if (hash.startsWith('#post-')) {
      switchTab('home');
      setTimeout(() => {
        const el = $(`.post-card[data-id="${hash.slice(1)}"]`);
        el?.scrollIntoView({behavior:'smooth', block:'center'});
      }, 400);
    }

    console.log('%c🏠 BlockTrust upgraded & loaded', 'color:#2e7d32;font-weight:bold;font-size:14px;');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
