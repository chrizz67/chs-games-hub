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

// Games UI elements
const modeInternalBtn = document.getElementById("modeInternal");
const modeExternalBtn = document.getElementById("modeExternal");
const gameCategoriesEl = document.getElementById("gameCategories");
const gameSearch = document.getElementById("gameSearch");
const gameListInternalEl = document.getElementById("gameListInternal");
const gameListExternalEl = document.getElementById("gameListExternal");
const popularEl = document.getElementById("popularGames");

// Game overlay
const gameOverlay = document.getElementById("gameOverlay");
const gameOverlayTitle = document.getElementById("gameOverlayTitle");
const gameFrame = document.getElementById("gameFrame");
const closeGameBtn = document.getElementById("closeGameBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

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

// --- GAME DATA ---

// Internal games will expect files like /internal-games/<id>/index.html
const internalGames = [
  {
    id: "tunnel-run",
    name: "Tunnel Run",
    desc: "Dodge walls in a fast 3D tunnel.",
    category: "Action",
    url: "/internal-games/tunnel-run/index.html"
  },
  {
    id: "pixel-jumper",
    name: "Pixel Jumper",
    desc: "Simple platformer with tight jumps.",
    category: "Platformer",
    url: "/internal-games/pixel-jumper/index.html"
  },
  {
    id: "drift-square",
    name: "Drift Square",
    desc: "Top-down drifting around corners.",
    category: "Racing",
    url: "/internal-games/drift-square/index.html"
  },
  {
    id: "laser-dodger",
    name: "Laser Dodger",
    desc: "Stay alive while lasers sweep the map.",
    category: "Action",
    url: "/internal-games/laser-dodger/index.html"
  },
  {
    id: "block-puzzle",
    name: "Block Puzzle",
    desc: "Fit the shapes into the grid.",
    category: "Puzzle",
    url: "/internal-games/block-puzzle/index.html"
  },
  {
    id: "tower-defense-lite",
    name: "Tower Defense Lite",
    desc: "Stop the wave before it reaches the base.",
    category: "Strategy",
    url: "/internal-games/tower-defense-lite/index.html"
  },
  {
    id: "flash-runner",
    name: "Flash Runner",
    desc: "Endless runner styled like old Flash games.",
    category: "Flash Classics",
    url: "/internal-games/flash-runner/index.html"
  },
  {
    id: "chs-hoops",
    name: "CHS Hoops",
    desc: "1v1 basketball minigame (future CHS original).",
    category: "CHS Originals",
    url: "/internal-games/chs-hoops/index.html"
  }
];

// External games (big titles that can't be self-hosted)
const externalGames = [
  {
    id: "krunker",
    name: "Krunker",
    desc: "Fast-paced FPS in the browser.",
    category: "FPS",
    url: "https://krunker.io/"
  },
  {
    id: "1v1lol",
    name: "1v1.lol",
    desc: "Build and fight in 1v1 matches.",
    category: "Battle Royale",
    url: "https://1v1.lol/"
  },
  {
    id: "shell-shockers",
    name: "Shell Shockers",
    desc: "Egg FPS chaos.",
    category: "FPS",
    url: "https://shellshock.io/"
  },
  {
    id: "surviv-io",
    name: "Surviv.io (mirror)",
    desc: "2D battle royale.",
    category: "Battle Royale",
    url: "https://surviv.io/" // may redirect
  },
  {
    id: "drift-hunters",
    name: "Drift Hunters",
    desc: "3D car drifting.",
    category: "Racing",
    url: "https://drifthunters.io/"
  },
  {
    id: "zombs-royale",
    name: "Zombs Royale",
    desc: "Top-down battle royale.",
    category: "Battle Royale",
    url: "https://zombsroyale.io/"
  },
  {
    id: "smash-karts",
    name: "Smash Karts",
    desc: "Kart battling with powerups.",
    category: "Racing",
    url: "https://smashkarts.io/"
  },
  {
    id: "r6-style",
    name: "R6 Style Tactics",
    desc: "Round-based tactical shooter (external).",
    category: "Tactical",
    url: "https://www.crazygames.com/game/tactical-weapon-pack" // placeholder style
  }
];

const internalCategories = [
  "All",
  "Action",
  "Platformer",
  "Racing",
  "Puzzle",
  "Strategy",
  "Flash Classics",
  "CHS Originals"
];

const externalCategories = [
  "All",
  "IO Games",
  "FPS",
  "Battle Royale",
  "Racing",
  "Tactical"
];

let currentGameMode = "internal"; // "internal" or "external"
let currentCategory = "All";

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
    const mode = btn.dataset.mode;
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

  buildCategoryPills();
  renderGames();
  renderPopularGames();
  renderAchievements();
  renderLeaderboard();
  loadChat();
}

