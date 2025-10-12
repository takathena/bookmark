document.addEventListener("DOMContentLoaded", () => {
  // === Liquid glass container ===
  const container = document.createElement("div");
  container.id = "glassSearch";
  container.style.cssText = `
    position: fixed;
    bottom: 2em;
    left: 50%;
    transform: translateX(-50%);
    width: min(80%, 420px);
    height: 52px;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 18px;
    border-radius: 18px;
    background: rgba(20, 20, 20, 0.35);
    backdrop-filter: blur(25px) saturate(180%);
    -webkit-backdrop-filter: blur(25px) saturate(180%);
    border: 1.2px solid rgba(255,255,255,0.25);
    box-shadow:
      inset 0 0 1px rgba(255,255,255,0.3),
      0 0 18px rgba(0,0,0,0.35);
    transition: all 0.4s ease;
    overflow: hidden;
  `;

  const reflection = document.createElement("div");
  reflection.style.cssText = `
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(
      145deg,
      rgba(255,255,255,0.08),
      rgba(255,255,255,0.02),
      rgba(0,0,0,0.05)
    );
    opacity: 0.25;
    transition: opacity 0.5s ease;
  `;
  container.appendChild(reflection);
  container.addEventListener("mouseenter", () => (reflection.style.opacity = "0.5"));
  container.addEventListener("mouseleave", () => (reflection.style.opacity = "0.25"));

  const icon = document.createElement("span");
  icon.textContent = "ctrl k";
  icon.style.cssText = `font-size:1.1em;opacity:0.8;color:white;border:1px solid rgba(255,255,255,0.2);border-radius:4px;padding:2px 4px;margin-right:10px;z-index:2;`;

  const input = document.createElement("input");
  input.type = "search";
  input.placeholder = "To focus, enter to open link";
  input.style.cssText = `
    transform: translateY(1px);
    flex:1;
    background:transparent;
    border:none;
    outline:none;
    font-size:1em;
    color:#fff;
    z-index:2;
  `;

  container.appendChild(icon);
  container.appendChild(input);
  document.body.appendChild(container);

  // === Ctrl+K focus ===
  document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      input.focus();
    }
  });

  // === Highlight like Ctrl+F ===
  let lastHighlights = [];

  function clearHighlights() {
    lastHighlights.forEach(span => {
      const parent = span.parentNode;
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize();
    });
    lastHighlights = [];
  }

  function highlightMatches(term) {
    if (!term) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = node.nodeValue;
      const idx = value.toLowerCase().indexOf(term.toLowerCase());
      if (idx !== -1 && node.parentNode.id !== "glassSearch") {
        const before = value.substring(0, idx);
        const match = value.substring(idx, idx + term.length);
        const after = value.substring(idx + term.length);

        const span = document.createElement("span");
        span.textContent = match;
        span.className = "search-highlight";
        span.style.cssText = `
          background: rgba(0,122,255,0.4);
          border-radius: 3px;
          color: #fff;
          padding: 0 2px;
        `;

        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        frag.appendChild(span);
        if (after) frag.appendChild(document.createTextNode(after));

        node.parentNode.replaceChild(frag, node);
        lastHighlights.push(span);
      }
    }
  }

  // === Search typing ===
  input.addEventListener("input", () => {
    clearHighlights();
    const term = input.value.trim();
    if (term) highlightMatches(term);
  });

  // === Enter opens link ===
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (lastHighlights.length > 0) {
        const first = lastHighlights[0];
        let linkParent = first.closest("a");
        if (linkParent && linkParent.href) {
          window.open(linkParent.href, "_blank");
        }
      }
    }
  });
});
