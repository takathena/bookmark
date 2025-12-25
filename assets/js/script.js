// DATA
const searchEngines = [
    { id: 'google', name: 'GOOGLE', url: 'https://www.google.com/search?q=' },
    { id: 'youtube', name: 'YOUTUBE', url: 'https://www.youtube.com/results?search_query=' },
    { id: 'wikipedia', name: 'WIKIPEDIA', url: 'https://id.wikipedia.org/wiki/Special:Search?search=' },
    { id: 'github', name: 'GITHUB', url: 'https://github.com/search?q=' },
    { id: 'duckduckgo', name: 'DUCKDUCKGO', url: 'https://duckduckgo.com/?q=' }
];

const aiAssistants = [
    { id: 'chatgpt', name: 'CHATGPT', url: 'https://chat.openai.com/' },
    { id: 'claude', name: 'CLAUDE AI', url: 'https://claude.ai/' },
    { id: 'bard', name: 'GOOGLE BARD', url: 'https://bard.google.com/' },
    { id: 'bingai', name: 'BING AI', url: 'https://www.bing.com/chat' },
    { id: 'perplexity', name: 'PERPLEXITY AI', url: 'https://www.perplexity.ai/' }
];

const quotes = [
    { text: "Barangkali PEKAT nya dosa telah menghalngi mata hatimu dari terangnya hidayah", author: "TTN221*1" },
    { text: "Jalan aja dulu, nanti juga ketemu.", author: "Anonim" },
    { text: "Gak usah banyak bacot, kerja aja.", author: "Anonim" },
    { text: "Santai bro, yang penting usaha.", author: "Anonim" },
    { text: "Yang lalu biarlah berlalu.", author: "Anonim" },
    { text: "Jangan mikirin yang belum terjadi.", author: "Anonim" },
    { text: "Lakukan sekarang, nanti menyesal.", author: "Anonim" },
    { text: "Simple is best.", author: "Anonim" }
];

// THEME DATA
const themes = [
    { id: 'light', name: 'LIGHT' },
    { id: 'dark', name: 'DARK' },
    { id: 'pink', name: 'PINK' },
    { id: 'green', name: 'GREEN' },
    { id: 'blue', name: 'BLUE' },
    { id: 'yellow', name: 'YELLOW' },
    { id: 'brown', name: 'BROWN' }
];

// STATE
let currentEngine = 'google';
let currentTimezone = 'Asia/Jakarta';
let currentTheme = 'light';

// INIT
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    initSearchEngines();
    initAISelector();
    initTimezones();
    initTheme();
    updateTime();
    loadNotes();
    showRandomQuote();
    setupEventListeners();
    setupKeyboardShortcuts();
    
    setInterval(updateTime, 1000);
});

// FUNGSI TIME
function updateTime() {
    const now = new Date();
    
    // Format waktu
    const timeStr = now.toLocaleTimeString('id-ID', { 
        timeZone: currentTimezone,
        hour12: false 
    });
    document.getElementById('timeDisplay').textContent = timeStr;
    
    // Format tanggal
    const dateStr = now.toLocaleDateString('id-ID', { 
        timeZone: currentTimezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('dateDisplay').textContent = dateStr;
    
    // Timezone info
    document.getElementById('timezoneDisplay').textContent = currentTimezone;
}

function initTimezones() {
    const select = document.getElementById('timezoneSelect');
    const timezones = [
        'Asia/Jakarta',
        'Asia/Makassar', 
        'Asia/Jayapura',
        'Asia/Singapore',
        'Asia/Tokyo',
        'America/New_York',
        'America/Los_Angeles',
        'Europe/London',
        'Europe/Paris',
        'Australia/Sydney'
    ];
    
    timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz;
        if (tz === currentTimezone) option.selected = true;
        select.appendChild(option);
    });
}

// FUNGSI THEME
function initTheme() {
    const themeSelect = document.getElementById('themeSelect');
    themeSelect.value = currentTheme;
    updateThemeIndicator();
}

function applyTheme(themeName) {
    // Remove all theme classes
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-pink', 
                                    'theme-green', 'theme-blue', 'theme-yellow', 'theme-brown');
    
    // Add new theme class
    document.body.classList.add(`theme-${themeName}`);
    
    // Update state
    currentTheme = themeName;
    
    // Update indicator
    updateThemeIndicator();
}

function updateThemeIndicator() {
    const theme = themes.find(t => t.id === currentTheme);
    const indicator = document.getElementById('themeIndicator');
    indicator.textContent = theme.name;
    
    // Update theme indicator color
    indicator.style.backgroundColor = getThemeColor(currentTheme);
    indicator.style.color = getThemeTextColor(currentTheme);
}

function getThemeColor(theme) {
    switch(theme) {
        case 'light': return '#000000';
        case 'dark': return '#666666';
        case 'pink': return '#d81b60';
        case 'green': return '#2e7d32';
        case 'blue': return '#1565c0';
        case 'yellow': return '#ff8f00';
        case 'brown': return '#5d4037';
        default: return '#000000';
    }
}

