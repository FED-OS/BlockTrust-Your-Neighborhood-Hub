document.addEventListener('DOMContentLoaded', () => {
  // ---- DOM refs ----
  const postInput = document.getElementById('postInput');
  const charCount = document.getElementById('charCount');
  const checkBtn = document.getElementById('checkBtn');
  const checkBtnLabel = document.getElementById('checkBtnLabel');
  const btnSpinner = document.getElementById('btnSpinner');

  const emptyNote = document.getElementById('emptyNote');
  const thinkingNote = document.getElementById('thinkingNote');
  const report = document.getElementById('report');

  const stamp = document.getElementById('stamp');
  const categoryRow = document.getElementById('categoryRow');
  const categoryValue = document.getElementById('categoryValue');
  const reasonValue = document.getElementById('reasonValue');
  const fixRow = document.getElementById('fixRow');
  const fixValue = document.getElementById('fixValue');
  const copyBtn = document.getElementById('copyBtn');

  // ---- Preset texts ----
  const PRESETS = {
    offtopic: "This video is so interesting — Neil deGrasse Tyson roasts MAGA Ben Shapiro to his face on his own show. The younger generation has so much on their plate because this stuff wasn't even a topic when I was growing up. Wild how much the culture has changed.",
    shaming: "Watch out for that contractor John Smith who lives over on Oak Street! He took $500 of my money to fix my gutter and never finished the job. He's a total thief, do not hire him.",
    clean: "Found a golden retriever near the park entrance this morning. Blue collar, no tag. Sweet dog, resting safely in my backyard right now. Message me if he's yours!"
  };

  // ---- Local verdicts for the exact presets ----
  const SIMULATIONS = {
    offtopic: {
      compliant: false,
      category: "Off‑topic / national politics",
      reason: "This centers on a national culture‑war debate rather than anything local. Nextdoor moderators flag these for the main feed.",
      suggested_fix: "Any other local parents feeling generational whiplash? I watched a debate about how much more today's teens navigate — curious how neighbours are handling these conversations at home."
    },
    shaming: {
      compliant: false,
      category: "Public naming & shaming",
      reason: "Calling out a specific person by name over a dispute is a personal attack — Nextdoor removes these to prevent feuds.",
      suggested_fix: "Looking for recommendations: has anyone had a good (or bad) experience with gutter repair contractors lately? I want to compare notes before hiring."
    },
    clean: {
      compliant: true,
      category: null,
      reason: "Straightforward local lost‑and‑found post — no personal attacks, no politics, no commercial content.",
      suggested_fix: null
    }
  };

  // ---- Pure local scanner (no API, no keys) ----
  function localScan(text) {
    const lower = text.toLowerCase();
    const politics = /maga|trump|biden|democrat|republican|transgender|lgbtq|shapiro|tyson|culture war|woke/i;
    const shaming = /scammer|thief|liar|crook|con artist|steal|stole|fraud|never hire|watch out for \w+ \w+/i;
    const nameAttack = /john smith|jane doe|mr\.|ms\.|mrs\./i;
    const weapons = /gun|firearm|ammo|ammunition|rifle|pistol|drugs|weed|marijuana|cocaine/i;
    const spam = /mlm|pyramid|make money fast|click here|earn \$/i;

    let category = null;
    let reason = '';
    let suggestion = null;

    if (politics.test(lower)) {
      category = 'National Politics / Culture War';
      reason = 'This reads like a national political debate, not a local neighborhood topic. Nextdoor keeps these in dedicated Groups.';
      suggestion = 'Any other local parents feeling generational whiplash? I watched a scientific debate about modern social topics – how are you keeping communication open with teens today?';
    } else if (shaming.test(lower) || nameAttack.test(lower)) {
      category = 'Public Naming & Shaming';
      reason = 'Directly calling out an individual or business by name with accusations can turn into harassment. Nextdoor bans this.';
      suggestion = 'Suspicious activity notice: unfamiliar van near Main St, police non‑emergency notified. Keep porch lights on!';
    } else if (weapons.test(lower) || spam.test(lower)) {
      category = 'Unregulated Goods / Scams';
      reason = 'Selling restricted items or promoting sketchy business schemes is not allowed in the main feed.';
      suggestion = 'If you need contractor recs, ask neighbours for their personal experiences via DMs.';
    }

    if (category) {
      return { compliant: false, category, reason, suggested_fix: suggestion };
    } else {
      return { compliant: true, category: null, reason: 'Looks like a helpful, neighbourly post. No major red flags found.', suggested_fix: null };
    }
  }

  // ---- Rough fallback guess for arbitrary text ----
  function guessVerdict(text) {
    const lower = text.toLowerCase();
    const shamingWords = ['thief', 'scammer', 'liar', 'stole', 'don\'t hire', 'do not hire'];
    const politicalWords = ['maga', 'trump', 'biden', 'democrat', 'republican', 'transgenderism', 'shapiro'];

    if (shamingWords.some(w => lower.includes(w))) {
      return {
        compliant: false,
        category: 'Possible public shaming',
        reason: 'This reads like it names and blames a specific person, which Nextdoor treats as a personal attack.',
        suggested_fix: 'Describe the situation without naming the person, and ask neighbours for their own experiences instead.'
      };
    }
    if (politicalWords.some(w => lower.includes(w))) {
      return {
        compliant: false,
        category: 'Possible off‑topic politics',
        reason: 'This looks like national political or culture‑war content, which belongs in a Nextdoor Group, not the main feed.',
        suggested_fix: 'Reframe around the local angle — how this affects your street, block, or neighbours directly.'
      };
    }
    return {
      compliant: true,
      category: null,
      reason: 'No obvious red flags found in this local check.',
      suggested_fix: null
    };
  }

  // ---- UI helpers ----
  function showEmpty() {
    emptyNote.classList.remove('hidden');
    thinkingNote.classList.add('hidden');
    report.classList.add('hidden');
    checkBtn.disabled = false;
    checkBtnLabel.textContent = 'Check it';
    btnSpinner.classList.add('hidden');
  }

  function showThinking() {
    emptyNote.classList.add('hidden');
    thinkingNote.classList.remove('hidden');
    report.classList.add('hidden');
    checkBtn.disabled = true;
    checkBtnLabel.textContent = 'Checking';
    btnSpinner.classList.remove('hidden');
  }

  function renderVerdict(data) {
    emptyNote.classList.add('hidden');
    thinkingNote.classList.add('hidden');
    report.classList.remove('hidden');
    checkBtn.disabled = false;
    checkBtnLabel.textContent = 'Check it';
    btnSpinner.classList.add('hidden');

    // Reset stamp animation
    stamp.classList.remove('approved', 'violation');
    void stamp.offsetWidth;
    stamp.style.animation = 'none';
    void stamp.offsetWidth;
    stamp.style.animation = '';

    reasonValue.textContent = data.reason || '';

    if (data.compliant) {
      stamp.textContent = 'APPROVED';
      stamp.classList.add('approved');
      categoryRow.classList.add('hidden');
      fixRow.classList.add('hidden');
    } else {
      stamp.textContent = 'FLAGGED';
      stamp.classList.add('violation');
      categoryRow.classList.remove('hidden');
      categoryValue.textContent = data.category || 'Policy concern';

      if (data.suggested_fix) {
        fixValue.textContent = data.suggested_fix;
        fixRow.classList.remove('hidden');
      } else {
        fixRow.classList.add('hidden');
      }
    }
  }

  // ---- Character counter ----
  postInput.addEventListener('input', () => {
    charCount.textContent = `${postInput.value.length} characters`;
  });

  // ---- Preset buttons ----
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.preset;
      postInput.value = PRESETS[key];
      postInput.dispatchEvent(new Event('input'));
      postInput.dataset.presetKey = key;
    });
  });

  postInput.addEventListener('input', () => {
    delete postInput.dataset.presetKey;
  });

  // ---- Check button ----
  checkBtn.addEventListener('click', () => {
    const postText = postInput.value.trim();
    if (!postText) {
      alert('Write (or pick) a post to check first.');
      return;
    }

    showThinking();

    setTimeout(() => {
      const presetKey = postInput.dataset.presetKey;
      let result;
      if (presetKey && SIMULATIONS[presetKey]) {
        result = SIMULATIONS[presetKey];
      } else {
        const scanned = localScan(postText);
        if (scanned.compliant === false || scanned.reason !== 'Looks like a helpful, neighbourly post. No major red flags found.') {
          result = scanned;
        } else {
          result = guessVerdict(postText);
        }
      }
      renderVerdict(result);
    }, 700);
  });

  // ---- Copy button ----
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(fixValue.textContent).then(() => {
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = original; }, 1500);
    });
  });

  console.log('🚀 Pure local checker running — no APIs, no keys.');
});
