(() => {
  // ── helpers ─────────────────────────────────────────────────────────────
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

  // ── render question ──────────────────────────────────────────────────────
  function render() {
    const q = current();
    answered = false;
    feedback.hidden = true;
    feedback.innerHTML = '';
    feedback.className = 'quiz-feedback';
    nextBtn.disabled = true;

    // Update status
    progress.textContent = `Q ${idx + 1} of ${order.length}`;
    scoreEl.textContent  = `✦ ${score} pts`;
    meter.style.width    = Math.round((idx / order.length) * 100) + '%';

    // ── Render question text with statement parsing ────────────────────────
    const isStmt    = isStatementQuestion(q);
    const effectiveOptions = isStmt ? STATEMENT_OPTIONS : q.options;

    if (isStmt) {
      const parsed = parseStatements(q.question);
      if (parsed && parsed.length >= 2) {
        // Grab any text before "Statement 1:" as prefix (safe with indexOf)
        const firstIdx = q.question.search(/Statement\s*1\s*:/i);
        const prefix   = firstIdx > 0 ? q.question.slice(0, firstIdx).trim() : '';

        const stmtHTML = parsed
          .map(
            (s) =>
              `<span class="stmt-item"><span class="stmt-label">${esc(s.label)}</span><span>${esc(s.text)}</span></span>`
          )
          .join('');

        qEl.innerHTML =
          (prefix ? '<span style="font-style:normal;font-size:15px;font-family:Inter,sans-serif;color:var(--text-muted)">' + esc(prefix) + '</span><br><br>' : '') +
          'Consider the following statements:<div class="stmt-block">' + stmtHTML + '</div>' +
          '<br>Which of the following is correct?';
      } else {
        qEl.textContent = q.question;
      }
    } else {
      qEl.textContent = q.question;
    }

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
    if (ok) score++;
    else mistakes.push({ q, choice, effectiveOptions });

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
    // Smooth scroll to question on mobile
    if (window.innerWidth < 600) {
      qEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
