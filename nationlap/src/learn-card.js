// Opt-in "tap to learn" card — the player chooses to open this (never fires on its own),
// so it can afford to show the actual, complete, readable fact: title + full explanation.
// This is the real reading mechanism; the in-world billboard is just the waypoint that tells
// you a fact is here to open if you want it.
function el(tag, cls, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}

export function createLearnCard({ uiRoot, onClose }) {
  const root = el('div', 'learn-overlay hidden', uiRoot);
  root.innerHTML = `
    <div class="learn-card">
      <div class="learn-topic"></div>
      <div class="learn-title"></div>
      <div class="learn-blurb"></div>
      <button type="button" class="btn primary learn-got">GOT IT</button>
    </div>`;
  const topicEl = root.querySelector('.learn-topic');
  const titleEl = root.querySelector('.learn-title');
  const blurbEl = root.querySelector('.learn-blurb');
  const gotBtn = root.querySelector('.learn-got');
  let open = false;

  function close() {
    if (!open) return;
    open = false;
    root.classList.add('hidden');
    onClose?.();
  }

  function show(fact) {
    if (!fact || open) return;
    open = true;
    topicEl.textContent = (fact.subject || '').toUpperCase();
    titleEl.textContent = fact.title || '';
    blurbEl.textContent = fact.blurb || '';
    root.classList.remove('hidden');
  }

  gotBtn.addEventListener('click', close);
  root.addEventListener('click', (e) => { if (e.target === root) close(); });

  return { show, close, isOpen: () => open };
}
