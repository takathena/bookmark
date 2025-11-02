// script.js - create search box and highlight logic (idempotent)
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('glassSearch')) return; // avoid duplicates

  const container = document.createElement('div');
  container.id = 'glassSearch';

  const icon = document.createElement('span');
  icon.className = 'icon';
  icon.textContent = ";";

  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Type to search... (Enter to open link)';

  container.append(icon, input);
  document.body.appendChild(container);

  // Highlight logic
  let highlights = [];
  function clearHighlights(){
    highlights.forEach(sp => {
      const p = sp.parentNode;
      if (p) {
        p.replaceChild(document.createTextNode(sp.textContent), sp);
        p.normalize();
      }
    });
    highlights = [];
  }

  function highlightMatches(term){
    if (!term) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while(walker.nextNode()){
      const node = walker.currentNode;
      if (node.parentNode.closest('#glassSearch')) continue;
      const text = node.nodeValue;
      const idx = text.toLowerCase().indexOf(term.toLowerCase());
      if (idx !== -1){
        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + term.length);
        const after = text.slice(idx + term.length);
        const span = document.createElement('span');
        span.className = 'search-highlight';
        span.textContent = match;
        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        frag.appendChild(span);
        if (after) frag.appendChild(document.createTextNode(after));
        node.parentNode.replaceChild(frag, node);
        highlights.push(span);
      }
    }
  }

  input.addEventListener('input', () => {
    clearHighlights();
    const t = input.value.trim();
    if (t) highlightMatches(t);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlights.length > 0){
        const first = highlights[0];
        const a = first.closest('a');
        if (a && a.href) window.open(a.href, '_blank');
      }
    } else if (e.key === 'Escape'){
      e.preventDefault();
      container.classList.remove('visible');
      input.blur();
    }
  });

  // open via "/" (only when not typing in input or textarea)
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
    if (!isTyping && e.key === ";" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      container.classList.add('visible');
      input.focus();
    }
  });
});
