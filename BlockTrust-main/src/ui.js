// ============================================================
// BLOCKTRUST — UI CONTROLLER + EVENT WIRING
// Handles tab switching, modals, event delegation for all
// data-action buttons, search, sort, theme, profile, premium.
// ============================================================

const UI = (() => {
  let els = {};
  let currentTab = "home";
  let detailPostId = null;
  let composerData = { category: "", image: null };

  // ---- Cache DOM refs ----
  function cache() {
    els = {
      searchInput:   document.getElementById("searchInput"),
      themeBtn:      document.getElementById("themeBtn"),
      catBar:        document.getElementById("catBar"),
      sortBar:       document.getElementById("sortBar"),
      feed:          document.getElementById("feed"),
      homeTab:       document.getElementById("homeTab"),
      alertsTab:     document.getElementById("alertsTab"),
      alertsContent: document.getElementById("alertsContent"),
      profileTab:    document.getElementById("profileTab"),
      profileContent:document.getElementById("profileContent"),
      premiumTab:    document.getElementById("premiumTab"),
      premiumContent:document.getElementById("premiumContent"),
      alertBadge:    document.getElementById("alertBadge"),
      navItems:      Array.from(document.querySelectorAll(".nav-item")),
      postModal:     document.getElementById("postModal"),
      postForm:      document.getElementById("postForm"),
      postText:      document.getElementById("postText"),
      charCount:     document.getElementById("charCount"),
      catGrid:       document.getElementById("catGrid"),
      titleInput:    document.getElementById("titleInput"),
      imgUpload:     document.getElementById("imgUpload"),
      imgInput:      document.getElementById("imgInput"),
      imgPreview:    document.getElementById("imgPreview"),
      locInput:      document.getElementById("locInput"),
      tagsInput:     document.getElementById("tagsInput"),
      boostToggle:   document.getElementById("boostToggle"),
      rewardInput:   document.getElementById("rewardInput"),
      submitPost:    document.getElementById("submitPost"),
      detailModal:   document.getElementById("detailModal"),
      detailContent: document.getElementById("detailContent"),
      fabTop:        document.getElementById("fabTop"),
      toastContainer:document.getElementById("toast-container"),
    };
  }

  // ---- Apply theme attribute ----
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (els.themeBtn) {
      els.themeBtn.innerHTML = theme === "dark"
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    }
  }

  // ---- Render everything ----
  function renderAll() {
    const s = Store.getState();
    applyTheme(s.theme);

    // Category bar + sort
    els.catBar.innerHTML = Render.categoryBar(s);
    if (els.sortBar) els.sortBar.innerHTML = sortBarHTML(s);

    // Feed
    els.feed.innerHTML = Render.feed(s);

    // Alerts
    els.alertsContent.innerHTML = Render.alertsView(s);

    // Profile
    els.profileContent.innerHTML = Render.profileView(s);

    // Premium
    els.premiumContent.innerHTML = Render.premiumView(s);

    // Nav badge
    const badge = Render.alertBadge(s);
    if (badge) {
      els.alertBadge.innerHTML = badge;
      els.alertBadge.style.display = "";
    } else {
      els.alertBadge.innerHTML = "";
    }
  }

  function sortBarHTML(s) {
    const opts = [["recent","Recent","fa-clock"],["top","Top","fa-fire"],["urgent","Urgent","fa-bolt"]];
    return `<span class="label"><i class="fas fa-sort"></i> Sort:</span>` +
      opts.map(([id,label,icon]) =>
        `<button class="sort-btn ${s.sort===id?"active":""}" data-sort="${id}"><i class="fas ${icon}"></i> ${label}</button>`
      ).join("");
  }

  // ---- Tab switching ----
  function switchTab(tab) {
    currentTab = tab;
    ["homeTab","alertsTab","profileTab","premiumTab"].forEach(id => {
      const el = els[id]; if (el) el.classList.toggle("active", id === tab + "Tab");
    });
    els.navItems.forEach(n => n.classList.toggle("active", n.dataset.tab === tab));
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (tab === "alerts") Store.markAlertsRead();
  }

  // ---- Modals ----
  function openModal(overlay) { overlay.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeModal(overlay) { overlay.classList.remove("open"); document.body.style.overflow = ""; }
  function openPostModal() { resetComposer(); openModal(els.postModal); setTimeout(() => els.postText.focus(), 280); }
  function openDetailModal(postId) {
    detailPostId = postId;
    renderDetail();
    openModal(els.detailModal);
  }

  function renderDetail() {
    const s = Store.getState();
    const post = s.posts.find(p => p.id === detailPostId);
    if (!post) { closeModal(els.detailModal); return; }
    const user = Store.getUser(post.userId);
    const liked = post.liked;
    const reward = Render.rewardButton(post);
    els.detailContent.innerHTML = `
      <div class="d-post">
        ${Render.postCard(post)}
      </div>
      <div class="d-comments">
        <div class="comments">
          <div class="c-head"><i class="fas fa-comments"></i> Comments (${post.comments.length})</div>
          <div class="c-list">${Render.commentsList(post)}</div>
          <div class="comment-input">
            <input type="text" id="detailCommentInput" placeholder="Write a comment..." maxlength="300" />
            <button id="detailCommentBtn" data-action="detail-comment"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </div>`;
  }

  // ---- Composer ----
  function resetComposer() {
    composerData = { category: "", image: null };
    if (els.postForm) els.postForm.reset();
    if (els.postText) els.postText.value = Store.getState().draft || "";
    updateCharCount();
    if (els.catGrid) {
      Array.from(els.catGrid.querySelectorAll(".cat-opt")).forEach(c => c.classList.remove("active"));
    }
    if (els.imgPreview) els.imgPreview.innerHTML = "";
    if (els.imgUpload) els.imgUpload.classList.remove("has-img");
    if (els.boostToggle) els.boostToggle.checked = false;
    if (els.rewardInput) els.rewardInput.value = "0";
    if (els.titleInput) els.titleInput.value = "";
    if (els.locInput) els.locInput.value = "";
    if (els.tagsInput) els.tagsInput.value = "";
  }

  function updateCharCount() {
    if (!els.postText || !els.charCount) return;
    const len = els.postText.value.length;
    const max = 1000;
    els.charCount.textContent = `${len} / ${max}`;
    els.charCount.classList.toggle("over", len > max);
    if (els.submitPost) els.submitPost.disabled = len === 0 || len > max;
  }

  function selectCategory(catId) {
    composerData.category = catId;
    Array.from(els.catGrid.querySelectorAll(".cat-opt")).forEach(c => {
      c.classList.toggle("active", c.dataset.cat === catId);
    });
  }

  async function handleImageUpload(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { Toast.show("Please select an image file", "warn"); return; }
    if (file.size > 10 * 1024 * 1024) { Toast.show("Image too large (max 10MB)", "warn"); return; }
    try {
      const dataUrl = await Util.readImage(file, 800);
      composerData.image = dataUrl;
      if (els.imgPreview) els.imgPreview.innerHTML =
        `<div class="preview"><img src="${dataUrl}" alt="preview"><button type="button" class="rm" data-action="remove-img" aria-label="Remove image"><i class="fas fa-times"></i></button></div>`;
      if (els.imgUpload) els.imgUpload.classList.add("has-img");
      Toast.show("Image attached", "success");
    } catch (e) {
      Toast.show("Could not process image", "error");
    }
  }

  function removeImage() {
    composerData.image = null;
    if (els.imgPreview) els.imgPreview.innerHTML = "";
    if (els.imgUpload) els.imgUpload.classList.remove("has-img");
    if (els.imgInput) els.imgInput.value = "";
  }

  function submitPost() {
    const text = els.postText.value.trim();
    if (!text) { Toast.show("Write something first!", "warn"); return; }
    if (text.length > 1000) { Toast.show("Post too long (max 1000 chars)", "warn"); return; }
    const s = Store.getState();
    const post = {
      id: Util.uid(),
      userId: s.me.id,
      category: composerData.category || "questions",
      title: els.titleInput.value.trim() || "",
      content: text,
      location: els.locInput.value.trim() || s.me.neighborhood,
      tags: Util.parseTags(els.tagsInput.value),
      boosted: s.premium && els.boostToggle.checked,
      urgent: composerData.category === "urgent",
      reward: Math.max(0, parseInt(els.rewardInput.value, 10) || 0),
      image: composerData.image,
      likes: 0,
      liked: false,
      createdAt: Date.now(),
      comments: [],
    };
    Store.addPost(post);
    Store.saveDraft("");
    closeModal(els.postModal);
    Toast.show("Post published!", "success");
    if (currentTab !== "home") switchTab("home");
    renderAll();
  }

  // ---- Event delegation ----
  function onAction(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const postId = btn.dataset.postId;
    const s = Store.getState();

    switch (action) {
      case "like": {
        Store.toggleLike(postId);
        renderAll();
        if (detailPostId === postId) renderDetail();
        break;
      }
      case "comment": {
        openDetailModal(postId);
        setTimeout(() => {
          const inp = document.getElementById("detailCommentInput");
          if (inp) inp.focus();
        }, 300);
        break;
      }
      case "open-detail": {
        openDetailModal(postId);
        break;
      }
      case "share": {
        const post = s.posts.find(p => p.id === postId);
        const url = location.origin + location.pathname + "#post-" + postId;
        if (navigator.share) {
          navigator.share({ title: post.title || "BlockTrust post", text: post.content.slice(0,120), url }).catch(()=>{});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => Toast.show("Link copied!", "success"));
        } else {
          Toast.show("Share: " + url.slice(-30), "info");
        }
        break;
      }
      case "delete": {
        if (confirm("Delete this post? This cannot be undone.")) {
          Store.deletePost(postId);
          Toast.show("Post deleted", "info");
          renderAll();
          if (detailPostId === postId) { closeModal(els.detailModal); detailPostId = null; }
        }
        break;
      }
      case "claim-reward": {
        const post = s.posts.find(p => p.id === postId);
        if (!post) break;
        if (post.userId === s.me.id) { Toast.show("You can't claim your own reward", "warn"); break; }
        Store.claimReward(postId);
        Toast.show("Reward claim submitted! Pending verification.", "success");
        renderAll();
        if (detailPostId === postId) renderDetail();
        break;
      }
      case "release-reward": {
        Store.releaseReward(postId);
        Toast.show("Reward released to claimer", "success");
        renderAll();
        if (detailPostId === postId) renderDetail();
        break;
      }
      case "detail-comment": {
        const inp = document.getElementById("detailCommentInput");
        if (!inp) return;
        const txt = inp.value.trim();
        if (!txt) { Toast.show("Write a comment first", "warn"); return; }
        Store.addComment(postId, txt);
        inp.value = "";
        renderAll();
        renderDetail();
        Toast.show("Comment posted!", "success");
        break;
      }
      case "remove-img": { removeImage(); break; }
      case "clear-alerts": { Store.clearAlerts(); renderAll(); Toast.show("Alerts cleared", "info"); break; }
      case "reset-all": {
        if (confirm("Reset everything? All posts, comments, and profile changes will be lost.")) {
          Store.resetAll();
          renderAll();
          Toast.show("All data reset", "info");
        }
        break;
      }
      case "alert-item": {
        const pid = btn.dataset.postId;
        if (pid) openDetailModal(pid);
        break;
      }
    }
  }

  // ---- Profile form ----
  function onProfileSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (form.id !== "profileForm") return;
    const name = form.querySelector("[name=name]").value.trim();
    const neighborhood = form.querySelector("[name=neighborhood]").value;
    const bio = form.querySelector("[name=bio]") ? form.querySelector("[name=bio]").value.trim() : "";
    if (!name) { Toast.show("Name cannot be empty", "warn"); return; }
    Store.updateProfile({ name, neighborhood, bio });
    Toast.show("Profile updated!", "success");
    renderAll();
  }

  // ---- Theme & premium toggles ----
  function onSwitchChange(e) {
    const sw = e.target;
    if (sw.id === "themeSwitch") {
      Store.setTheme(sw.checked ? "dark" : "light");
      applyTheme(Store.getState().theme);
      Toast.show(sw.checked ? "Dark mode on" : "Light mode on", "info");
    } else if (sw.id === "premiumSwitch") {
      Store.setPremium(sw.checked);
      renderAll();
      Toast.show(sw.checked ? "Premium activated! 🎉" : "Premium deactivated", sw.checked ? "success" : "info");
    } else if (sw.id === "boostToggle") {
      // handled in composer state
    }
  }

  // ---- Search & sort & category ----
  let searchTimer = null;
  function onSearch(e) {
    const q = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      Store.update(s => { s.searchQuery = q; });
      els.feed.innerHTML = Render.feed(Store.getState());
    }, 150);
  }

  function onCategoryClick(e) {
    const pill = e.target.closest(".cat-pill");
    if (!pill) return;
    Store.setCategory(pill.dataset.cat);
    renderAll();
  }

  function onSortClick(e) {
    const btn = e.target.closest(".sort-btn");
    if (!btn) return;
    Store.setSort(btn.dataset.sort);
    renderAll();
  }

  // ---- Scroll handling ----
  function onScroll() {
    if (!els.fabTop) return;
    els.fabTop.classList.toggle("show", window.scrollY > 400);
  }

  // ---- Init ----
  function init() {
    cache();
    Store.init();
    Toast.init(els.toastContainer);
    applyTheme(Store.getState().theme);

    // Build category grid in composer
    if (els.catGrid) {
      els.catGrid.innerHTML = CATEGORIES.filter(c => c.id !== "all").map(c =>
        `<div class="cat-opt ${c.urgent?"urgent":""}" data-cat="${c.id}" data-action="select-cat">
           <i class="fas ${c.icon}"></i>${c.label}
         </div>`
      ).join("");
    }

    renderAll();

    // ---- Event listeners ----
    // Nav
    els.navItems.forEach(n => n.addEventListener("click", () => {
      const tab = n.dataset.tab;
      if (tab === "post") openPostModal();
      else switchTab(tab);
    }));

    // Global action delegation
    document.addEventListener("click", onAction);

    // Composer category selection
    if (els.catGrid) els.catGrid.addEventListener("click", e => {
      const opt = e.target.closest(".cat-opt");
      if (opt) selectCategory(opt.dataset.cat);
    });

    // Post text
    if (els.postText) {
      els.postText.addEventListener("input", () => {
        updateCharCount();
        Store.saveDraft(els.postText.value);
      });
    }

    // Image upload
    if (els.imgUpload) els.imgUpload.addEventListener("click", e => {
      if (e.target.closest(".rm")) return;
      els.imgInput.click();
    });
    if (els.imgInput) els.imgInput.addEventListener("change", e => {
      if (e.target.files[0]) handleImageUpload(e.target.files[0]);
    });

    // Submit post
    if (els.submitPost) els.submitPost.addEventListener("click", submitPost);

    // Search
    if (els.searchInput) els.searchInput.addEventListener("input", onSearch);

    // Category & sort
    if (els.catBar) els.catBar.addEventListener("click", onCategoryClick);
    if (els.sortBar) els.sortBar.addEventListener("click", onSortClick);

    // Theme button
    if (els.themeBtn) els.themeBtn.addEventListener("click", () => {
      const s = Store.getState();
      Store.setTheme(s.theme === "dark" ? "light" : "dark");
      applyTheme(Store.getState().theme);
      renderAll();
    });

    // Profile form + switches (delegated on profile content)
    if (els.profileContent) {
      els.profileContent.addEventListener("submit", onProfileSubmit);
      els.profileContent.addEventListener("change", onSwitchChange);
    }

    // Modal close handlers
    [els.postModal, els.detailModal].forEach(overlay => {
      if (!overlay) return;
      overlay.addEventListener("click", e => {
        if (e.target === overlay || e.target.closest(".m-close")) closeModal(overlay);
      });
    });

    // Keyboard: Escape closes modals
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        [els.postModal, els.detailModal].forEach(o => o && o.classList.remove("open"));
        document.body.style.overflow = "";
      }
    });

    // Scroll
    window.addEventListener("scroll", onScroll, { passive: true });
    if (els.fabTop) els.fabTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    // Deep link: #post-xxx
    if (location.hash.startsWith("#post-")) {
      const pid = location.hash.slice(6);
      setTimeout(() => openDetailModal(pid), 400);
    }

    // Store subscription: re-render on any state change
    Store.subscribe(() => renderAll());

    console.log("%cBlockTrust ready ✅", "color:#2e7d32;font-weight:bold;font-size:14px");
  }

  return { init };
})();

// Boot
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", UI.init);
} else {
  UI.init();
}
