// ============================================================
// BLOCKTRUST — UTILITIES
// ============================================================

const Util = {
  // XSS-safe text escaping for any user content rendered into HTML
  esc(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  // Escape + preserve line breaks for post/comment bodies
  escMultiline(str) {
    return this.esc(str).replace(/\n/g, "<br>");
  },

  // "just now", "5m", "3h", "2d", or date
  timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return m + "m";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h";
    const d = Math.floor(h / 24);
    if (d < 7) return d + "d";
    return new Date(ts).toLocaleDateString();
  },

  timeFull(ts) {
    return new Date(ts).toLocaleString();
  },

  // Avatar gradient based on initials
  avatarColor(initials) {
    const palette = [
      "linear-gradient(135deg,#2e7d32,#43a047)",
      "linear-gradient(135deg,#1565c0,#42a5f5)",
      "linear-gradient(135deg,#6a1b9a,#ab47bc)",
      "linear-gradient(135deg,#e65100,#fb8c00)",
      "linear-gradient(135deg,#00695c,#26a69a)",
      "linear-gradient(135deg,#c62828,#ef5350)",
      "linear-gradient(135deg,#4527a0,#7e57c2)",
    ];
    let hash = 0;
    for (let i = 0; i < (initials || "").length; i++) hash = (hash * 31 + initials.charCodeAt(i)) | 0;
    return palette[Math.abs(hash) % palette.length];
  },

  // Parse comma/space separated tags
  parseTags(str) {
    return (str || "").split(/[,\s]+/).map(t => t.replace(/^#/, "").trim()).filter(Boolean).slice(0, 5);
  },

  // Read an image File as base64 data URL (resized to max 800px wide)
  readImage(file, maxW = 800) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) { resolve(null); return; }
      if (file.size > 4 * 1024 * 1024) { reject(new Error("Image too large (max 4MB)")); return; }
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxW / img.width);
          const canvas = document.createElement("canvas");
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  },
};

// ============================================================
// TOAST NOTIFICATIONS (replaces alert())
// ============================================================
const Toast = {
  container: null,
  init() {
    if (this.container) return;
    this.container = document.createElement("div");
    this.container.className = "toast-container";
    this.container.setAttribute("role", "status");
    this.container.setAttribute("aria-live", "polite");
    document.body.appendChild(this.container);
  },
  show(msg, type = "info", duration = 3200) {
    this.init();
    const icons = { info: "fa-info-circle", success: "fa-check-circle", warn: "fa-exclamation-triangle", error: "fa-times-circle" };
    const el = document.createElement("div");
    el.className = "toast toast-" + type;
    el.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${Util.esc(msg)}</span>`;
    this.container.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, duration);
  },
};
