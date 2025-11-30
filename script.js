// Storage keys
const USERS_KEY = "chs_hub_users_v1";
const CURRENT_KEY = "chs_hub_current_user_v1";
const CHAT_KEY = "chs_hub_chat_v1";

// Data
let users = [];
let currentUser = null;

// Elements
const loaderScreen = document.getElementById("loader");

const screenSignup = document.getElementById("screen-signup");
const screenLogin = document.getElementById("screen-login");
const screenDevice = document.getElementById("screen-device");
const app = document.getElementById("app");

// Auth inputs
const signupName = document.getElementById("signupName");
const signupPin = document.getElementById("signupPin");
const signupPin2 = document.getElementById("signupPin2");
const signupBtn = document.getElementById("signupBtn");
const goLogin = document.getElementById("goLogin");

const loginName = document.getElementById("loginName");
const loginPin = document.getElementById("loginPin");
const loginBtn = document.getElementById("loginBtn");
const goSignup = document.getElementById("goSignup");

// Device
const deviceButtons = document.querySelectorAll(".device-btn");

// App UI
const navButtons = document.querySelectorAll(".nav-btn");
const innerScreens = document.querySelectorAll(".inner-screen");

const usernameLabel = document.getElementById("usernameLabel");
const welcomeText = document.getElementById("welcomeText");
const coinAmount = document.getElementById("coinAmount");

const homeCoins = document.getElementById("homeCoins");
const homeGames = document.getElementById("homeGames");
const homeAch = document.getElementById("homeAch");

const profileName = document.getElementById("profileName");
const profileCoins = document.getElementById("profileCoins");
const profileGames = document.getElementById("profileGames");
const profileAch = document.getElementById("profileAch");
const profileMode = document.getElementById("profileMode");
const changeModeBtn = document.getElementById("changeModeBtn");
const logoutBtn = document.getElementById("logoutBtn");

// GAMES UI
const gameListEl = document.getElementById("gameList");
const gameSearch = document.getElementById("gameSearch");
const popularEl = document.getElementById("popularGames");
const gamesTabs = document.querySelectorAll(".games-tab");
const gamesCategoriesEl = document.getElementById("gamesCategories");

// GAME OVERLAY (internal fullscreen)
const gameOverlay = document.getElementById("gameOverlay");
const gameFrame = document.getElementById("gameFrame");
const gameTitleEl = document.getElementById("gameTitle");
const gameBackBtn = document.getElementById("gameBackBtn");
const gameFullscreenBtn = document.getElementById("gameFullscreenBtn");

// Achievements
const baseAchievements = [
  { id: "login_once", title: "Welcome In", desc: "Logged into the hub for the first time." },
  { id: "play_1", title: "First Game", desc: "Played your first game." },
  { id: "play_5", title: "Getting Warm", desc: "Played 5 games.", threshold: 5 },
  { id: "coins_100", title: "Coin Collector", desc: "Reach 100 coins.", threshold: 100 }
];

const achievementsListEl = document.getElementById("achievementsList");

// Leaderboard
const leaderboardEl = document.getElementById("leaderboard");

// Chat
const chatMessagesEl = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

// ----- GAME DATA -----
// Internal games: these expect files in /internal-games/...
// Example: /internal-games/hextris/index.html
const internalGames = [
  {
    id: "hextris",
    name: "Hextris",
    desc: "Fast falling-block puzzle.",
    category: "Puzzle",
    link: "/internal-games/hextris/index.html"
  },
  {
    id: "space-blaster",
    name: "Space Blaster",
    desc: "Arcade space shooter.",
    category: "Action",
    link: "/internal-games/space-blaster/index.html"
  },
  {
    id: "street-racer",
    name: "Street Racer",
    desc: "Top-down racing game.",
    category: "Racing",
    link: "/internal-games/street-racer/index.html"
  },
  {
    id: "tower-defense",
    name: "Mini TD",
    desc: "Simple tower defense.",
    category: "Strategy",
    link: "/internal-games/mini-td/index.html"
  },
  {
    id: "platformer-demo",
    name: "Pixel Runner",
    desc: "Classic platformer demo.",
    category: "Platformer",
    link: "/internal-games/pixel-runner/index.html"
  }
  // later we can add 50+ more here
];

