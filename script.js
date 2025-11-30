// Storage keys
const USERS_KEY = "chs_hub_users_v1";
const CURRENT_KEY = "chs_hub_current_user_v1";
const CHAT_KEY = "chs_hub_chat_v1";

// Data
let users = [];
let currentUser = null;

// Elements
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

// Games
const games = [
  { id: "surviv", name: "Surviv.io", desc: "2D battle royale", link: "https://example.com" },
  { id: "agar", name: "Agar.io", desc: "Cell-eating arena", link: "https://example.com" },
  { id: "krunker", name: "Krunker", desc: "Fast FPS browser game", link: "https://example.com" },
  { id: "drift", name: "Drift Hunters", desc: "Car drifting", link: "https://example.com" },
  { id: "runner", name: "Subway Runner", desc: "Endless running", link: "https://example.com" }
];

const gameListEl = document.getElementById("gameList");
const gameSearch = document.getElementById("gameSearch");
const popularEl = document.getElementById("popularGames");

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
  if (!currentUser || !currentUser.deviceMode) {
    document.body.classList.remove("desktop-mode");
    return;
  }
  if (currentUser.deviceMode === "desktop") {
    document.body.classList.add("desktop-mode");
  } else {
    document.body.classList.remove("desktop-mode");
  }
}

// ----- Navigation -----
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target; // e.g. "home"

    navButtons.forEach(b => b.classList.remove("active"));
    navButtons.forEach(b => {
      if (b.dataset.target === target) b.classList.add("active");
    });

    innerScreens.forEach(scr => scr.classList.remove("active"));
    const screen = document.getElementById("screen-" + target);
    if (screen) screen.classList.add("active");
  });
});

// ----- Auth flow -----
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

  // Go to device selection
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
    const mode = btn.dataset.mode; // "mobile" or "desktop"
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

// ----- App entry -----
function enterApp() {
  screenSignup.classList.add("hidden");
  screenLogin.classList.add("hidden");
  screenDevice.classList.add("hidden");
  app.classList.remove("hidden");
  updateBodyLayout();
  updateUI();
}

// ----- UI Update -----
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

// ----- Games -----
function renderGames() {
  const term = (gameSearch.value || "").toLowerCase();
  gameListEl.innerHTML = "";
  games
    .filter(g => g.name.toLowerCase().includes(term))
    .forEach(game => {
      const row = document.createElement("div");
      row.className = "game-item";
      row.innerHTML = `
        <div class="game-info">
          <h4>${game.name}</h4>
          <p>${game.desc}</p>
        </div>
        <button class="game-play-btn">Play</button>
      `;
      row.querySelector(".game-play-btn").addEventListener("click", () => playGame(game));
      gameListEl.appendChild(row);
    });
}

gameSearch.addEventListener("input", renderGames);

function renderPopularGames() {
  popularEl.innerHTML = "";
  games.slice(0, 3).forEach(g => {
    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = g.name;
    popularEl.appendChild(pill);
  });
}

function playGame(game) {
  if (!currentUser) return;
  currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
  currentUser.coins = (currentUser.coins || 0) + 5;
  checkAchievements();
  saveUsers();
  updateUI();

  // later we replace example.com with real game URLs
  window.open(game.link, "_blank");
}

// ----- Achievements -----
function checkAchievements() {
  if (!currentUser.earnedAchievements) currentUser.earnedAchievements = [];

  const earnedSet = new Set(currentUser.earnedAchievements);

  baseAchievements.forEach(a => {
    if (a.id === "login_once") {
      // already handled on signup/login if needed
      return;
    }
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

// award login_once when they first use the app
function awardLoginAchievement() {
  if (!currentUser) return;
  if (!currentUser.earnedAchievements) currentUser.earnedAchievements = [];
  if (!currentUser.earnedAchievements.includes("login_once")) {
    currentUser.earnedAchievements.push("login_once");
    currentUser.achievementsUnlocked = currentUser.earnedAchievements.length;
    saveUsers();
  }
}

// ----- Leaderboard (local only) -----
function renderLeaderboard() {
  leaderboardEl.innerHTML = "";
  // sort local users by coins (desc)
  const sorted = [...users].sort((a, b) => (b.coins || 0) - (a.coins || 0));
  sorted.slice(0, 5).forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.username} — ${u.coins || 0} coins`;
    leaderboardEl.appendChild(li);
  });
}

// ----- Chat (local) -----
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

// ----- Init -----
function init() {
  loadUsers();
  const currentName = localStorage.getItem(CURRENT_KEY);
  if (currentName) {
    const u = findUser(currentName);
    if (u) {
      setCurrentUser(u);
      if (!currentUser.deviceMode) {
        // go to device selection
        screenSignup.classList.add("hidden");
        screenLogin.classList.add("hidden");
        screenDevice.classList.remove("hidden");
      } else {
        enterApp();
      }
      awardLoginAchievement();
      saveUsers();
      updateUI();
      return;
    }
  }

  // no user => show signup by default
  screenSignup.classList.remove("hidden");
  screenLogin.classList.add("hidden");
}

init();
