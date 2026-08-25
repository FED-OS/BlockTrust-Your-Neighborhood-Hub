// ============================================================
// BLOCKTRUST — RENDER
// Converts store state into DOM. All user-generated content is
// escaped via Util.esc / Util.escMultiline — never injected raw.
// ============================================================

const Render = {

  // ---- Badge for a user role ----
  badge(user) {
    const r = ROLE_BADGES[user.role] || ROLE_BADGES.member;
    if (!r.label) return "";
    return `<span class="badge ${r.cls}"><i class="fas ${r.icon}"></i> ${r.label}</span>`;
  },

  // ---- A single post card ----
  postCard(post) {
    const user = Store.getUser(post.userId);
    const role = ROLE_BADGES[user.role] || ROLE_BADGES.member;
    const urgentTag = post.urgent ? `<span class="badge badge-urgent"><i class="fas fa-exclamation-triangle"></i> Urgent</span>` : "";
    const foundTag = (post.category === "lost" && post.content && /found/i.test(post.content.slice(0, 20))) ? `<span class="badge badge-found"><i class="fas fa-check-circle"></i> Found!</span>` : "";
    const boostedTag = post.boosted ? `<span class="badge badge-boosted"><i class="fas fa-bolt"></i> Boosted</span>` : "";
    const verifiedTag = user.verified && user.role === "verified_pro" ? "" : "";

    const tagsHtml = post.tags.map(t => `<span class="post-tag">#${Util.esc(t)}</span>`).join("");
    const rewardTag = post.reward > 0
      ? `<span class="post-tag reward"><i class="fas fa-dollar-sign"></i> $${post.reward} Reward</span>` : "";
    const rewardBtn = post.reward > 0 ? this.rewardButton(post) : "";
    const imageHtml = post.image
      ? `<div class="post-image"><img src="${post.image}" alt="post image" loading="lazy"></div>` : "";
    const titleHtml = post.title ? `<div class="post-title">${Util.esc(post.title)}</div>` : "";

    const commentCount = post.comments.length;

    return `
    <article class="post-card${post.urgent ? " urgent-post" : ""}${post.boosted ? " boosted" : ""}" data-id="${post.id}" data-category="${post.category}">
      <div class="post-header">
        <div class="post-avatar" style="background:${Util.avatarColor(user.initials)};" aria-hidden="true">${Util.esc(user.initials)}</div>
        <div class="post-meta">
          <div class="post-user">${Util.esc(user.name)} ${this.badge(user)} ${urgentTag} ${foundTag} ${boostedTag}</div>
          <div class="post-neighborhood">📍 ${Util.esc(user.neighborhood)} • ${Util.timeAgo(post.createdAt)}</div>
        </div>
        <span class="post-time" title="${Util.timeFull(post.createdAt)}">${Util.timeAgo(post.createdAt)}</span>
      </div>
      ${titleHtml}
      <div class="post-content">${Util.escMultiline(post.content)}</div>
      ${imageHtml}
      <div class="post-tags">
        <span class="post-tag location"><i class="fas fa-map-marker-alt"></i> ${Util.esc(post.location)}</span>
        ${rewardTag}
        ${tagsHtml}
      </div>
      <div class="post-actions">
        <button class="like-btn${post.liked ? " liked" : ""}" data-action="like" data-id="${post.id}" aria-label="Like">
          <i class="${post.liked ? "fas" : "far"} fa-heart"></i> <span class="count">${post.likes}</span>
        </button>
        <button class="comment-btn" data-action="comment" data-id="${post.id}" aria-label="Comments">
          <i class="far fa-comment"></i> <span class="count">${commentCount}</span>
        </button>
        <button class="share-btn" data-action="share" data-id="${post.id}" aria-label="Share">
          <i class="fas fa-share-alt"></i>
        </button>
        ${post.userId === "me" ? `<button class="delete-btn" data-action="delete" data-id="${post.id}" aria-label="Delete post"><i class="far fa-trash-alt"></i></button>` : ""}
        ${rewardBtn}
      </div>
    </article>`;
  },

  rewardButton(post) {
    const status = post.rewardStatus;
    if (status === "released") {
      return `<button class="claim-btn done" disabled><i class="fas fa-check"></i> Reward Released</button>`;
    }
    if (status === "claimed") {
      if (post.userId === "me") {
        return `<button class="claim-btn release" data-action="release" data-id="${post.id}"><i class="fas fa-hand-holding-usd"></i> Release $${post.reward}</button>`;
      }
      return `<button class="claim-btn pending" disabled><i class="fas fa-clock"></i> Claim Pending</button>`;
    }
    // open
    const fee = Math.round(post.reward * 0.1);
    const net = post.reward - fee;
    return `<button class="claim-btn" data-action="claim" data-id="${post.id}" title="Platform fee 10% = $${fee}. You receive $${net}."><i class="fas fa-hand-holding-usd"></i> Claim $${post.reward}</button>`;
  },

  // ---- Comment list for a post (shown in detail view) ----
  commentsList(post) {
    if (!post.comments.length) {
      return `<div class="comments-empty"><i class="far fa-comment-dots"></i> No comments yet. Be the first to reply.</div>`;
    }
    return post.comments.map(c => {
      const u = Store.getUser(c.userId);
      return `
      <div class="comment">
        <div class="comment-avatar" style="background:${Util.avatarColor(u.initials)};">${Util.esc(u.initials)}</div>
        <div class="comment-body">
          <div class="comment-head"><strong>${Util.esc(u.name)}</strong> ${this.badge(u)} <span class="comment-time">${Util.timeAgo(c.createdAt)}</span></div>
          <div class="comment-text">${Util.escMultiline(c.text)}</div>
        </div>
      </div>`;
    }).join("");
  },

  // ---- Feed (filtered + sorted post list) ----
  feed(state) {
    const container = document.getElementById("feedContainer");
    if (!container) return;

    let list = state.posts.slice();
    if (state.activeCategory && state.activeCategory !== "all") {
      list = list.filter(p => p.category === state.activeCategory);
    }
    // search
    const q = (state.searchQuery || "").toLowerCase().trim();
    if (q) list = list.filter(p => (p.title + " " + p.content + " " + p.tags.join(" ") + " " + p.location).toLowerCase().includes(q));

    // sort
    if (state.sort === "top") {
      list.sort((a, b) => (b.likes + b.comments.length * 2) - (a.likes + a.comments.length * 2));
    } else if (state.sort === "urgent") {
      list.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || b.createdAt - a.createdAt);
    } else {
      list.sort((a, b) => b.createdAt - a.createdAt);
    }
    // boosted always float to top within same sort group
    list.sort((a, b) => (b.boosted ? 1 : 0) - (a.boosted ? 1 : 0));

    if (!list.length) {
      container.innerHTML = this.emptyState(q ? "no results" : "empty");
      return;
    }
    container.innerHTML = list.map(p => this.postCard(p)).join("");
  },

  emptyState(kind) {
    if (kind === "no results") {
      return `<div class="empty-state"><i class="fas fa-search"></i><h3>No posts found</h3><p>Try a different search or category.</p></div>`;
    }
    return `<div class="empty-state"><i class="fas fa-paw"></i><h3>No posts here yet</h3><p>Be the first to post in this category.</p></div>`;
  },

  // ---- Category pills ----
  categoryBar(state) {
    const el = document.getElementById("categoryPills");
    if (!el) return;
    el.innerHTML = CATEGORIES.map(c =>
      `<button class="pill${c.urgent ? " urgent" : ""}${state.activeCategory === c.id ? " active" : ""}" data-category="${c.id}"><i class="fas ${c.icon}"></i> ${c.label}</button>`
    ).join("");
  },

  // ---- Alerts tab content ----
  alertsView(state) {
    const el = document.getElementById("alertsContent");
    if (!el) return;
    const unread = state.alerts.filter(a => !a.read).length;
    const list = state.alerts.length
      ? state.alerts.map(a => `
        <div class="alert-item${a.read ? "" : " unread"}" data-post-id="${a.postId || ""}">
          <div class="alert-icon alert-${a.type}"><i class="fas ${this.alertIcon(a.type)}"></i></div>
          <div class="alert-body">
            <div class="alert-text">${Util.esc(a.text)}</div>
            <div class="alert-time">${Util.timeAgo(a.createdAt)}</div>
          </div>
        </div>`).join("")
      : `<div class="empty-state"><i class="far fa-bell"></i><h3>No alerts yet</h3><p>You'll see likes, comments, and reward updates here.</p></div>`;

    el.innerHTML = `
      <div class="alerts-header">
        <h2><i class="fas fa-bell"></i> Alerts</h2>
        <div class="alerts-actions">
          ${unread ? `<span class="unread-count">${unread} new</span>` : ""}
          ${state.alerts.length ? `<button class="btn-text" id="clearAlertsBtn"><i class="far fa-trash-alt"></i> Clear all</button>` : ""}
        </div>
      </div>
      <div class="alerts-list">${list}</div>`;
  },

  alertIcon(type) {
    return { like: "fa-heart", comment: "fa-comment", reward: "fa-hand-holding-usd", post: "fa-bullhorn" }[type] || "fa-bell";
  },

  // ---- Profile tab content ----
  profileView(state) {
    const el = document.getElementById("profileContent");
    if (!el) return;
    const me = state.me;
    const myPosts = state.posts.filter(p => p.userId === "me");
    const totalLikes = myPosts.reduce((s, p) => s + p.likes, 0);
    const totalComments = myPosts.reduce((s, p) => s + p.comments.length, 0);
    const role = ROLE_BADGES[me.role] || ROLE_BADGES.member;

    el.innerHTML = `
      <div class="profile-header">
        <div class="profile-avatar-big" style="background:${Util.avatarColor(me.initials)};">${Util.esc(me.initials)}</div>
        <h2>${Util.esc(me.name)} ${role.label ? `<span class="badge ${role.cls}"><i class="fas ${role.icon}"></i> ${role.label}</span>` : ""}</h2>
        <p class="profile-neighborhood">📍 ${Util.esc(me.neighborhood)}</p>
        ${state.premium ? `<span class="badge badge-premium"><i class="fas fa-crown"></i> Premium Member</span>` : ""}
      </div>

      <div class="profile-stats">
        <div class="stat"><div class="stat-num">${myPosts.length}</div><div class="stat-label">Posts</div></div>
        <div class="stat"><div class="stat-num">${totalLikes}</div><div class="stat-label">Likes</div></div>
        <div class="stat"><div class="stat-num">${totalComments}</div><div class="stat-label">Comments</div></div>
      </div>

      <div class="profile-section">
        <h3><i class="fas fa-user-edit"></i> Edit Profile</h3>
        <div class="profile-form">
          <label>Name<input type="text" id="profName" value="${Util.esc(me.name)}" maxlength="40"></label>
          <label>Initials<input type="text" id="profInitials" value="${Util.esc(me.initials)}" maxlength="3"></label>
          <label>Neighborhood
            <select id="profNeighborhood">
              ${NEIGHBORHOODS.map(n => `<option${n === me.neighborhood ? " selected" : ""}>${Util.esc(n)}</option>`).join("")}
            </select>
          </label>
          <label>Bio<textarea id="profBio" maxlength="200">${Util.esc(me.bio || "")}</textarea></label>
          <button class="btn-primary" id="saveProfileBtn"><i class="fas fa-save"></i> Save Profile</button>
        </div>
      </div>

      <div class="profile-section">
        <h3><i class="fas fa-cog"></i> Preferences</h3>
        <div class="pref-row">
          <span><i class="fas fa-moon"></i> Dark Mode</span>
          <label class="switch"><input type="checkbox" id="themeToggle" ${state.theme === "dark" ? "checked" : ""}><span class="slider"></span></label>
        </div>
        <div class="pref-row">
          <span><i class="fas fa-crown"></i> Premium Membership</span>
          <label class="switch"><input type="checkbox" id="premiumToggle" ${state.premium ? "checked" : ""}><span class="slider"></span></label>
        </div>
      </div>

      <div class="profile-section">
        <h3><i class="fas fa-bullhorn"></i> My Posts (${myPosts.length})</h3>
        <div class="profile-my-posts">
          ${myPosts.length ? myPosts.map(p => `
            <div class="my-post-row">
              <div class="my-post-info">
                <strong>${Util.esc(p.title || "(untitled)")}</strong>
                <span>${p.likes} likes · ${p.comments.length} comments · ${Util.timeAgo(p.createdAt)}</span>
              </div>
              <button class="btn-text danger" data-action="delete" data-id="${p.id}"><i class="far fa-trash-alt"></i></button>
            </div>`).join("") : `<p class="muted">You haven't posted yet. Tap <strong>Post</strong> to share something.</p>`}
        </div>
      </div>

      <div class="profile-section">
        <h3><i class="fas fa-exclamation-triangle"></i> Danger Zone</h3>
        <button class="btn-text danger" id="resetAllBtn"><i class="fas fa-trash-restore"></i> Reset all data (posts, profile, alerts)</button>
      </div>`;
  },

  // ---- Unread alert badge on bottom nav ----
  alertBadge(state) {
    const navBtn = document.querySelector('.bottom-nav a[data-tab="alerts"]');
    if (!navBtn) return;
    const unread = state.alerts.filter(a => !a.read).length;
    let badge = navBtn.querySelector(".nav-badge");
    if (unread > 0) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "nav-badge";
        navBtn.appendChild(badge);
      }
      badge.textContent = unread > 9 ? "9+" : unread;
    } else if (badge) {
      badge.remove();
    }
  },

  // ---- Premium tab ----
  premiumView(state) {
    const el = document.getElementById("premiumContent");
    if (!el) return;
    if (state.premium) {
      el.innerHTML = `
        <div class="premium-hero active">
          <div class="crown">👑</div>
          <h2>You're <span>Premium</span></h2>
          <p>Thank you for supporting BlockTrust! All premium features are unlocked.</p>
          <button class="btn-premium" id="managePremiumBtn"><i class="fas fa-crown"></i> Manage Membership</button>
        </div>
        <div class="premium-benefits">
          ${this.premiumBenefits()}
        </div>`;
    } else {
      el.innerHTML = `
        <div class="premium-hero">
          <div class="crown">👑</div>
          <h2>Go <span>Premium</span></h2>
          <div class="price">$9.99 <span>/ month</span></div>
          <p>Unlock all features, support your neighborhood, and get the most out of BlockTrust.</p>
          <button class="btn-premium" id="subscribeBtn"><i class="fas fa-crown"></i> Subscribe Now</button>
        </div>
        <div class="premium-benefits">${this.premiumBenefits()}</div>
        <div class="premium-features-list">
          <h3>✨ Everything Included</h3>
          <ul>
            <li><i class="fas fa-check-circle"></i> Unlimited lost & found pet alerts</li>
            <li><i class="fas fa-check-circle"></i> Unlimited service posts</li>
            <li><i class="fas fa-check-circle"></i> Boosted posts (priority placement)</li>
            <li><i class="fas fa-check-circle"></i> Verified community badge</li>
            <li><i class="fas fa-check-circle"></i> Reward escrow with 10% fee</li>
            <li><i class="fas fa-check-circle"></i> No per-post fees</li>
            <li><i class="fas fa-check-circle"></i> Priority customer support</li>
            <li><i class="fas fa-check-circle"></i> Early access to new features</li>
          </ul>
        </div>
        <div class="premium-faq">
          <h3>❓ Frequently Asked Questions</h3>
          <div class="premium-faq-item"><strong>How do I cancel?</strong><p>Toggle Premium off in your Profile → Preferences. No commitment.</p></div>
          <div class="premium-faq-item"><strong>Is there a free trial?</strong><p>Yes — try it free, cancel anytime.</p></div>
          <div class="premium-faq-item"><strong>What is the reward escrow fee?</strong><p>We take a 10% fee on rewards collected through the platform.</p></div>
          <div class="premium-faq-item"><strong>Can I boost posts without premium?</strong><p>Yes — boost individual posts for $4.99 each. Premium gets unlimited boosts.</p></div>
        </div>`;
    }
  },

  premiumBenefits() {
    const items = [
      ["fa-infinity","Unlimited Alerts","Post as many alerts as you need – no limits."],
      ["fa-bolt","Boosted Posts","Your posts appear at the top of the feed."],
      ["fa-check-circle","Verified Badge","Stand out as a trusted community member."],
      ["fa-hand-holding-usd","Reward Escrow","Offer rewards for lost pets – we handle the rest."],
      ["fa-headset","Priority Support","Get help faster when you need it."],
      ["fa-shield-alt","No Per-Post Fees","Post as much as you want – no extra charges."],
    ];
    return items.map(([icon, h, p]) => `<div class="premium-benefit"><i class="fas ${icon}"></i><h4>${h}</h4><p>${p}</p></div>`).join("");
  },
};