// ----- GAMES (internal / external, categories, overlay) -----
function buildCategoryPills() {
  gameCategoriesEl.innerHTML = "";
  const cats = currentGameMode === "internal" ? internalCategories : externalCategories;

  cats.forEach(cat => {
    const pill = document.createElement("button");
    pill.className = "cat-pill" + (cat === currentCategory ? " active" : "");
    pill.textContent = cat;
    pill.addEventListener("click", () => {
      currentCategory = cat;
      buildCategoryPills();
      renderGames();
    });
    gameCategoriesEl.appendChild(pill);
  });
}

function gameMatchesCategory(game, cat) {
  if (cat === "All") return true;
  if (!game.category) return false;

  if (currentGameMode === "external" && cat === "IO Games") {
    return game.category === "IO" || game.name.toLowerCase().includes(".io");
  }

  return game.category.toLowerCase() === cat.toLowerCase();
}

function renderGames() {
  const term = (gameSearch.value || "").toLowerCase();

  let gamesToShow;
  if (currentGameMode === "internal") {
    gamesToShow = internalGames;
    gameListInternalEl.classList.remove("hidden");
    gameListExternalEl.classList.add("hidden");
  } else {
    gamesToShow = externalGames;
    gameListInternalEl.classList.add("hidden");
    gameListExternalEl.classList.remove("hidden");
  }

  const targetList = currentGameMode === "internal" ? gameListInternalEl : gameListExternalEl;
  targetList.innerHTML = "";

  gamesToShow
    .filter(g => g.name.toLowerCase().includes(term) || (g.desc || "").toLowerCase().includes(term))
    .filter(g => gameMatchesCategory(g, currentCategory))
    .forEach(game => {
      const row = document.createElement("div");
      row.className = "game-item";
      row.innerHTML = `
        <div class="game-info">
          <h4>${game.name}</h4>
          <p>${game.desc}</p>
          <div class="game-meta">${currentGameMode === "internal" ? "Internal" : "External"} • ${game.category || "Unsorted"}</div>
        </div>
        <button class="game-play-btn">Play</button>
      `;
      row.querySelector(".game-play-btn").addEventListener("click", () => playGame(game, currentGameMode));
      targetList.appendChild(row);
    });
}

gameSearch.addEventListener("input", renderGames);

// Mode toggle (internal/external)
modeInternalBtn.addEventListener("click", () => {
  currentGameMode = "internal";
  currentCategory = "All";
  modeInternalBtn.classList.add("active");
  modeExternalBtn.classList.remove("active");
  buildCategoryPills();
  renderGames();
});

modeExternalBtn.addEventListener("click", () => {
  currentGameMode = "external";
  currentCategory = "All";
  modeExternalBtn.classList.add("active");
  modeInternalBtn.classList.remove("active");
  buildCategoryPills();
  renderGames();
});

// Popular (show from both lists for now)
function renderPopularGames() {
  popularEl.innerHTML = "";
  const mix = [...internalGames.slice(0, 3), ...externalGames.slice(0, 2)];
  mix.forEach(g => {
    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = g.name;
    popularEl.appendChild(pill);
  });
}

function playGame(game, mode) {
  if (!currentUser) return;

  // Stats
  currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
  currentUser.coins = (currentUser.coins || 0) + 5;
  checkAchievements();
  saveUsers();
  updateUI();

  // Show overlay instead of direct new tab
  openGameOverlay(game, mode);
}

// Overlay + fullscreen
function openGameOverlay(game, mode) {
  gameOverlayTitle.textContent = game.name + (mode === "external" ? " (external)" : "");
  gameFrame.src = game.url;
  gameOverlay.classList.remove("hidden");
}

closeGameBtn.addEventListener("click", () => {
  gameOverlay.classList.add("hidden");
  gameFrame.src = "";
});

fullscreenBtn.addEventListener("click", () => {
  const elem = gameFrame;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
});

// close overlay on ESC if not fullscreen
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (!gameOverlay.classList.contains("hidden")) {
        gameOverlay.classList.add("hidden");
        gameFrame.src = "";
      }
    }
  }
});

// ----- ACHIEVEMENTS -----
function checkAchievements() {
  if (!currentUser.earnedAchievements) currentUser.earnedAchievements = [];

  const earnedSet = new Set(currentUser.earnedAchievements);

  baseAchievements.forEach(a => {
    if (a.id === "login_once") return;
    if (a.id === "play_1" &&_
