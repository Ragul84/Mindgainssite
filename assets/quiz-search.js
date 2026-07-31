(() => {
  // Inject custom stylesheet for responsive statements
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      .exam-stmt-row {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin: 10px 0;
        padding: 12px 16px;
        background: rgba(255,255,255,0.035);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        border-left: 4px solid #7BE3B0;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        transition: all 0.2s;
      }
      #quiz-player {
        scroll-margin-top: 84px;
      }
      .exam-stmt-label {
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        font-size: 11px;
        color: #7BE3B0;
        background: rgba(123,227,176,0.14);
        padding: 3px 8px;
        border-radius: 6px;
        white-space: nowrap;
        letter-spacing: 0.4px;
        flex-shrink: 0;
      }
      .exam-stmt-text {
        font-size: 14.5px;
        color: rgba(255,255,255,0.95);
        line-height: 1.55;
        flex: 1;
      }
      
      @media (max-width: 600px) {
        .exam-stmt-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          margin: 6px 0;
          padding: 8px 12px;
          border-radius: 8px;
        }
        .exam-stmt-label {
          font-size: 10px;
          padding: 2px 6px;
        }
        .exam-stmt-text {
          font-size: 13px;
          line-height: 1.45;
        }
      }

      .quiz-feedback {
        font-size: 13px !important;
        line-height: 1.5 !important;
        padding: 12px 14px !important;
        margin-top: 12px !important;
      }
      .quiz-feedback .explanation {
        font-size: 12.5px !important;
        line-height: 1.5 !important;
        margin-top: 6px !important;
        color: rgba(255, 255, 255, 0.7) !important;
      }
      .quiz-feedback .correct-ans {
        font-size: 12.5px !important;
        margin-top: 4px !important;
      }
      
      @media (max-width: 600px) {
        .quiz-feedback {
          font-size: 12px !important;
          line-height: 1.4 !important;
          padding: 8px 10px !important;
          margin-top: 8px !important;
        }
        .quiz-feedback .explanation {
          font-size: 11.5px !important;
          line-height: 1.4 !important;
          margin-top: 4px !important;
        }
        .quiz-feedback .correct-ans {
          font-size: 11.5px !important;
          margin-top: 2px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (m) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])
    );

  // Standard UPSC assertion-reason / statement options
  const STATEMENT_OPTIONS = [
    'Both Statement 1 and Statement 2 are correct, and Statement 2 is the correct explanation of Statement 1',
    'Both Statement 1 and Statement 2 are correct, but Statement 2 is NOT the correct explanation of Statement 1',
    'Statement 1 is correct but Statement 2 is incorrect',
    'Statement 1 is incorrect but Statement 2 is correct',
  ];

  /**
   * Detect if a question is a "Statement 1 / Statement 2" type
   * with broken bare-letter options like ["A","B","C","D"].
   */
  function isStatementQuestion(q) {
    if (!q || !q.options || q.options.length !== 4) return false;
    const bareLetters = q.options.every((o, i) =>
      o.trim() === String.fromCharCode(65 + i) || o.trim().length <= 2
    );
    return bareLetters && /statement\s*[12]/i.test(q.question);
  }

  /**
   * Parse "Statement 1: … Statement 2: …" out of a question string.
   * Splits on "Statement N:" boundaries — robust to apostrophes,
   * long sentences, mid-sentence periods, etc.
   */
  function parseStatements(questionText) {
    // Split on every "Statement <digit>:" occurrence
    const boundary = /Statement\s*\d+\s*:/gi;
    const labels   = [...questionText.matchAll(/Statement\s*(\d+)\s*:/gi)].map(m => `Statement ${m[1]}`);
    const parts    = questionText.split(boundary).map(s => s.trim()).filter(Boolean);

    // Need at least the intro + 2 statements
    if (parts.length < 2 || labels.length < 2) return null;

    // parts[0] may be intro text before first "Statement 1:", skip it if it's empty-ish
    // parts[1] = Statement 1 body, parts[2] = Statement 2 body, etc.
    const stmtBodies = parts.slice(parts.length - labels.length); // align bodies to labels

    return labels.map((label, i) => ({
      label,
      text: stmtBodies[i] ? stmtBodies[i].replace(/\s+/g, ' ').trim() : '',
    })).filter(s => s.text.length > 0);
  }

  // ── search ───────────────────────────────────────────────────────────────
  let data = [];
  let indexLoaded = false;
  const input = document.getElementById('quiz-search');
  const box = document.getElementById('quiz-search-results');

  function searchable(item) {
    return [item.title, item.copy, item.type, item.url]
      .join(' ')
      .replace(/[/-]/g, ' ')
      .toLowerCase();
  }

  function runSearch() {
    if (!input || !box) return;
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { box.hidden = true; box.innerHTML = ''; return; }
    if (!indexLoaded) {
      box.hidden = false;
      box.innerHTML = '<div class="search-empty">Loading quiz index…</div>';
      return;
    }
    const terms = q.split(/\s+/).filter(Boolean);
    const hits = data
      .map((item) => ({ item, haystack: searchable(item) }))
      .filter(({ haystack }) => terms.every((t) => haystack.includes(t)))
      .slice(0, 10)
      .map(({ item }) => item);

    box.hidden = false;
    box.innerHTML = hits.length
      ? hits
          .map(
            (i) =>
              `<a href="${esc(i.url)}"><span><strong>${esc(i.title)}</strong><small> — ${esc(i.copy)}</small></span><em>${esc(i.type)}</em></a>`
          )
          .join('')
      : '<div class="search-empty">No matching quiz found. Try a topic like DPSP, photosynthesis, polity, or percentage.</div>';
  }

  if (input && box) {
    fetch('/assets/quiz-index.json')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((x) => { data = Array.isArray(x) ? x : []; indexLoaded = true; runSearch(); })
      .catch(() => { indexLoaded = true; data = []; runSearch(); });
    input.addEventListener('input', runSearch);
    input.addEventListener('focus', runSearch);
  }

  // ── quiz player ──────────────────────────────────────────────────────────
  const player = document.getElementById('quiz-player');
  const startBtn = document.querySelector('[data-start-quiz]');
  if (!player || !startBtn) return;

  const src      = player.dataset.quizSrc;
  const qEl      = player.querySelector('[data-question]');
  const optsEl   = player.querySelector('[data-options]');
  const feedback = player.querySelector('[data-feedback]');
  const nextBtn  = player.querySelector('[data-next]');
  const progress = player.querySelector('[data-progress]');
  const scoreEl  = player.querySelector('[data-score]');
  const meter    = player.querySelector('[data-meter]');

  let quiz = null, order = [], idx = 0, score = 0, mistakes = [], started = 0, answered = false;

  const shuffle = (a) => {
    const x = a.slice();
    for (let i = x.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [x[i], x[j]] = [x[j], x[i]];
    }
    return x;
  };

  async function load() {
    if (quiz) return quiz;
    const res = await fetch(src);
    quiz = await res.json();
    return quiz;
  }

  function current() { return quiz.questions[order[idx]]; }

  // ── Confetti Particle Burst Engine ──────────────────────────────────────────
  function triggerCorrectConfetti() {
    try {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '999999';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const colors = ['#7BE3B0', '#38BDF8', '#A78BFA', '#F472B6', '#FACC15'];

      for (let i = 0; i < 45; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 200,
          y: canvas.height * 0.42,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.8) * 13,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.25,
          opacity: 1
        });
      }

      let frame = 0;
      function anim() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.38;
          p.opacity -= 0.022;
          p.rotation += p.vRot;
          if (p.opacity > 0) {
            alive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
          }
        });
        if (alive && frame < 55) {
          frame++;
          requestAnimationFrame(anim);
        } else {
          canvas.remove();
        }
      }
      requestAnimationFrame(anim);
    } catch(e) {}
  }

  // ── Multi-Statement Exam Formatting Helper ──────────────────────────────
  function formatExamQuestionText(questionText) {
    if (!questionText) return '';
    let raw = String(questionText).trim();

    const statementPattern = /(?:Statement\s*\d+|Statement\s*[I|V|X]+|\b[1-9]\.|\(\d+\))/i;
    if (!statementPattern.test(raw)) {
      return `<div style="font-size:16px;line-height:1.65;font-weight:600;margin-bottom:16px;">${esc(raw)}</div>`;
    }

    let leadText = 'Consider the following statements:';
    const leadMatch = raw.match(/^(Consider the following statements?:?|Which of the following statements is\/are correct\??|With reference to [^,]+, consider the following statements?:?)/i);
    if (leadMatch) {
      leadText = leadMatch[0];
      raw = raw.slice(leadText.length).trim();
    }

    const statementRegex = /(?:Statement\s*\d+|Statement\s*[I|V|X]+|\b[1-9]\.|\(\d+\))/gi;
    const matches = [...raw.matchAll(statementRegex)];
    let statementsHtml = '';
    let closingText = '';

    if (matches.length > 0) {
      for (let i = 0; i < matches.length; i++) {
        const label = matches[i][0];
        const startIdx = matches[i].index + label.length;
        const endIdx = (i + 1 < matches.length) ? matches[i + 1].index : raw.length;
        let stmtContent = raw.slice(startIdx, endIdx).trim();

        if (i === matches.length - 1) {
          const closingMatch = stmtContent.match(/(Which of the (?:statements|above)[^?]*\??)/i);
          if (closingMatch) {
            closingText = `<div style="font-weight:700;margin-top:18px;color:#FFFFFF;font-size:15px;line-height:1.5;">${esc(closingMatch[0])}</div>`;
            stmtContent = stmtContent.slice(0, closingMatch.index).trim();
          }
        }

        statementsHtml += `
          <div class="exam-stmt-row">
            <span class="exam-stmt-label">${esc(label)}</span>
            <span class="exam-stmt-text">${esc(stmtContent)}</span>
          </div>`;
      }
    } else {
      statementsHtml = `<div style="font-size:15.5px;line-height:1.65;">${esc(raw)}</div>`;
    }

    if (!closingText && !raw.toLowerCase().includes('which of the')) {
      closingText = '<div style="font-weight:700;margin-top:18px;color:#FFFFFF;font-size:15px;">Which of the statements given above is/are correct?</div>';
    }

    return `
      <div style="font-weight:700;color:#7BE3B0;font-size:15px;margin-bottom:14px;letter-spacing:0.2px;">${esc(leadText)}</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin:14px 0;">${statementsHtml}</div>
      ${closingText}`;
  }

  // ── render question ──────────────────────────────────────────────────────
  function render() {
    const q = current();
    answered = false;
    feedback.hidden = true;
    feedback.innerHTML = '';
    feedback.className = 'quiz-feedback';
    nextBtn.disabled = true;

    // Update status
    progress.textContent = `Question ${idx + 1}`;
    scoreEl.textContent  = `✦ ${score} pts`;
    meter.style.width    = Math.round(((idx + 1) / order.length) * 100) + '%';

    // ── Render question text with structured statement formatting ─────────
    const isStmt = isStatementQuestion(q);
    const effectiveOptions = isStmt ? STATEMENT_OPTIONS : q.options;

    qEl.innerHTML = formatExamQuestionText(q.question);

    // ── Render options with badge labels ──────────────────────────────────
    optsEl.innerHTML = effectiveOptions
      .map(
        (o, i) =>
          `<button type="button" data-option="${i}">
            <span class="opt-badge">${String.fromCharCode(65 + i)}</span>
            <span class="opt-text">${esc(o)}</span>
          </button>`
      )
      .join('');

    optsEl.querySelectorAll('button').forEach((b) =>
      b.addEventListener('click', () => answer(Number(b.dataset.option), effectiveOptions, q))
    );
  }

  // ── handle answer ────────────────────────────────────────────────────────
  function answer(choice, effectiveOptions, q) {
    if (answered) return;
    answered = true;

    const buttons = [...optsEl.querySelectorAll('button')];
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer_index) b.classList.add('correct');
      if (i === choice && i !== q.answer_index) b.classList.add('wrong');
    });

    const ok = choice === q.answer_index;
    if (ok) {
      score++;
      triggerCorrectConfetti();
    } else {
      mistakes.push({ q, choice, effectiveOptions });
    }

    const correctText = effectiveOptions[q.answer_index];

    feedback.hidden = false;
    feedback.className = `quiz-feedback ${ok ? 'is-correct' : 'is-wrong'}`;
    feedback.innerHTML =
      `<strong class="${ok ? 'correct-label' : 'wrong-label'}">
        ${ok ? '✓ Correct!' : '✗ Incorrect'}
      </strong>` +
      (!ok
        ? `<div class="correct-ans">✓ Correct answer: ${esc(correctText)}</div>`
        : '') +
      (q.explanation
        ? `<div class="explanation">${esc(q.explanation)}</div>`
        : '');

    scoreEl.textContent = `✦ ${score} pts`;
    nextBtn.disabled = false;

    // Auto-scroll explanation and Next button smoothly into view so user doesn't need to scroll!
    setTimeout(() => {
      const target = !feedback.hidden ? feedback : nextBtn;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 70);
  }

  // ── finish screen ────────────────────────────────────────────────────────
  function finish() {
    const seconds  = Math.max(1, Math.round((Date.now() - started) / 1000));
    const accuracy = Math.round((score / order.length) * 100);
    meter.style.width = '100%';

    qEl.innerHTML =
      `<span style="font-size:14px;color:var(--text-muted);font-style:normal;font-family:Inter,sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Quiz Complete</span>`;

    optsEl.innerHTML =
      `<div class="result-card">
        <div class="result-grid">
          <div>
            <span>Score</span>
            <strong>${score} / ${order.length}</strong>
          </div>
          <div>
            <span>Accuracy</span>
            <strong>${accuracy}%</strong>
          </div>
          <div>
            <span>Time</span>
            <strong>${Math.floor(seconds / 60)}m ${seconds % 60}s</strong>
          </div>
        </div>
        <div class="result-actions">
          <button type="button" id="btn-review">Review Mistakes (${mistakes.length})</button>
          <button type="button" id="btn-retake">Retake Quiz</button>
        </div>
        <div class="mistake-list" id="mistake-list" hidden></div>
      </div>`;

    feedback.hidden = true;
    nextBtn.disabled = true;
    nextBtn.textContent = 'Done';

    document.getElementById('btn-retake').addEventListener('click', begin);
    document.getElementById('btn-review').addEventListener('click', () => {
      const list = document.getElementById('mistake-list');
      list.hidden = !list.hidden;
      if (!list.hidden) {
        list.innerHTML = mistakes.length
          ? mistakes
              .map(
                (m, i) =>
                  `<article>
                    <strong>Q${i + 1}. ${esc(m.q.question)}</strong>
                    <p>Your answer: ${esc((m.effectiveOptions || m.q.options)[m.choice] || 'Not answered')}</p>
                    <p>Correct answer: <strong>${esc((m.effectiveOptions || m.q.options)[m.q.answer_index])}</strong></p>
                    ${m.q.explanation ? `<p>${esc(m.q.explanation)}</p>` : ''}
                  </article>`
              )
              .join('')
          : '<article>🎉 No mistakes — perfect round!</article>';
      }
    });
  }

  function goNext() {
    if (idx >= order.length - 1) { finish(); return; }
    idx++;
    render();
    // Smooth scroll the entire player into view (clears sticky headers using scroll-margin-top)
    if (player) {
      player.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async function begin() {
    startBtn.disabled = true;
    startBtn.textContent = 'Loading…';
    await load();
    order   = shuffle(quiz.questions.map((_, i) => i));
    idx     = 0;
    score   = 0;
    mistakes = [];
    started = Date.now();
    nextBtn.textContent = 'Next →';
    player.hidden = false;
    startBtn.textContent = 'Restart Quiz';
    startBtn.disabled = false;
    render();
    player.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  startBtn.addEventListener('click', begin);
  nextBtn.addEventListener('click', goNext);
})();
