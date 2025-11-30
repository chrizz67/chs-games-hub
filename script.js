// Local storage keys
const USERS_KEY = "notchris_hub_users_v1";
const CURRENT_KEY = "notchris_hub_current_user_v1";
const CHAT_KEY = "notchris_hub_chat_v1";

// Elements
const loader = document.getElementById("loader");
const authScreen = document.getElementById("authScreen");
const authForm = document.getElementById("authForm");
const authName = document.getElementById("authName");
const authPin = document.getElementById("authPin");

const app = document.getElementById("app");

// Top / Home elements
const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");
const usernameLabel = document.getElementById("usernameLabel");
const coinAmount = document.getElementById("coinAmount");
const homeCoins = document.getElementById("homeCoins");
const homeGames = document.getElementById("homeGames");
const homeAch = document.getElementById("homeAch");
const popularGamesEl = document.getElementById("popularGames");
const leaderboardEl = document.getElementById("leaderboard");

// Nav / screens
const navButtons = document.querySelectorAll(".nav-btn");
const screens = document.querySelectorAll(".inner-screen");

// Games elements
const gameListEl = document.getElementById("gameList");
const gameSearch = document.getElementById("gameSearch");
const gamesSourceBtns = document.querySelectorAll(".games-source-btn");
const gamesCategoriesEl = document.getElementById("gamesCategories");

// Game overlay
const gameOverlay = document.getElementById("gameOverlay");
const gameFrame = document.getElementById("gameFrame");
const gameTitleEl = document.getElementById("gameTitle");
const gameBackBtn = document.getElementById("gameBackBtn");
const gameFullscreenBtn = document.getElementById("gameFullscreenBtn");

// Achievements
const achievementsListEl = document.getElementById("achievementsList");

// Profile
const profileName = document.getElementById("profileName");
const profileCoins = document.getElementById("profileCoins");
const profileGames = document.getElementById("profileGames");
const profileAch = document.getElementById("profileAch");
const logoutBtn = document.getElementById("logoutBtn");

// Chat
const chatMessagesEl = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

// Data
let users = [];
let currentUser = null;
let currentSource = "internal"; // "internal" or "external"
let currentCategory = "all";

// Achievements definition
const baseAchievements = [
  { id: "login_once", title: "Welcome In", desc: "Logged into the hub." },
  { id: "play_1", title: "First Game", desc: "Played your first game." },
  { id: "play_5", title: "Getting Warm", desc: "Played 5 games." },
  { id: "coins_100", title: "Coin Collector", desc: "Reach 100 coins." }
];

// Internal games (300 folders) with Option C: some available, some not
const internalGames = [];
for (let i = 1; i <= 300; i++) {
  let category;
  if (i % 5 === 1) category = "Action";
  else if (i % 5 === 2) category = "Racing";
  else if (i % 5 === 3) category = "Puzzle";
  else if (i % 5 === 4) category = "Arcade";
  else category = "Other";

  // Option C rule: first 30 marked as playable, rest "Unavailable"
  const available = i <= 30;

  internalGames.push({
    id: `game${i}`,
    name: `Game ${i}`,
    desc: available ? `Internal game #${i}` : `Internal game #${i} (not ready yet)`,
    category,
    link: `/internal-games/game${i}/index.html`,
    available
  });
}

// External games
const externalGames = [
  {
    id: "krunker",
    name: "Krunker",
    desc: "Fast-paced FPS.",
    category: "FPS",
    link: "https://krunker.io"
  },
  {
    id: "1v1lol",
    name: "1v1.lol",
    desc: "Build & fight duels.",
    category: "Battle Royale",
    link: "https://1v1.lol"
  },
  {
    id: "shellshock",
    name: "Shell Shockers",
    desc: "Egg FPS online.",
    category: "FPS",
    link: "https://shellshock.io"
  },
  {
    id: "surviv",
    name: "Surviv.io",
    desc: "2D battle royale.",
    category: "Battle Royale",
    link: "https://surviv.io"
  }
];

// ---- Storage helpers ----
function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) users = JSON.parse(raw);
  } catch (e) {
    users = [];
  }
}

