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
        background: #f1fcfa;
        border: 1px solid #b7ece5;
        border-radius: 12px;
        border-left: 4px solid #00bdae;
        box-shadow: 0 4px 12px rgba(10,91,84,.06);
        transition: all 0.2s;
      }
      #quiz-player {
        scroll-margin-top: 84px;
      }
      .exam-stmt-label {
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        font-size: 11px;
        color: #087c75 !important;
        background: #d4f7f0;
        padding: 3px 8px;
        border-radius: 6px;
        white-space: nowrap;
        letter-spacing: 0.4px;
        flex-shrink: 0;
      }
      .exam-stmt-text {
        font-size: 14.5px;
        color: #17363a !important;
        font-weight: 650;
        line-height: 1.55;
        flex: 1;
      }
      .exam-stmt-list { display: grid; gap: 8px; margin: 14px 0; }
      .quiz-question-copy { font-size: 16px; line-height: 1.6; font-weight: 600; }
      .quiz-question-lead { color: #102c30 !important; font-size: 14px; font-weight: 700; letter-spacing: .01em; }
      .quiz-question-prompt { margin-top: 18px; color: #17363a !important; font-size: 16px; font-weight: 700; line-height: 1.5; }
      
      @media (max-width: 600px) {
        .exam-stmt-row {
          margin: 0 !important;
          padding: 9px 10px !important;
          border-radius: 10px !important;
          gap: 8px !important;
        }
        .exam-stmt-label {
          display: inline-block !important;
          font-size: 10px !important;
          padding: 3px 6px !important;
          margin-bottom: 0 !important;
        }
        .exam-stmt-text {
          display: block !important;
          font-size: 13px !important;
          line-height: 1.38 !important;
        }
        .exam-stmt-list { gap: 7px !important; margin: 9px 0 !important; }
        .quiz-question-copy { font-size: 16px; line-height: 1.4; }
        .quiz-question-lead { font-size: 13px; }
        .quiz-question-prompt { margin-top: 10px; font-size: 14px; line-height: 1.4; }
        .quiz-options { gap: 7px; }
        .quiz-options button { min-height: 48px; padding: 10px 12px; font-size: 13px; line-height: 1.3; align-items: center; }
        .opt-badge { flex: 0 0 28px; height: 28px; display: inline-grid; place-items: center; }
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
        color: #17363a !important;
        font-weight: 600;
      }
      .quiz-feedback .correct-ans {
        font-size: 12.5px !important;
        margin-top: 4px !important;
      }
      
      @media (max-width: 600px) {
        .quiz-feedback {
          font-size: 12px !important;
          line-height: 1.35 !important;
          padding: 9px 10px !important;
          margin-top: 8px !important;
        }
        .quiz-feedback .explanation {
          font-size: 11px !important;
          line-height: 1.35 !important;
          margin-top: 4px !important;
        }
        .quiz-feedback .correct-ans {
          font-size: 11px !important;
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

  const QUESTION_REPAIRS = {
    'Consider: (A) All botanists are scientists. (B) No scientist is a mathematician. (C) Some botanists are mathematicians. Which statement is contradictory to the premises?': {
      question: 'Consider: (A) All botanists are scientists. (B) No scientist is a mathematician. Which conclusion follows?',
      options: [
        'No botanist is a mathematician.',
        'Some scientists are mathematicians.',
        'All botanists are mathematicians.',
        'Some botanists are not scientists.',
      ],
      answer_index: 0,
      explanation: 'All botanists are scientists, and no scientist is a mathematician. Therefore, no botanist can be a mathematician.',
    },
    'Given: (1) Some athletes are not mathematicians. (2) All mathematicians are scientists. Which of the following must be true?': {
      question: 'Given: (1) Some athletes are not mathematicians. (2) All mathematicians are scientists. Which of the following must be true?',
      options: [
        'All athletes are scientists.',
        'No scientist is an athlete.',
        'Some athletes are not mathematicians.',
        'Some scientists are athletes.',
      ],
      answer_index: 2,
      explanation: 'The first premise directly guarantees that some athletes are not mathematicians. The second premise does not establish any athlete–scientist relationship.',
    },
  };

  function current() {
    const q = quiz.questions[order[idx]];
    return QUESTION_REPAIRS[q.question] ? { ...q, ...QUESTION_REPAIRS[q.question] } : q;
  }

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
    // Preserve line boundaries: some UPSC source questions describe labels
    // as "I and II" before the actual statements. The real I./II. labels
    // begin on their own lines.
    let raw = String(questionText).replace(/\r\n?/g, '\n').replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n').trim();
    // Do not present an unverified exam claim as provenance. If imported copy
    // says “A question in the TNPSC mains asks…”, this is an adapted practice
    // item unless the data record carries verified PYQ metadata.
    const practiceClaim = /^A question in (?:the )?(?:TNPSC|UPSC|SSC)[^:]*\s+asks:\s*/i.test(raw);
    if (practiceClaim) raw = raw.replace(/^A question in (?:the )?(?:TNPSC|UPSC|SSC)[^:]*\s+asks:\s*/i, '');
    const plainQuestion = () => `<div class="${practiceClaim ? 'quiz-practice-question ' : ''}quiz-question-copy${raw.length > 260 ? ' quiz-question-copy--dense' : ''}">${practiceClaim ? '<span class="question-kind">Practice question</span>' : ''}${esc(raw)}</div>`;
    // A second source convention puts Roman labels directly after one
    // "Statements:" heading: "Statements: I: … II: …". Turn those into
    // line labels before detecting statement boundaries.
    if (/\bStatements\s*:/i.test(raw)) {
      raw = raw.replace(/\bStatements\s*:\s*/gi, 'Statements:\n');
      raw = raw.replace(/\b(VIII|VII|VI|IV|III|II|IX|V|X|I)\s*:/gi, '\n$1.');
    }
    const promptPattern = /\b(Select the correct answer(?:\s+using the codes below)?|Which of the following|Which statement|Which conclusion|Which inference|What follows|What can be deduced|What is the logical conclusion|What is a valid deduction)[^?]*\??/i;
    // Only accept a number as a label at a genuine list boundary. This avoids
    // splitting normal prose such as "between 10 and 20." into fake cards.
    const marker = /(?:(?:^|\n|;)\s*\d{1,2}[.)]|(?:^|\n)\s*(?:VIII|VII|VI|IV|III|II|IX|V|X|I)[.)]|Statement\s*(?:\d+|VIII|VII|VI|IV|III|II|IX|V|X|I)\s*:)/gim;
    let matches = [...raw.matchAll(marker)];
    // Parenthesised labels are valid only in an explicit list-like question.
    // Limiting them to (1)–(9) prevents maths such as (23)^56 + (47)^23
    // from being rendered as fake statements.
    if (/\b(?:statements?|given|pairs?|sentences|premises?)\b/i.test(raw)) {
      // Some source files put "1. … 2. … 3. …" after a question on one
      // line. Once an explicit statements context is present, those are list
      // labels—not sentence numbers—so give each one its own line boundary.
      const inlineLabels = [...raw.matchAll(/\s([1-9])[.)]\s+/g)];
      if (inlineLabels.length >= 2) {
        raw = raw.replace(/\s([1-9])[.)]\s+/g, '\n$1. ');
        matches = [...raw.matchAll(marker)];
      }
      matches = matches.concat([...raw.matchAll(/\([1-9]\)/g)]).sort((a, b) => a.index - b.index);
    }
    let lead;
    let statements;

    if (matches.length >= 2) {
      lead = raw.slice(0, matches[0].index).replace(/(?:Statements?)?[:\s]+$/i, '').trim();
      statements = matches.map((match, i) => ({
        label: match[0].trim().replace(/^;\s*/, '').replace(/:$/, ''),
        text: raw.slice(match.index + match[0].length, i + 1 < matches.length ? matches[i + 1].index : raw.length).trim(),
      })).filter(({ text }) => text);
    } else if (/^statements\s*:/i.test(raw)) {
      const sentences = raw.replace(/^statements\s*:\s*/i, '').replace(/\bconclusion\s*:\s*$/i, '').match(/[^.!?]+(?:[.!?]+|$)/g) || [];
      lead = 'Consider the following statements';
      statements = sentences.map((text, i) => ({ label: `Statement ${i + 1}`, text: text.trim() }));
    } else {
      return plainQuestion();
    }

    if (statements.length < 2) return plainQuestion();
    // Separate an instruction following the final statement ("Select the
    // correct answer …") so it never gets swallowed into statement text.
    const last = statements[statements.length - 1];
    const tailPrompt = last.text.match(promptPattern);
    const prompt = tailPrompt ? tailPrompt[0].trim() : '';
    if (tailPrompt) last.text = last.text.slice(0, tailPrompt.index).trim();
    const dense = raw.length > 340 || statements.length >= 3;

    return `<div class="exam-question${dense ? ' exam-question--dense' : ''}">
      ${lead ? `<div class="quiz-question-lead">${esc(lead)}</div>` : `<div class="quiz-question-lead">Read the following ${statements.length} statements</div>`}
      <div class="exam-stmt-list exam-stmt-list--${statements.length}">${statements.map(({ label, text }) => `
        <div class="exam-stmt-row"><span class="exam-stmt-label">${esc(label)}</span><span class="exam-stmt-text">${esc(text)}</span></div>`).join('')}</div>
      ${prompt ? `<div class="quiz-question-prompt">${esc(prompt)}</div>` : ''}</div>`;
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
    const effectiveOptions = q.options;

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
      if (i === choice && i !== q.answer_index) b.classList.add('wrong', 'shake');
    });

    const ok = choice === q.answer_index;
    if (ok) {
      score++;
      triggerCorrectConfetti();
    } else {
      mistakes.push({ q, choice, effectiveOptions });
    }

    feedback.hidden = false;
    feedback.className = `quiz-feedback ${ok ? 'is-correct' : 'is-wrong'}`;
    feedback.innerHTML = q.explanation
      ? `<div class="explanation"><span class="explanation-label">Explanation</span>${esc(q.explanation)}</div>`
      : '';

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
    
    // Split questions into statement-based and direct MCQs
    const pattern = /(?:Statement\s*\d+|Statement\s*[I|V|X]+|\b[1-9]\.|\(\d{1,2}\))/i;
    const statements = [];
    const directs = [];
    
    const usable = (q) => Array.isArray(q.options)
      && q.options.length === 4
      && Number.isInteger(q.answer_index)
      && q.answer_index >= 0
      && q.answer_index < q.options.length
      && q.options.every((option) => String(option).trim().length > 2)
      && new Set(q.options.map((option) => String(option).trim().toLowerCase())).size === q.options.length;

    quiz.questions.forEach((q, i) => {
      if (!usable(q)) return;
      if (pattern.test(q.question)) {
        statements.push(i);
      } else {
        directs.push(i);
      }
    });
    
    // Target 20 questions total (10 statements, 10 directs)
    const targetHalf = 10;
    const shuffledStmts = shuffle(statements);
    const shuffledDirects = shuffle(directs);
    
    let selectedStmts = [];
    let selectedDirects = [];
    
    if (shuffledStmts.length >= targetHalf && shuffledDirects.length >= targetHalf) {
      selectedStmts = shuffledStmts.slice(0, targetHalf);
      selectedDirects = shuffledDirects.slice(0, targetHalf);
    } else {
      const limit = Math.min(shuffledStmts.length, shuffledDirects.length);
      if (limit > 0) {
        selectedStmts = shuffledStmts.slice(0, Math.max(targetHalf, limit));
        selectedDirects = shuffledDirects.slice(0, Math.max(targetHalf, limit));
      } else {
        // Fallback: shuffle all and take first 20 if one pool is completely empty
        const all = shuffle(quiz.questions.map((_, i) => i).filter((i) => usable(quiz.questions[i])));
        order = all.slice(0, 20);
        idx = 0;
        score = 0;
        mistakes = [];
        started = Date.now();
        nextBtn.textContent = 'Next →';
        player.hidden = false;
        document.documentElement.classList.add('mg-quiz-active');
        let restartBtn = player.querySelector('[data-restart-quiz]');
        if (!restartBtn) {
          restartBtn = document.createElement('button');
          restartBtn.type = 'button';
          restartBtn.className = 'quiz-restart';
          restartBtn.dataset.restartQuiz = '';
          restartBtn.textContent = 'Restart';
          restartBtn.addEventListener('click', begin);
          player.querySelector('.quiz-status')?.appendChild(restartBtn);
        }
        startBtn.textContent = 'Restart Quiz';
        startBtn.disabled = false;
        render();
        player.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    
    order = shuffle([...selectedStmts, ...selectedDirects]).slice(0, 20);
    idx     = 0;
    score   = 0;
    mistakes = [];
    started = Date.now();
    nextBtn.textContent = 'Next →';
    player.hidden = false;
    document.documentElement.classList.add('mg-quiz-active');
    let restartBtn = player.querySelector('[data-restart-quiz]');
    if (!restartBtn) {
      restartBtn = document.createElement('button');
      restartBtn.type = 'button';
      restartBtn.className = 'quiz-restart';
      restartBtn.dataset.restartQuiz = '';
      restartBtn.textContent = 'Restart';
      restartBtn.addEventListener('click', begin);
      player.querySelector('.quiz-status')?.appendChild(restartBtn);
    }
    startBtn.textContent = 'Restart Quiz';
    startBtn.disabled = false;
    render();
    player.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  startBtn.addEventListener('click', begin);
  nextBtn.addEventListener('click', goNext);

  // Keyboard Shortcuts for Speedrunning
  window.addEventListener('keydown', (e) => {
    if (!player || player.hidden) return;
    
    const key = e.key.toLowerCase();
    if (!answered) {
      const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
      if (key in keyMap) {
        const optionIdx = keyMap[key];
        const buttons = optsEl.querySelectorAll('button');
        if (buttons && buttons[optionIdx] && !buttons[optionIdx].disabled) {
          buttons[optionIdx].click();
        }
      }
    } else if (!nextBtn.disabled) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        nextBtn.click();
      }
    }
  });
})();

window.addEventListener('DOMContentLoaded',()=>{if(new URLSearchParams(location.search).get('start')==='1'){document.querySelector('[data-start-quiz]')?.click()}});