// External games: big titles you can’t self-host
const externalGames = [
  {
    id: "krunker",
    name: "Krunker",
    desc: "Fast-paced FPS IO game.",
    category: "FPS",
    link: "https://krunker.io"
  },
  {
    id: "1v1lol",
    name: "1v1.lol",
    desc: "Build and fight 1v1.",
    category: "Battle Royale",
    link: "https://1v1.lol"
  },
  {
    id: "shellshock",
    name: "Shell Shockers",
    desc: "Egg-based online FPS.",
    category: "FPS",
    link: "https://shellshock.io"
  },
  {
    id: "survivio",
    name: "Surviv.io",
    desc: "2D battle royale.",
    category: "Battle Royale",
    link: "https://surviv.io"
  }
];

// state for games UI
let currentSource = "internal"; // "internal" or "external"
let currentCategory = "all";

// ----- Helpers -----
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

function setCurrentUser(u) {
  currentUser = u;
  if (u) {
    localStorage.setItem(CURRENT_KEY, u.username);
  } else {
    localStorage.removeItem(CURRENT_KEY);
  }
}

function findUser(username) {
  return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

function updateBodyLayout() {
  document.body.classList.remove("mobile-mode", "tablet-mode", "desktop-mode");
  if (!currentUser || !currentUser.deviceMode) return;

  if (currentUser.deviceMode === "desktop") {
    document.body.classList.add("desktop-mode");
  } else if (currentUser.deviceMode === "tablet") {
    document.body.classList.add("tablet-mode");
  } else {
    document.body.classList.add("mobile-mode");
  }
}

// ----- NAV / TABS -----
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    navButtons.forEach(b => b.classList.remove("active"));
    navButtons.forEach(b => {
      if (b.dataset.target === target) b.classList.add("active");
    });

    innerScreens.forEach(scr => scr.classList.remove("active"));
    const screen = document.getElementById("screen-" + target);
    if (screen) screen.classList.add("active");
  });
});

// ----- AUTH FLOW -----
goLogin.addEventListener("click", () => {
  screenSignup.classList.add("hidden");
  screenLogin.classList.remove("hidden");
});

goSignup.addEventListener("click", () => {
  screenLogin.classList.add("hidden");
  screenSignup.classList.remove("hidden");
});

signupBtn.addEventListener("click", () => {
  const name = signupName.value.trim();
  const pin = signupPin.value.trim();
  const pin2 = signupPin2.value.trim();

  if (!name || pin.length !== 4 || pin2.length !== 4) {
    alert("Enter a username and 4-digit PIN (twice).");
    return;
  }
  if (pin !== pin2) {
    alert("PINs do not match.");
    return;
  }
  if (findUser(name)) {
    alert("Username already exists. Choose another.");
    return;
  }

  const newUser = {
    username: name,
    pin,
    coins: 0,
    gamesPlayed: 0,
    achievementsUnlocked: 0,
    earnedAchievements: [],
    deviceMode: null
  };

  users.push(newUser);
  saveUsers();
  setCurrentUser(newUser);

  screenSignup.classList.add("hidden");
  screenDevice.classList.remove("hidden");
});

loginBtn.addEventListener("click", () => {
  const name = loginName.value.trim();
  const pin = loginPin.value.trim();

  if (!name || pin.length !== 4) {
    alert("Enter username and 4-digit PIN.");
    return;
  }

  const u = findUser(name);
  if (!u) {
    alert("No account with that username. Please sign up.");
    screenLogin.classList.add("hidden");
    screenSignup.classList.remove("hidden");
    return;
  }

  if (u.pin !== pin) {
    alert("Wrong PIN.");
    return;
  }

  setCurrentUser(u);

  if (!currentUser.deviceMode) {
    screenLogin.classList.add("hidden");
    screenDevice.classList.remove("hidden");
  } else {
    enterApp();
  }
});