function saveUsers() {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUser(name) {
  return users.find(u => u.username.toLowerCase() === name.toLowerCase());
}

function setCurrentUser(u) {
  currentUser = u;
  if (u) localStorage.setItem(CURRENT_KEY, u.username);
  else localStorage.removeItem(CURRENT_KEY);
}

// ---- Auth ----
authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = authName.value.trim();
  const pin = authPin.value.trim();

  if (!name || pin.length !== 4) {
    alert("Enter a username and a 4-digit PIN.");
    return;
  }

  let u = findUser(name);
  if (!u) {
    // create new
    u = {
      username: name,
      pin,
      coins: 0,
      gamesPlayed: 0,
      achievementsUnlocked: 0,
      earnedAchievements: []
    };
    users.push(u);
    saveUsers();
  } else {
    // login
    if (u.pin !== pin) {
      alert("Wrong PIN for this username.");
      return;
    }
  }

  setCurrentUser(u);
  enterApp();
});

logoutBtn.addEventListener("click", () => {
  if (!confirm("Log out and clear this session on this device?")) return;
  currentUser = null;
  setCurrentUser(null);
  app.classList.add("hidden");
  authScreen.classList.remove("hidden");
  authName.value = "";
  authPin.value = "";
});

// ---- Navigation ----
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    screens.forEach(s => s.classList.remove("active"));
    const screen = document.getElementById(`screen-${target}`);
    if (screen) screen.classList.add("active");
  });
});

// ---- Games ----
function getCurrentGames() {
  return currentSource === "internal" ? internalGames : externalGames;
}

function buildCategories() {
  const games = getCurrentGames();
  const cats = new Set();
  games.forEach(g => cats.add(g.category || "Other"));

  gamesCategoriesEl.innerHTML = "";

  // "All" pill
  const all = document.createElement("button");
  all.className = "cat-pill" + (currentCategory === "all" ? " active" : "");
  all.textContent = "All";
  all.addEventListener("click", () => {
    currentCategory = "all";
    buildCategories();
    renderGames();
  });
  gamesCategoriesEl.appendChild(all);

  cats.forEach(cat => {
    const pill = document.createElement("button");
    pill.className = "cat-pill" + (currentCategory === cat ? " active" : "");
    pill.textContent = cat;
    pill.addEventListener("click", () => {
      currentCategory = cat;
      buildCategories();
      renderGames();
    });
    gamesCategoriesEl.appendChild(pill);
  });
}

function renderGames() {
  const games = getCurrentGames();
  const term = (gameSearch.value || "").toLowerCase();
  gameListEl.innerHTML = "";

  games
    .filter(g => g.name.toLowerCase().includes(term))
    .filter(g => currentCategory === "all" || g.category === currentCategory)
    .forEach(game => {
      const row = document.createElement("div");
      row.className = "game-item";

      const playable = (currentSource === "external") || (currentSource === "internal" && game.available);

      row.innerHTML = `
        <div class="game-info">
          <h4>${game.name}</h4>
          <p>${game.desc}</p>
          <div class="game-meta">
            ${currentSource === "internal" ? "Internal" : "External"} • ${game.category || ""}
            ${!playable && currentSource === "internal" ? " • Unavailable" : ""}
          </div>
        </div>
        <button class="game-play-btn ${playable ? "" : "disabled"}">
          ${playable ? "Play" : "Unavailable"}
        </button>
      `;

      const btn = row.querySelector(".game-play-btn");
      if (playable) {
        if (currentSource === "internal") {
          btn.addEventListener("click", () => playInternalGame(game));
        } else {
          btn.addEventListener("click", () => playExternalGame(game));
        }
      } else {
        btn.addEventListener("click", () => {
          alert("This game isn't set up yet.");
        });
      }

      gameListEl.appendChild(row);
    });
}

gameSearch.addEventListener("input", renderGames);

gamesSourceBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    gamesSourceBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentSource = btn.dataset.source;
    currentCategory = "all";
    buildCategories();
    renderGames();
  });
});

// Popular section
function renderPopularGames() {
  popularGamesEl.innerHTML = "";
  const all = internalGames.slice(0, 4).concat(externalGames.slice(0, 2));
  all.slice(0, 6).forEach(g => {
    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = g.name;
    popularGamesEl.appendChild(pill);
  });
}

// Game actions
function onGamePlayed() {
  if (!currentUser) return;
  currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
  currentUser.coins = (currentUser.coins || 0) + 5;
  checkAchievements();
  saveUsers();
  updateUI();
}

function playInternalGame(game) {
  if (!currentUser) return;
  onGamePlayed();
  openGameOverlay(game);
}

function playExternalGame(game) {
  if (!currentUser) return;
  onGamePlayed();
  window.open(game.link, "_blank");
}

// ---- Game overlay ----
function openGameOverlay(game) {
  gameTitleEl.textContent = game.name;
  gameFrame.src = "";
  gameOverlay.classList.remove("hidden");
  setTimeout(() => {
    gameFrame.src = game.link;
  }, 60);
}

