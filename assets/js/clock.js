function updateClock() {
  const now = new Date();

  // Format tanggal (hari, bulan, tahun) dalam bahasa Inggris
  const dateOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    timeZone: 'Asia/Jakarta' 
  };
  const dateString = now.toLocaleDateString('en-US', dateOptions);

  // Format waktu (jam:menit:detik) dalam bahasa Inggris
  const timeOptions = { 
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  const timeString = now.toLocaleTimeString('en-US', timeOptions);

  document.getElementById('jakarta-clock').textContent = timeString + "  " + dateString;
}

// update tiap detik
setInterval(updateClock, 1000);
updateClock();
