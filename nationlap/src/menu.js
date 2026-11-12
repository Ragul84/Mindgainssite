// Title screen, first-run racer setup ("you"), the pre-race Ready card, pause menu, gamepad navigation.
// The old CHOOSE YOUR RACER grid is gone: the journey map already picks the topic, the player
// races as themselves, and the 8 themed characters are the subject mentors / rival aspirants.
import { STATES, myState, setMyState, isFamily, setFamily } from './prefs.js';
import { bus } from './events.js';
import { AVATARS, KART_COLORS, NAME_MAX, loadProfile, saveProfile, playerCharacter } from './player.js';

const hex = (c) => '#' + (c >>> 0).toString(16).padStart(6, '0').slice(-6);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

function el(tag, cls, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}
const isTyping = (e) => { const t = e && e.target; return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable); };

const CONTROLS_HTML = `
  <div class="ctl"><span class="kc">↑</span><span class="kc">W</span> Accelerate</div>
  <div class="ctl"><span class="kc">↓</span><span class="kc">S</span> Brake / Reverse</div>
  <div class="ctl"><span class="kc">←→</span><span class="kc">A D</span> Steer</div>
  <div class="ctl"><span class="kc wide">SPACE</span> Hop / Drift</div>
  <div class="ctl"><span class="kc">E</span><span class="kc">X</span><span class="kc wide">L-SHIFT</span> Use item</div>
  <div class="ctl"><span class="kc">C</span> Look back</div>
  <div class="ctl"><span class="kc wide">ESC</span><span class="kc">P</span> Pause</div>
  <div class="ctl"><span class="kc">M</span> Mute</div>`;

export class Menu {
  constructor(uiRoot, handlers = {}) {
    this.uiRoot = uiRoot;
    // { onStart, onReadyBack, onResume, onRestart, onQuit, onMap, onQuickRace, onResumeRun,
    //   onEditRacer, onAvatarDone, onScreen }
    this.h = handlers;
    this.screen = null; // 'title' | 'ready' | 'avatar' | 'pause' | 'loading' | null
    this.portraitFn = null;
    this.pauseIndex = 0;
    this._pad = { prev: {}, repeatT: 0, dir: null };
    this.gameState = 'title';
    this.avatarFirst = false;
    this.draft = loadProfile();

    this._buildTitle();
    this._buildReady();
    this._buildAvatar();
    this._buildPause();
    this._buildLoading();

    this._onKey = (e) => this._key(e);
    window.addEventListener('keydown', this._onKey);
  }

  setPortraitProvider(fn) {
    this.portraitFn = fn;
    this._portraits = new Map();
    this._refreshTitleRacer();
    this._refreshAvatar();
  }
  portrait(ch) {
    if (!ch || !this.portraitFn) return '';
    this._portraits = this._portraits || new Map();
    if (this._portraits.has(ch.id)) return this._portraits.get(ch.id);
    let url = '';
    try { url = this.portraitFn(ch) || ''; } catch (e) { url = ''; }
    this._portraits.set(ch.id, url);
    return url;
  }
  _faceHtml(ch, cls = '') {
    const url = this.portrait(ch);
    return `<span class="face ${cls}" style="--kc:${hex(ch.color)}">${url ? `<img src="${url}" alt="">` : `<span class="initial">${esc((ch.name || '?')[0])}</span>`}</span>`;
  }

