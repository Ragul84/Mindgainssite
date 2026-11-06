// LEARN & RACE: the syllabus, one subject at a time, as a list of chapters you read and then race.
//
// Drawn in the same panel language as Bharat Yatra and the race screens (navy panel, gold
// display type, subject colours) rather than a painted world map: the job here is to pick the
// next lesson in one tap and see how far you've come, and a winding road with scenery made that
// slower on a phone, not faster. The month archive of current affairs sits at the bottom.
//
// Stops are locked/unlocked/completed per progress.js. Picking one makes it the focus of the
// next race (main.js's focusedZone), and correct answers there unlock the next.
import { CHARACTERS } from './config.js';
import { getJourney, SUBJECT_ORDER, SECTION_THRESHOLD } from './progress.js';
import { lessonIndex } from './lesson-reader.js';
import { iconSvg } from './icons.js';

const SUBJECT_COLOR = new Map(CHARACTERS.map((c) => [c.subject, c.color]));
const hex = (c) => '#' + (c >>> 0).toString(16).padStart(6, '0').slice(-6);
const colorOf = (subject) => hex(SUBJECT_COLOR.get(subject) ?? 0x2f8bff);

const SUBJECT_ART = {
  Polity: 'assets/icons/polity-icon.png',
  History: 'assets/icons/history-icon.png',
  Geography: 'assets/icons/geography-icon.png',
  Science: 'assets/icons/science-icon.png',
  Quant: 'assets/icons/quant-icon.png',
};
const art = (subject) => (SUBJECT_ART[subject] ? `<img src="${SUBJECT_ART[subject]}" alt="" />` : iconSvg(subject));
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function createJourneyMap({ uiRoot, onAffairs, onMonths, onSelectZone, onClose, mentorPortrait }) {
  const mentor = (subject) => {
    let m = null;
    try { m = mentorPortrait?.(subject) || null; } catch (e) { m = null; }
    return m && m.url ? { url: m.url, name: m.name } : null;
  };

  const root = document.createElement('div');
  root.className = 'yatra learn hidden';
  uiRoot.appendChild(root);

  let activeSubject = null;
  let months = null;          // loaded once per open
  let sections = {};          // zoneId -> section titles
  let hintTimer = 0;

  function close() {
    root.classList.add('hidden');
    onClose?.();
  }

  function render() {
    // Current affairs has its own button on the title and its archive below, not a syllabus tab.
    const full = getJourney().filter((z) => z.subject !== 'Current Affairs');
    const stats = { completed: full.filter((z) => z.completed).length, total: full.length };
    if (!activeSubject) {
      const here = full.find((z) => z.due) || full.find((z) => z.unlocked && !z.completed) || full[0];
      activeSubject = here ? here.subject : SUBJECT_ORDER[0];
    }
    const subjects = [...new Set(full.map((z) => z.subject))];
    const zones = full.filter((z) => z.subject === activeSubject);
    const dueIdx = zones.findIndex((z) => z.due);
    const nextIdx = zones.findIndex((z) => z.unlocked && !z.completed);
    const hereIdx = dueIdx >= 0 ? dueIdx : nextIdx;
    const done = zones.filter((z) => z.completed).length;
    const m = mentor(activeSubject);
    const pct = Math.round((stats.completed / Math.max(1, stats.total)) * 100);

    const tabs = subjects.map((s) => {
      const zs = full.filter((z) => z.subject === s);
      const d = zs.filter((z) => z.completed).length;
      return `<button type="button" class="lj-tab${s === activeSubject ? ' on' : ''}" data-sub="${esc(s)}" style="--c:${colorOf(s)}">
        <span class="lj-tab-ic">${art(s)}</span><span class="lj-tab-name">${esc(s)}</span><span class="lj-tab-n">${d}/${zs.length}</span></button>`;
    }).join('');

    const cards = zones.map((z, i) => {
      const titles = sections[z.id] || [];
      const sec = titles.map((_, k) => z.completed || ((z.sec && z.sec[k]) || 0) >= SECTION_THRESHOLD);
      const nextSec = sec.indexOf(false);
      const pips = titles.length > 1 ? `<span class="lj-pips">${sec.map((d, k) => `<i class="${d ? 'on' : k === nextSec && z.unlocked ? 'cur' : ''}"></i>`).join('')}</span>` : '';
      const state = z.due ? 'due' : z.completed ? 'done' : z.unlocked ? (i === hereIdx ? 'next' : 'open') : 'locked';
      const status = {
        due: '<span class="lj-st due">↻ Review due</span>',
        done: `<span class="lj-st done">✓ Cleared${z.mastered ? ' · ★ Mastered' : ''}</span>`,
        next: `<span class="lj-st next">${titles.length > 1 ? `Section ${nextSec + 1} of ${titles.length} · read, then race` : 'Read · then race'}</span>`,
        open: '<span class="lj-st">Read · then race</span>',
        locked: '<span class="lj-st locked">Clear the one before</span>',
      }[state];
      const right = state === 'locked' ? `<span class="lj-lock">${iconSvg('lock')}</span>`
        : `<span class="lj-go">${state === 'next' || state === 'due' ? 'START' : '▶'}</span>`;
      return `<button type="button" class="lj-card ${state}" data-i="${i}">
        <span class="lj-num">${state === 'done' ? '✓' : i + 1}</span>
        <span class="lj-txt"><b>${esc(z.topic)}</b>${status}${pips}</span>${right}</button>`;
    }).join('');

    const monthsHtml = months == null ? '<span class="lj-note">Loading…</span>'
      : months.length ? months.map((mo) => `<button type="button" class="lj-month" data-mk="${esc(mo.key)}">${esc(mo.label)}</button>`).join('')
      : '<span class="lj-note">No archive yet</span>';

    root.innerHTML = `<div class="yt-panel lj-panel" style="--c:${colorOf(activeSubject)}">
      <div class="yt-head"><div><div class="yt-title">LEARN &amp; RACE</div>
        <div class="yt-sub">Read a lesson, then race it · ${stats.completed} of ${stats.total} cleared</div></div>
        <button type="button" class="btn small" data-x>BACK</button></div>
      <div class="yt-progress"><i style="width:${pct}%"></i></div>
      <div class="lj-tabs">${tabs}</div>
      <div class="lj-sub">
        ${m ? `<img class="lj-mentor" src="${m.url}" alt="" />` : `<span class="lj-mentor lj-mentor-ic">${art(activeSubject)}</span>`}
        <div><div class="lj-sub-name">${esc(activeSubject)}</div>
        <div class="lj-sub-meta">${m ? `Mentor ${esc(m.name)} · ` : ''}${done} of ${zones.length} lessons cleared</div></div>
      </div>
      <div class="lj-list">${cards}</div>
      <div class="lj-archive"><div class="yt-rlabel">News archive · race a whole month</div><div class="lj-months">${monthsHtml}</div></div>
      <div class="lj-hint" role="status" aria-live="polite"></div>
    </div>`;

    root.querySelector('[data-x]').addEventListener('click', (e) => { e.stopPropagation(); close(); });
    root.querySelectorAll('[data-sub]').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      activeSubject = b.dataset.sub;
      render();
      root.querySelector('.lj-list')?.scrollIntoView({ block: 'nearest' });
    }));
    root.querySelectorAll('[data-i]').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const i = +b.dataset.i, z = zones[i];
      if (!z.unlocked) {
        const hint = root.querySelector('.lj-hint');
        hint.textContent = i > 0 ? `Clear "${zones[i - 1].topic}" to unlock` : 'Locked';
        hint.classList.add('show');
        clearTimeout(hintTimer);
        hintTimer = setTimeout(() => hint.classList.remove('show'), 2200);
        return;
      }
      close();
      onSelectZone?.(z);
    }));
    root.querySelectorAll('[data-mk]').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      close();
      onAffairs?.(b.dataset.mk);
    }));
    // the active tab stays in view on a phone, where the strip scrolls sideways
    root.querySelector('.lj-tab.on')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }

  async function open() {
    months = null;
    root.classList.remove('hidden');
    render();
    try { sections = (await lessonIndex()) || {}; } catch (e) { sections = {}; }
    if (!root.classList.contains('hidden')) render();
    try { months = (await onMonths?.()) || []; } catch (e) { months = []; }
    if (!root.classList.contains('hidden')) render();
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !root.classList.contains('hidden')) { e.preventDefault(); close(); }
  });

  return { open, close, isOpen: () => !root.classList.contains('hidden') };
}
