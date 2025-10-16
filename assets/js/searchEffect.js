// searchEffect.js - handles reflection, auto-show near bottom, debounce and prevents duplicates
document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('glassSearch');
  if (!searchBar) return;

  const reflection = document.createElement('div');
  reflection.style.cssText = 'position:absolute;inset:0;pointer-events:none;transition:transform .2s linear;';
  searchBar.appendChild(reflection);

  // smooth lerp for reflection
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  const maxOffset = 12;

  searchBar.addEventListener('mousemove', (e) => {
    const r = searchBar.getBoundingClientRect();
    targetX = ((e.clientX - r.left) / r.width - 0.5) * maxOffset;
    targetY = ((e.clientY - r.top) / r.height - 0.5) * maxOffset;
  });
  searchBar.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

  function animate(){
    curX += (targetX - curX) * 0.12;
    curY += (targetY - curY) * 0.12;
    reflection.style.transform = `translate(${curX}px, ${curY}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  // auto show near bottom with cooldown and init delay
  let isVisible = false;
  let animating = false;
  let lastShow = 0;
  const cooldown = 1200;
  let initialized = false;
  setTimeout(()=>initialized=true, 800);

  function show(){
    if (animating || isVisible) return;
    const now = Date.now();
    if (now - lastShow < cooldown) return;
    animating = true;
    searchBar.classList.add('visible');
    isVisible = true;
    lastShow = now;
    setTimeout(()=>{ animating = false; }, 360);
  }
  function hide(){
    if (animating || !isVisible) return;
    if (document.activeElement && document.activeElement.closest && document.activeElement.closest('#glassSearch')) return;
    animating = true;
    searchBar.classList.remove('visible');
    isVisible = false;
    setTimeout(()=>{ animating = false; }, 360);
  }

  let deb;
  window.addEventListener('mousemove', (e) => {
    if (!initialized) return;
    clearTimeout(deb);
    deb = setTimeout(() => {
      if (e.clientY > window.innerHeight - 90) show();
      else hide();
    }, 80);
  });

  // auto-hide after idle
  let idleTimer;
  searchBar.addEventListener('mouseenter', () => { clearTimeout(idleTimer); });
  searchBar.addEventListener('mouseleave', () => {
    idleTimer = setTimeout(() => { hide(); }, 4500);
  });
});
