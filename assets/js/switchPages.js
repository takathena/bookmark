document.addEventListener("keydown", function (e) {
  const currentPage = window.location.pathname;

  // Ambil state terakhir (default = 1)
  let lastBookmark = localStorage.getItem("lastBookmark") || "1";

  // === Shortcut tombol "'" ===
  if (e.key === "'") {
    if (currentPage.includes("index.html") || currentPage.endsWith("/")) {
      // Dari index.html → buka bookmark sesuai giliran
      if (lastBookmark === "1") {
        window.location.href = "pages/bookmark2.html";
        localStorage.setItem("lastBookmark", "2");
      } else {
        window.location.href = "pages/bookmark1.html";
        localStorage.setItem("lastBookmark", "1");
      }
    } else if (currentPage.includes("bookmark1.html")) {
      // Dari bookmark1 → pindah ke bookmark2
      window.location.href = "bookmark2.html";
      localStorage.setItem("lastBookmark", "2");
    } else if (currentPage.includes("bookmark2.html")) {
      // Dari bookmark2 → pindah ke bookmark1
      window.location.href = "bookmark1.html";
      localStorage.setItem("lastBookmark", "1");
    }
  }

  // === Shortcut tombol "," ===
  if (e.key === ",") {
    if (currentPage.includes("bookmark1.html") || currentPage.includes("bookmark2.html")) {
      window.location.href = "../index.html";
    }
  }
});