// Device selection
deviceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!currentUser) return;
    const mode = btn.dataset.mode; // "mobile", "tablet", "desktop"
    currentUser.deviceMode = mode;
    saveUsers();
    updateBodyLayout();
    enterApp();
  });
});

changeModeBtn.addEventListener("click", () => {
  if (!currentUser) return;
  app.classList.add("hidden");
  screenDevice.classList.remove("hidden");
});

// Logout
logoutBtn.addEventListener("click", () => {
  if (!confirm("Log out and clear this user progress on this device?")) return;
  currentUser = null;
  setCurrentUser(null);
  updateBodyLayout();
  app.classList.add("hidden");
  screenDevice.classList.add("hidden");
  screenLogin.classList.add("hidden");
  screenSignup.classList.remove("hidden");
});

// ----- APP ENTRY -----
function enterApp() {
  screenSignup.classList.add("hidden");
  screenLogin.classList.add("hidden");
  screenDevice.classList.add("hidden");
  app.classList.remove("hidden");
  updateBodyLayout();
  awardLoginAchievement();
  saveUsers();
  updateUI();
}

function updateUI() {
  if (!currentUser) return;

  usernameLabel.textContent = currentUser.username;
  welcomeText.textContent = `Welcome, ${currentUser.username}.`;

  coinAmount.textContent = currentUser.coins || 0;
  homeCoins.textContent = currentUser.coins || 0;
  homeGames.textContent = currentUser.gamesPlayed || 0;
  homeAch.textContent = currentUser.achievementsUnlocked || 0;

  profileName.textContent = currentUser.username;
  profileCoins.textContent = currentUser.coins || 0;
  profileGames.textContent = currentUser.gamesPlayed || 0;
  profileAch.textContent = currentUser.achievementsUnlocked || 0;
  profileMode.textContent = currentUser.deviceMode || "mobile";

  renderGames();
  renderPopularGames();
  renderAchievements();
  renderLeaderboard();
  loadChat();
}

// ----- GAMES LOGIC -----
function getCurrentGames() {
  return currentSource === "internal" ? internalGames : externalGames;
}

function buildCategories() {
  const games = getCurrentGames();
  const cats = new Set();
  games.forEach(g => cats.add(g.category || "Other"));
  gamesCategoriesEl.innerHTML = "";

  const allPill = document.createElement("button");
  allPill.className = "cat-pill" + (currentCategory === "all" ? " active" : "");
  allPill.textContent = "All";
  allPill.addEventListener("click", () => {
    currentCategory = "all";
    buildCategories();
    renderGames();
  });
  gamesCategoriesEl.appendChild(allPill);

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
      row.innerHTML = `
        <div class="game-info">
          <h4>${game.name}</h4>
          <p>${game.desc}</p>
          <div class="game-meta">${currentSource === "internal" ? "Internal" : "External"} • ${game.category || ""}</div>
        </div>
        <button class="game-play-btn">Play</button>
      `;
      const btn = row.querySelector(".game-play-btn");
      if (currentSource === "internal") {
        btn.addEventListener("click", () => playInternalGame(game));
      } else {
        btn.addEventListener("click", () => playExternalGame(game));
      }
      gameListEl.appendChild(row);
    });
}

gameSearch.addEventListener("input", renderGames);

// tabs: internal / external
gamesTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    gamesTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentSource = tab.dataset.source; // internal or external
    currentCategory = "all";
    buildCategories();
    renderGames();
  });
});

function renderPopularGames() {
  popularEl.innerHTML = "";
  const games = internalGames.concat(externalGames).slice(0, 5);
  games.forEach(g => {
    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = g.name;
    popularEl.appendChild(pill);
  });
}

// game stats shared
function onGamePlayed() {
  if (!currentUser) return;
  currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
  currentUser.coins = (currentUser.coins || 0) + 5;
  checkAchievements();
  saveUsers();
  updateUI();
}

