// switchPages.js - Ctrl + . toggles between bookmark1.html and bookmark2.html
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === '.') {
    e.preventDefault();
    const current = window.location.pathname.split('/').pop().toLowerCase();
    const target = (current === 'bookmark1.html') ? 'bookmark2.html' : 'bookmark1.html';
    document.body.style.transition = 'opacity 0.35s ease';
    document.body.style.opacity = '0';
    setTimeout(() => {
      // if pages are in /pages/ keep relative path
      if (current.startsWith('bookmark')) {
        window.location.href = target;
      } else {
        window.location.href = 'pages/' + target;
      }
    }, 360);
  }
});