function closeGameOverlay() {
  gameFrame.src = "";
  gameOverlay.classList.add("hidden");
}

gameBackBtn.addEventListener("click", closeGameOverlay);

gameFullscreenBtn.addEventListener("click", () => {
  const elem = gameFrame;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  else alert("Fullscreen not supported here.");
});

// ---- Achievements ----
function checkAchievements() {
  if (!currentUser) return;
  if (!currentUser.earnedAchievements) currentUser.earnedAchievements = [];
  const set = new Set(currentUser.earnedAchievements);

  if (!set.has("login_once")) set.add("login_once");
  if (currentUser.gamesPlayed >= 1) set.add("play_1");
  if (currentUser.gamesPlayed >= 5) set.add("play_5");
  if (currentUser.coins >= 100) set.add("coins_100");

  currentUser.earnedAchievements = Array.from(set);
  currentUser.achievementsUnlocked = currentUser.earnedAchievements.length;
}

function renderAchievements() {
  achievementsListEl.innerHTML = "";
  if (!currentUser) return;
  const set = new Set(currentUser.earnedAchievements || []);

  baseAchievements.forEach(a => {
    const earned = set.has(a.id);
    const div = document.createElement("div");
    div.className = "ach";
    div.innerHTML = `
      <div class="ach-title">${a.title}</div>
      <div class="ach-desc">${a.desc}</div>
      <div class="ach-earned">${earned ? "✔ Earned" : "• Locked"}</div>
    `;
    achievementsListEl.appendChild(div);
  });
}

// ---- Leaderboard (local) ----
function renderLeaderboard() {
  leaderboardEl.innerHTML = "";
  const sorted = [...users].sort((a, b) => (b.coins || 0) - (a.coins || 0));
  sorted.slice(0, 5).forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.username} — ${u.coins || 0} coins`;
    leaderboardEl.appendChild(li);
  });
}

// ---- Chat (local) ----
function loadChat() {
  chatMessagesEl.innerHTML = "";
  let msgs = [];
  try {
    const stored = localStorage.getItem(CHAT_KEY);
    if (stored) msgs = JSON.parse(stored);
  } catch (e) {}
  msgs.forEach(m => appendChatMessage(m.name, m.text, false));
}

function appendChatMessage(name, text, save = true) {
  const div = document.createElement("div");
  div.className = "chat-msg";
  div.innerHTML = `<span class="chat-name">${name}:</span><span>${text}</span>`;
  chatMessagesEl.appendChild(div);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

  if (save) {
    let msgs = [];
    try {
      const stored = localStorage.getItem(CHAT_KEY);
      if (stored) msgs = JSON.parse(stored);
    } catch (e) {}
    msgs.push({ name, text });
    localStorage.setItem(CHAT_KEY, JSON.stringify(msgs));
  }
}

chatSend.addEventListener("click", () => {
  const text = (chatInput.value || "").trim();
  if (!text || !currentUser) return;
  appendChatMessage(currentUser.username || "Anon", text, true);
  chatInput.value = "";
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    chatSend.click();
  }
});

// ---- UI refresh ----
function updateUI() {
  if (!currentUser) return;

  const uname = currentUser.username || "Player";
  welcomeTitle.textContent = "Hub";
  welcomeSubtitle.textContent = "Welcome to the NotChris hub — stats saved locally.";
  usernameLabel.textContent = uname;

  coinAmount.textContent = currentUser.coins || 0;
  homeCoins.textContent = currentUser.coins || 0;
  homeGames.textContent = currentUser.gamesPlayed || 0;
  homeAch.textContent = currentUser.achievementsUnlocked || 0;

  profileName.textContent = uname;
  profileCoins.textContent = currentUser.coins || 0;
  profileGames.textContent = currentUser.gamesPlayed || 0;
  profileAch.textContent = currentUser.achievementsUnlocked || 0;

  renderPopularGames();
  buildCategories();
  renderGames();
  renderAchievements();
  renderLeaderboard();
  loadChat();
}

// ---- Enter app ----
function enterApp() {
  authScreen.classList.add("hidden");
  app.classList.remove("hidden");
  checkAchievements();
  saveUsers();
  updateUI();
}

// ---- Init ----
function init() {
  loadUsers();

  const currentName = localStorage.getItem(CURRENT_KEY);
  if (currentName) {
    const u = findUser(currentName);
    if (u) {
      setCurrentUser(u);
      enterApp();
    } else {
      authScreen.classList.remove("hidden");
    }
  } else {
    authScreen.classList.remove("hidden");
  }

  if (loader) {
    loader.classList.add("hidden");
  }
}

// Start
init();