// internal game uses overlay + fullscreen option
function playInternalGame(game) {
  if (!currentUser) return;
  onGamePlayed();
  openGameOverlay(game);
}

// external game opens in new tab
function playExternalGame(game) {
  if (!currentUser) return;
  onGamePlayed();
  window.open(game.link, "_blank");
}

// ----- GAME OVERLAY -----
function openGameOverlay(game) {
  gameTitleEl.textContent = game.name;
  // clear first so old game stops
  gameFrame.src = "";
  gameOverlay.classList.remove("hidden");
  // slight delay for smoother transition
  setTimeout(() => {
    gameFrame.src = game.link;
  }, 50);
}

function closeGameOverlay() {
  gameFrame.src = "";
  gameOverlay.classList.add("hidden");
}

gameBackBtn.addEventListener("click", closeGameOverlay);

// Fullscreen simple (F1 style)
gameFullscreenBtn.addEventListener("click", () => {
  const elem = gameFrame;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else {
    alert("Fullscreen not supported on this device/browser.");
  }
});

// ----- ACHIEVEMENTS -----
function checkAchievements() {
  if (!currentUser.earnedAchievements) currentUser.earnedAchievements = [];
  const earnedSet = new Set(currentUser.earnedAchievements);

  baseAchievements.forEach(a => {
    if (a.id === "login_once") return;
    if (a.id === "play_1" && currentUser.gamesPlayed >= 1) {
      earnedSet.add(a.id);
    }
    if (a.id === "play_5" && currentUser.gamesPlayed >= 5) {
      earnedSet.add(a.id);
    }
    if (a.id === "coins_100" && currentUser.coins >= 100) {
      earnedSet.add(a.id);
    }
  });

  currentUser.earnedAchievements = Array.from(earnedSet);
  currentUser.achievementsUnlocked = currentUser.earnedAchievements.length;
}

function renderAchievements() {
  achievementsListEl.innerHTML = "";
  if (!currentUser) return;
  const earnedSet = new Set(currentUser.earnedAchievements || []);

  baseAchievements.forEach(a => {
    const earned = earnedSet.has(a.id);
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

function awardLoginAchievement() {
  if (!currentUser) return;
  if (!currentUser.earnedAchievements) currentUser.earnedAchievements = [];
  if (!currentUser.earnedAchievements.includes("login_once")) {
    currentUser.earnedAchievements.push("login_once");
    currentUser.achievementsUnlocked = currentUser.earnedAchievements.length;
  }
}

// ----- LEADERBOARD (LOCAL ONLY) -----
function renderLeaderboard() {
  leaderboardEl.innerHTML = "";
  const sorted = [...users].sort((a, b) => (b.coins || 0) - (a.coins || 0));
  sorted.slice(0, 5).forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.username} — ${u.coins || 0} coins`;
    leaderboardEl.appendChild(li);
  });
}

// ----- CHAT (LOCAL STORAGE) -----
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
  const text = chatInput.value.trim();
  if (!text || !currentUser) return;
  appendChatMessage(currentUser.username || "Anon", text, true);
  chatInput.value = "";
});

chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    chatSend.click();
  }
});

// ----- INIT -----
function init() {
  loadUsers();

  const currentName = localStorage.getItem(CURRENT_KEY);
  if (currentName) {
    const u = findUser(currentName);
    if (u) {
      setCurrentUser(u);
      if (!currentUser.deviceMode) {
        screenSignup.classList.add("hidden");
        screenLogin.classList.add("hidden");
        screenDevice.classList.remove("hidden");
      } else {
        enterApp();
      }
      if (loaderScreen) loaderScreen.classList.add("hidden");
      buildCategories();
      return;
    }
  }

  // no user yet
  screenSignup.classList.remove("hidden");
  screenLogin.classList.add("hidden");
  if (loaderScreen) loaderScreen.classList.add("hidden");
  buildCategories();
}

init();