  // ------------------------------------------------------------------ build
  _buildTitle() {
    const t = this.titleEl = el('div', 'screen title-screen', this.uiRoot);
    // The wordmark is deliberately two stacked lines, NATION over LAP, rather than the title
    // split on spaces: "NationLap" is one word, so that produced a single nine-letter line that
    // ran off the edges of a phone and read as one long run of letters. Two lines also lets the
    // gold/blue split do the same job the MindGains wordmark does.
    const [first, second] = ['NATION', 'LAP'];
    const words = [second];
    t.innerHTML = `
      <div class="title-vignette"></div>
      <div class="game-rail left"></div>
      <div class="game-rail right"></div>
      <button type="button" class="title-racer" title="Edit racer"></button>
      <div class="logo">
        <div class="logo-line l1" data-text="${first}">${first}</div>
        <div class="logo-line l2" data-text="${words.join(' ')}">${words.join(' ')}</div>
        <div class="logo-swoosh"></div>
      </div>
      <div class="title-actions">
        <button type="button" class="btn primary play-btn">LEARN &amp; RACE<small class="play-sub">Read a lesson, then race it</small></button>
        <button type="button" class="btn resume-btn hidden">RESUME CUP</button>
        <div class="title-row">
          <button type="button" class="dock news-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="13.5" height="14" rx="1.5"/><path d="M16.5 9H20v8.5a1.5 1.5 0 0 1-3 0V9M6.5 9h6M6.5 12.5h6M6.5 16h4"/></svg><span>NEWS</span><small class="news-sub"></small></button>
          <button type="button" class="dock affairs-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4zM9 4v14M15 6v14"/></svg><span>YATRA</span></button>
          <button type="button" class="dock quick-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg><span>QUICK</span></button>
          <button type="button" class="dock board-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8"/></svg><span>BOARD</span></button>
        </div>
        <button type="button" class="live-event theatre-btn" aria-label="Enter NationLap Live theatre">
          <span class="le-shine"></span>
          <span class="le-thumb"><img src="/assets/nationlap-shots/theatre.jpg" alt=""><span class="le-pill"><i></i>LIVE</span></span>
          <span class="le-txt"><span class="le-k">LIVE THEATRE</span><span class="le-t theatre-title">Today's class</span><span class="le-s theatre-sub">Walk in, take a seat, quiz live</span></span>
          <span class="le-go">ENTER ›</span>
        </button>
        <div class="title-tagline">Know your India, every day.</div>
      </div>
      <div class="title-foot">
        <span>© NationLap · MindGains</span>
        <span class="mute-hint"><span class="kc">M</span> mute</span>
      </div>`;
    // The front door is the syllabus: pick a lesson, read it, race it.
    t.querySelector('.play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      bus.emit('ui:confirm');
      this.h.onJourney?.();
    });
    t.querySelector('.news-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      bus.emit('ui:confirm');
      this.h.onAffairs?.();
    });
    // Quick race is the deliberate opt-out: straight onto the track, no topic, no lesson.
    t.querySelector('.quick-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      bus.emit('ui:confirm');
      this.h.onQuickRace?.();
    });
    // BHARAT YATRA: the map of India, one race per state.
    t.querySelector('.affairs-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.h.onMap?.();
    });
    this.newsSub = t.querySelector('.news-sub');

    (async () => { try {
      const tt = await (await fetch('/play/theatre/timetable.json')).json(), H = tt.halls.main;
      const d = new Date(Date.now() + (330 + new Date().getTimezoneOffset()) * 60000), m = d.getHours() * 60 + d.getMinutes();
      const day = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][d.getDay()], subj = H.week[day].subject.split(/[ (+]/)[0];
      const pm = 18 * 60, sub = t.querySelector('.theatre-sub');
      t.querySelector('.theatre-title').textContent = `${subj} Day · now showing`;
      if (m < pm) { const l = pm - m; sub.textContent = `⭐ 6 PM MIGA premiere in ${l >= 60 ? Math.floor(l / 60) + 'h ' : ''}${l % 60}m`; }
      else if (m < pm + 30) sub.textContent = '⭐ MIGA PREMIERE · ON NOW';
      else sub.textContent = 'Live quiz every 4 min · top 5 on screen';
    } catch (e) {} })();
    t.querySelector('.theatre-btn').addEventListener('click', (e) => { e.stopPropagation(); location.href = '/play/theatre/?from=nationlap'; });
    t.querySelector('.board-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      bus.emit('ui:confirm');
      this.h.onBoard?.();
    });
    this.resumeBtn = t.querySelector('.resume-btn');
    this.resumeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.h.onResumeRun?.();
    });
    this.titleRacer = t.querySelector('.title-racer');
    this.titleRacer.addEventListener('click', (e) => {
      e.stopPropagation();
      bus.emit('ui:confirm');
      this.h.onEditRacer?.();
    });
    this._refreshTitleRacer();
  }
  /**
   * Who you are, signed in or not.
   *
   * Signing in on mindgains.ai and then opening the game showed the local racer profile with no
   * sign of the Google account — it looked like the sign-in hadn't carried. When there's a
   * session, the chip shows that account's photo and name, with the kart face tucked in beside
   * it so "edit racer" is still one tap away.
   */
  setAccount(acct) {
    this.account = acct || null;
    this._refreshTitleRacer();
  }
  /** The news streak, small under TODAY'S NEWS. */
  setNewsStreak(st) {
    if (!this.newsSub || !st) return;
    this._streakText = st.n ? `🔥 ${st.n} day${st.n > 1 ? 's' : ''}${st.today ? ' ✓' : ''}` : '';
    this.newsSub.textContent = this._latestText || this._streakText;
  }
  /** While the feed is behind, the button says which day's news it holds. */
  setNewsLatest(text) {
    this._latestText = text || '';
    if (this.newsSub) this.newsSub.textContent = this._latestText || this._streakText || '';
  }

  _refreshTitleRacer() {
    if (!this.titleRacer) return;
    const ch = playerCharacter();
    const a = this.account;
    if (a) {
      const pic = a.photoURL
        ? `<img class="tr-photo" src="${esc(a.photoURL)}" alt="" referrerpolicy="no-referrer">`
        : `<span class="tr-photo tr-photo-ini">${esc((a.name || '?')[0].toUpperCase())}</span>`;
      this.titleRacer.innerHTML = `${pic}<span class="tr-text">`
        + `<span class="tr-name">${esc(a.name)}</span>`
        + `<span class="tr-sub">SIGNED IN · ✎ EDIT RACER</span></span>`
        + `${this._faceHtml(ch, 'sm tr-kart')}`;
      this.titleRacer.classList.add('signed-in');
      return;
    }
    this.titleRacer.classList.remove('signed-in');
    this.titleRacer.innerHTML = `${this._faceHtml(ch, 'sm')}<span class="tr-text"><span class="tr-name">${esc(ch.name)}</span><span class="tr-sub tr-edit">✎ EDIT RACER</span></span>`;
  }

  /** Show/hide the "continue an interrupted cup" button on the title screen. */
  setResumeAvailable(info) {
    if (!this.resumeBtn) return;
    this.resumeBtn.classList.toggle('hidden', !info);
    if (info) this.resumeBtn.textContent = `RESUME CUP · HEAT ${info.heat}/${info.total}`;
  }

  // Ready card: what you're about to race, who's coaching you, how close the next stop is.
  _buildReady() {
    const r = this.readyEl = el('div', 'screen ready-screen', this.uiRoot);
    r.innerHTML = `
      <div class="game-rail left"></div>
      <div class="game-rail right"></div>
      <div class="ready-panel" role="dialog" aria-modal="true" aria-labelledby="ready-topic">
        <div class="rd-head"><span class="rd-eyebrow">READY?</span><button type="button" class="rd-esc ready-back" aria-label="Back to map"><span class="esc-hint">ESC · </span>BACK</button></div>
        <h2 class="ready-topic" id="ready-topic"></h2>
        <div class="ready-subject"></div>
        <section class="rd-section ready-mentor">
          <div class="rm-face"></div>
          <div class="rm-text"><div class="rm-name"></div><p class="rm-line"></p></div>
        </section>
        <section class="rd-section ready-progress">
          <div class="rp-head"><span class="rp-title">NEXT STOP</span><span class="rp-count"></span></div>
          <div class="rp-bar" role="progressbar" aria-valuemin="0"></div>
          <p class="rp-label"></p>
        </section>
        <div class="ready-cup"></div>
        <button type="button" class="btn primary ready-start">START!</button>
      </div>`;
    r.querySelector('.ready-back').addEventListener('click', () => this._readyBack());
    r.querySelector('.ready-start').addEventListener('click', () => this._start());
  }

  // One-time racer setup (re-openable from the title): name, face, kart colour.
  _buildAvatar() {
    const a = this.avatarEl = el('div', 'screen avatar-screen', this.uiRoot);
    a.innerHTML = `
      <div class="game-rail left"></div>
      <div class="game-rail right"></div>
      <div class="avatar-panel">
        <div class="ready-top"><div class="ready-kicker">YOUR RACER</div><button type="button" class="sel-back avatar-back"><span class="esc-hint">ESC · </span>BACK</button></div>
        <div class="av-preview"></div>
        <label class="av-label" for="av-name">NAME</label>
        <input id="av-name" class="av-name" type="text" maxlength="${NAME_MAX}" autocomplete="off" spellcheck="false" />
        <div class="av-label">FACE</div>
        <div class="av-faces"></div>
        <div class="av-label">KART COLOUR</div>
        <div class="av-colors"></div>
        <div class="av-note">Every kart has the same balanced stats — you win on the quiz, not the car.</div>
        <div class="av-row2">
          <label class="av-field"><span class="av-label">YOUR STATE</span><select class="av-state"><option value="">Choose your state</option>${Object.entries(STATES).sort((x, y) => x[1].localeCompare(y[1])).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
          <label class="av-field av-fam"><span class="av-label">FAMILY MODE</span><span class="av-toggle"><input type="checkbox" class="av-family"><i></i><b>Gentler rivals, bigger text</b></span></label>
        </div>
        <button type="button" class="btn primary av-save">LET'S RACE!</button>
      </div>`;
    this.avName = a.querySelector('.av-name');
    this.avName.addEventListener('input', () => { this.draft.name = this.avName.value; this._refreshAvatarPreview(); });
    this.avFaces = a.querySelector('.av-faces');
    this.avColors = a.querySelector('.av-colors');
    this.avPreview = a.querySelector('.av-preview');
    this.avBack = a.querySelector('.avatar-back');
    this.avBack.addEventListener('click', () => this._avatarBack());
    a.querySelector('.av-save').addEventListener('click', () => this._avatarSave());
    this.avState = a.querySelector('.av-state');
    this.avFamily = a.querySelector('.av-family');
    this.avState.addEventListener('change', () => setMyState(this.avState.value));
    this.avFamily.addEventListener('change', () => setFamily(this.avFamily.checked));
    KART_COLORS.forEach((c, i) => {
      const b = el('button', 'av-color', this.avColors);
      b.type = 'button'; b.style.background = hex(c); b.title = 'Kart colour'; b.setAttribute('aria-label', `Kart colour ${i + 1}`);
      b.addEventListener('click', () => { this.draft.color = i; bus.emit('ui:move'); this._refreshAvatar(); });
    });
    this._refreshAvatar();
  }
  _refreshAvatar() {
    if (!this.avFaces) return;
    this.avFaces.innerHTML = '';
    AVATARS.forEach((_, i) => {
      const ch = playerCharacter({ ...this.draft, avatar: i });
      const b = el('button', 'av-face' + (i === this.draft.avatar ? ' selected' : ''), this.avFaces, this._faceHtml(ch));
      b.type = 'button';
      b.setAttribute('aria-label', `Face ${i + 1}`);
      b.setAttribute('aria-pressed', String(i === this.draft.avatar));
      b.addEventListener('click', () => { this.draft.avatar = i; bus.emit('ui:move'); this._refreshAvatar(); });
    });
    [...this.avColors.children].forEach((b, i) => b.classList.toggle('selected', i === this.draft.color));
    this._refreshAvatarPreview();
  }
  _refreshAvatarPreview() {
    if (!this.avPreview) return;
    const ch = playerCharacter(this.draft);
    this.avPreview.innerHTML = `${this._faceHtml(ch, 'lg')}<div class="av-pname">${esc(ch.name)}</div>`;
  }

  _buildPause() {
    const p = this.pauseEl = el('div', 'screen pause-screen', this.uiRoot);
    p.innerHTML = `
      <div class="pause-panel">
        <div class="pause-title">PAUSED</div>
        <button class="btn" data-a="resume">RESUME</button>
        <button class="btn" data-a="restart">RESTART</button>
        <button class="btn" data-a="quit">QUIT TO MENU</button>
        <div class="controls-help compact">${CONTROLS_HTML}</div>
      </div>`;
    this.pauseBtns = [...p.querySelectorAll('.btn')];
    this.pauseBtns.forEach((b, i) => {
      b.addEventListener('mouseenter', () => { if (this.pauseIndex !== i) { this.pauseIndex = i; this._refreshPause(); bus.emit('ui:move'); } });
      b.addEventListener('click', () => this._pauseAct(b.dataset.a));
    });
  }

  _buildLoading() {
    this.loadingEl = el('div', 'screen loading-screen', this.uiRoot, '<div class="spinner"></div><div class="loading-text">LOADING</div>');
  }

  // ------------------------------------------------------------------ screens
  _screens() { return [this.titleEl, this.readyEl, this.avatarEl, this.pauseEl, this.loadingEl]; }
  _showOnly(elm) {
    for (const s of this._screens()) s.classList.toggle('active', s === elm);
  }
  showTitle() { this.screen = 'title'; this._refreshTitleRacer(); this._showOnly(this.titleEl); }
  /**
   * @param {object} info { topic, subject, mentor, mentorLine, correct, threshold, completed,
   *                        nextTopic, cupName, heats: [{difficulty}] }
   */
  showReady(info) {
    this.screen = 'ready';
    const r = this.readyEl;
    const m = info.mentor;
    r.style.setProperty('--sc', m ? hex(m.color) : '#2f8bff');
    r.querySelector('.ready-topic').textContent = info.topic || 'Free Race';
    r.querySelector('.ready-subject').textContent = (info.subject || '').toUpperCase();
    const mentorEl = r.querySelector('.ready-mentor');
    mentorEl.style.display = m ? '' : 'none';
    if (m) {
      r.querySelector('.rm-face').innerHTML = this._faceHtml(m, 'md');
      r.querySelector('.rm-name').innerHTML = `${esc(m.name)}<span class="rm-role">Your ${esc(info.subject || '')} mentor</span>`;
      r.querySelector('.rm-line').textContent = `“${info.mentorLine || ''}”`;
    }
    const sec = info.section;
    const n = Math.max(1, (sec ? sec.threshold : info.threshold) | 0), c = Math.max(0, Math.min(n, (sec ? sec.correct : info.correct) | 0));
    const shown = info.completed ? n : c;
    const unlock = info.nextTopic ? `<b>${esc(info.nextTopic)}</b>` : 'the next stop';
    r.querySelector('.rp-title').textContent = info.completed ? 'STOP CLEARED' : sec && sec.n > 1 ? `SECTION ${sec.i + 1} OF ${sec.n}` : 'NEXT STOP';
    r.querySelector('.rp-count').textContent = `${shown} / ${n} correct`;
    r.querySelector('.rp-label').innerHTML = info.completed
      ? 'Cleared ✓ — a review run keeps it fresh.'
      : sec && sec.n > 1
        ? `<b>${esc(sec.title)}</b><br>Read this section, then race it. Clear all ${sec.n} sections to unlock ${unlock}.`
        : `Read the lesson, then get ${n} right to unlock ${unlock}.`;
    const bar = r.querySelector('.rp-bar');
    bar.setAttribute('aria-valuemax', String(n));
    bar.setAttribute('aria-valuenow', String(shown));
    bar.innerHTML = Array.from({ length: n }, (_, i) => `<i class="${i < shown ? 'on' : ''}"></i>`).join('');
    const heats = info.heats || [];
    const cc = { easy: '50cc', normal: '100cc', hard: '150cc' };
    r.querySelector('.ready-cup').innerHTML = `<span class="rc-name">🏆 ${esc(info.cupName || '')}</span>`
      + `<span class="rc-heats">${heats.length} heats · ${heats.map((h) => cc[h.difficulty] || h.difficulty).join(' → ')}</span>`;
    this._showOnly(r);
    r.querySelector('.ready-start').classList.add('focus');
  }
  showAvatar({ first = false } = {}) {
    this.screen = 'avatar';
    this.avatarFirst = first;
    this.draft = loadProfile();
    this.avName.value = this.draft.name;
    this.avState.value = myState();
    this.avFamily.checked = isFamily();
    this.avBack.style.display = first ? 'none' : '';
    this._refreshAvatar();
    this._showOnly(this.avatarEl);
    setTimeout(() => { try { this.avName.focus(); this.avName.select(); } catch (e) { /* ignore */ } }, 50);
  }
  showPause() { this.screen = 'pause'; this.pauseIndex = 0; this._refreshPause(); this._showOnly(this.pauseEl); }
  showLoading(text = 'LOADING') {
    this.screen = 'loading';
    this.loadingEl.querySelector('.loading-text').textContent = text;
    this._showOnly(this.loadingEl);
  }
  hideAll() { this.screen = null; this._showOnly(null); }

  _readyBack() {
    if (this.screen !== 'ready') return;
    bus.emit('ui:back');
    this.h.onReadyBack?.();
  }
  _start() {
    if (this.screen !== 'ready') return;
    bus.emit('ui:confirm');
    this.h.onStart?.({});
  }
  _avatarSave() {
    if (this.screen !== 'avatar') return;
    this.draft.name = this.avName.value;
    this.draft = saveProfile(this.draft);
    this._portraits = new Map();
    this._refreshTitleRacer();
    bus.emit('ui:confirm');
    try { this.avName.blur(); } catch (e) { /* ignore */ }
    this.h.onAvatarDone?.(this.draft);
  }
  _avatarBack() {
    if (this.screen !== 'avatar' || this.avatarFirst) return;
    bus.emit('ui:back');
    try { this.avName.blur(); } catch (e) { /* ignore */ }
    this.h.onAvatarDone?.(null);
  }
  _refreshPause() { this.pauseBtns.forEach((b, i) => b.classList.toggle('focus', i === this.pauseIndex)); }
  _pauseAct(a) {
    if (this.screen !== 'pause') return;
    bus.emit('ui:confirm');
    if (a === 'resume') this.h.onResume && this.h.onResume();
    else if (a === 'restart') this.h.onRestart && this.h.onRestart();
    else if (a === 'quit') this.h.onQuit && this.h.onQuit();
  }

  // ------------------------------------------------------------------ input
  _key(e) {
    const c = e.code;
    const isEnter = c === 'Enter' || c === 'NumpadEnter' || c === 'Space';
    if (this.screen === 'title') {
      if ((isEnter || c === 'KeyE') && !e.repeat) { e.preventDefault(); this.h.onMap?.(); }
      return;
    }
    if (this.screen === 'ready') {
      if (c === 'Escape' || c === 'Backspace') { e.preventDefault(); this._readyBack(); }
      else if (isEnter && !e.repeat) { e.preventDefault(); this._start(); }
      return;
    }
    if (this.screen === 'avatar') {
      // typing in the name field: only Enter (save) and Escape (back) are ours
      if (c === 'Escape') { e.preventDefault(); this._avatarBack(); }
      else if ((c === 'Enter' || c === 'NumpadEnter') && !e.repeat) { e.preventDefault(); this._avatarSave(); }
      else if (c === 'Backspace' && !isTyping(e)) { e.preventDefault(); this._avatarBack(); }
      return;
    }
    if (this.screen === 'pause') {
      if (c === 'ArrowUp' || c === 'KeyW') { this.pauseIndex = (this.pauseIndex + 2) % 3; this._refreshPause(); bus.emit('ui:move'); e.preventDefault(); }
      else if (c === 'ArrowDown' || c === 'KeyS') { this.pauseIndex = (this.pauseIndex + 1) % 3; this._refreshPause(); bus.emit('ui:move'); e.preventDefault(); }
      else if (isEnter && !e.repeat) { e.preventDefault(); this._pauseAct(this.pauseBtns[this.pauseIndex].dataset.a); }
    }
  }

  /** Poll gamepads; translate to synthetic key presses for menus (and Start -> Escape for pause). */
  update(dt, gameState) {
    this.gameState = gameState;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gp = null;
    for (const p of pads || []) if (p && p.connected) { gp = p; break; }
    if (!gp) return;
    const b = (i) => !!(gp.buttons[i] && gp.buttons[i].pressed);
    const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
    const now = {
      up: b(12) || ay < -0.6, down: b(13) || ay > 0.6, left: b(14) || ax < -0.6, right: b(15) || ax > 0.6,
      a: b(0), b: b(1), start: b(9),
    };
    const prev = this._pad.prev;
    const inMenu = this.screen === 'title' || this.screen === 'ready' || this.screen === 'avatar' || this.screen === 'pause' || gameState === 'results';
    const fire = (code) => window.dispatchEvent(new KeyboardEvent('keydown', { code, key: code, bubbles: true }));
    if (inMenu) {
      const dirs = [['up', 'ArrowUp'], ['down', 'ArrowDown'], ['left', 'ArrowLeft'], ['right', 'ArrowRight']];
      let held = null;
      for (const [k, code] of dirs) {
        if (now[k] && !prev[k]) { fire(code); this._pad.repeatT = 0.4; }
        if (now[k]) held = code;
      }
      if (held) { this._pad.repeatT -= dt; if (this._pad.repeatT <= 0) { fire(held); this._pad.repeatT = 0.14; } }
      if (now.a && !prev.a) fire('Enter');
      if (now.b && !prev.b) fire(this.screen === 'pause' ? 'Escape' : 'Backspace');
    }
    if (now.start && !prev.start) fire(this.screen === 'title' ? 'Enter' : 'Escape');
    if (gameState === 'intro' && now.a && !prev.a) fire('Enter');
    this._pad.prev = now;
  }

  dispose() {
    window.removeEventListener('keydown', this._onKey);
    for (const s of this._screens()) s.remove();
  }
}