function getThemeTextColor(theme) {
    switch(theme) {
        case 'light': return '#ffffff';
        case 'dark': return '#121212';
        case 'pink': return '#fff0f5';
        case 'green': return '#f1f8e9';
        case 'blue': return '#e3f2fd';
        case 'yellow': return '#5d4037';
        case 'brown': return '#efebe9';
        default: return '#ffffff';
    }
}

// FUNGSI SEARCH
function initSearchEngines() {
    const container = document.getElementById('searchEngines');
    container.innerHTML = '';
    
    searchEngines.forEach(engine => {
        const btn = document.createElement('button');
        btn.className = `engine-btn ${engine.id === currentEngine ? 'active' : ''}`;
        btn.textContent = engine.name;
        btn.onclick = () => {
            document.querySelectorAll('.engine-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentEngine = engine.id;
        };
        container.appendChild(btn);
    });
}

function search() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
    
    const engine = searchEngines.find(e => e.id === currentEngine);
    if (engine) {
        window.open(engine.url + encodeURIComponent(query), '_blank');
    }
    
    document.getElementById('searchInput').value = '';
}

// FUNGSI AI
function initAISelector() {
    const select = document.getElementById('aiSelector');
    aiAssistants.forEach(ai => {
        const option = document.createElement('option');
        option.value = ai.id;
        option.textContent = ai.name;
        select.appendChild(option);
    });
}

function openAI() {
    const select = document.getElementById('aiSelector');
    const selected = select.value;
    if (!selected) return alert('Pilih AI dulu');
    
    const ai = aiAssistants.find(a => a.id === selected);
    if (ai) window.open(ai.url, '_blank');
}

// FUNGSI NOTES
function loadNotes() {
    const saved = localStorage.getItem('brutalNotes');
    if (saved) {
        document.getElementById('notesTextarea').value = saved;
    }
}

function saveNotes() {
    const notes = document.getElementById('notesTextarea').value;
    localStorage.setItem('brutalNotes', notes);
    alert('Notes saved!');
}

function clearNotes() {
    if (confirm('Clear semua notes?')) {
        document.getElementById('notesTextarea').value = '';
        localStorage.removeItem('brutalNotes');
    }
}

// FUNGSI QUOTES
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteText').textContent = `"${quote.text}"`;
    document.getElementById('quoteAuthor').textContent = `- ${quote.author}`;
}

// FUNGSI SETTINGS
function loadSettings() {
    const saved = localStorage.getItem('brutalSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        currentEngine = settings.engine || 'google';
        currentTimezone = settings.timezone || 'Asia/Jakarta';
        currentTheme = settings.theme || 'light';
        
        // Apply theme
        applyTheme(currentTheme);
        
        // Apply to selects
        document.getElementById('defaultSearchSelect').value = currentEngine;
        document.getElementById('themeSelect').value = currentTheme;
    }
}

function saveSettings() {
    const settings = {
        engine: document.getElementById('defaultSearchSelect').value,
        timezone: document.getElementById('timezoneSelect').value,
        theme: document.getElementById('themeSelect').value
    };
    
    localStorage.setItem('brutalSettings', JSON.stringify(settings));
    
    // Apply changes
    currentEngine = settings.engine;
    currentTimezone = settings.timezone;
    applyTheme(settings.theme);
    
    updateTime();
    initSearchEngines();
    alert('Settings saved!');
}

// FUNGSI MODAL
function openSettings() {
    document.getElementById('settingsModal').style.display = 'block';
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

// EVENT LISTENERS
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') search();
    });
    
    // AI
    document.getElementById('aiButton').onclick = openAI;
    
    // Notes
    document.getElementById('saveNotesButton').onclick = saveNotes;
    document.getElementById('clearNotesButton').onclick = clearNotes;
    
    // Quotes
    document.getElementById('newQuoteButton').onclick = showRandomQuote;
    
    // Theme change
    document.getElementById('themeSelect').addEventListener('change', function() {
        applyTheme(this.value);
    });
    
    // Settings modal
    document.getElementById('saveSettingsButton').onclick = saveSettings;
    document.getElementById('closeSettingsButton').onclick = closeSettings;
    
    // Close modal on outside click
    window.onclick = function(event) {
        const modal = document.getElementById('settingsModal');
        if (event.target === modal) {
            closeSettings();
        }
    };
}

// KEYBOARD SHORTCUTS
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + K = focus search
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        // Ctrl + 0 = open settings
        if (e.ctrlKey && e.key === '0') {
            e.preventDefault();
            openSettings();
        }
        
        // ESC = close modal
        if (e.key === 'Escape') {
            closeSettings();
        }
    });
}

// EXPORT KE WINDOW (buat debugging)
window.brutal = {
    search,
    saveNotes,
    showRandomQuote,
    openSettings,
    applyTheme
};