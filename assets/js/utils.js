// utils.js - small helpers
export function debounce(fn, wait=150){
  let t;
  return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), wait); }
}
export function fadeOutBodyThen(url, timeout=400){
  document.body.style.transition='opacity 0.35s ease';
  document.body.style.opacity='0';
  setTimeout(()=>{ window.location.href = url; }, timeout);
}
