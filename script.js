// Simple state
let user = {
  name: null,
  pin: null,
  coins: 0,
  gamesPlayed: 0,
  achievementsUnlocked: 0
};

const STORAGE_KEY = "chs_hub_user_v1";
const CHAT_KEY = "chs_hub_chat_v1";

// Load user if exists
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    user = JSON.parse(saved);
  } catch (e) {}
}

// Elements
const loginScreen = document.getElementById("screen-login");
const app = document.getElementById("app");
const loginName = document.getElementById("loginName");
const loginPin = document.getElementById("loginPin");
const loginBtn = document.getElementById("loginBtn");

const usernameLabel = document.getElementById("usernameLabel");
const coinAmount = document.getElementById("coinAmount");
const profileName = document.getElementById("profileName");
const profileCoins = document.getElementById("profileCoins");
const profileGames = document.getElementById("profileGames");
const profileAch = document.getElementById("profileAch");
const logoutBtn = document.getElementById("logoutBtn");

const navButtons = document.querySelectorAll(".nav-btn");
const innerScreens = document.querySelectorAll(".inner-screen");

// Games data (later you can add 500+ here)
const games = [
  { id: "surviv", name: "Surviv.io", desc: "2D battle royale", link: "https://example.com" },
  { id: "agar", name: "Agar.io", desc: "Cell eating arena", link: "https://example.com" },
  { id: "krunker", name: "Krunker", desc: "Fast FPS browser game", link: "https://example.com" },
  { id: "drift", name: "Drift Hunters", desc: "Car drifting", link: "https://example.com" },
  { id: "runner", name: "Subway Runner", desc: "Endless running", link: "https://example.com" }
];

// Achievements base list
const baseAchievements = [
  { id: "login_once", title: "Welcome In", desc: "Logged into the hub for the first time." },
  { id: "play_1", title: "First Game", desc: "Played your first game." },
  { id: "play_5", title: "Warming Up", desc: "Played 5 games.", threshold: 5 },
  { id: "coins_100", title: "Coin Collector", desc: "Reach 100 coins.", threshold: 100 }
];

let earnedAchievementIds = new Set();

// --- UTIL ---
function saveUser() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function switchToApp() {
  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");
  updateUI();
}

// --- LOGIN ---
loginBtn.addEventListener("click", () => {
  const name = loginName.value.trim();
  const pin = loginPin.value.trim();

  if (!name || pin.length < 4) {
    alert("Enter a username and a 4-digit PIN.");
    return;
  }

  user.name = name;
  user.pin = pin;
  if (!user.coins) user.coins = 0;
  saveUser();
  awardAchievement("login_once");
  switchToApp();
});

// Auto login if already saved
if (user.name && user.pin) {
  switchToApp();
}

// --- NAV / TABS ---
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.dataset.target; // e.g. "games"
    innerScreens.forEach(scr => {
      scr.classList.remove("active");
    });
    const screen = document.getElementById("screen-" + target);
    if (screen) screen.classList.add("active");
  });
});

// --- UI UPDATE ---
function updateUI() {
  usernameLabel.textContent = user.name || "Guest";
  coinAmount.textContent = user.coins || 0;

  profileName.textContent = user.name || "Guest";
  profileCoins.textContent = user.coins || 0;
  profileGames.textContent = user.gamesPlayed || 0;
  profileAch.textContent = user.achievementsUnlocked || 0;

  renderGames();
  renderPopularGames();
  renderAchievements();
  renderLeaderboard();
  loadChat();
}

// --- GAMES LIST ---
const gameListEl = document.getElementById("gameList");
const gameSearch = document.getElementById("gameSearch");

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

// Popular pills
const popularEl = document.getElementById("popularGames");
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
  user.gamesPlayed = (user.gamesPlayed || 0) + 1;
  user.coins = (user.coins || 0) + 5; // +5 coins per play
  saveUser();
  awardAchievement("play_1");
  if (user.gamesPlayed >= 5) awardAchievement("play_5");
  if (user.coins >= 100) awardAchievement("coins_100");
  updateUI();

  // For now just alert; later we can open real game link/iframe
  window.open(game.link, "_blank");
}

// --- ACHIEVEMENTS ---
const achievementsListEl = document.getElementById("achievementsList");

function awardAchievement(id) {
  if (!earnedAchievementIds.has(id)) {
    earnedAchievementIds.add(id);
    user.achievementsUnlocked = earnedAchievementIds.size;
    saveUser();
  }
}

function renderAchievements() {
  achievementsListEl.innerHTML = "";
  baseAchievements.forEach(a => {
    const earned = earnedAchievementIds.has(a.id);
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

// --- LEADERBOARD (LOCAL ONLY) ---
const leaderboardEl = document.getElementById("leaderboard");
function renderLeaderboard() {
  leaderboardEl.innerHTML = "";
  // For now we only have current user locally
  const li = document.createElement("li");
  li.textContent = `${user.name || "You"} — ${user.coins || 0} coins`;
  leaderboardEl.appendChild(li);
}

// --- CHAT (LOCAL STORAGE) ---
const chatMessagesEl = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

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
  if (!text) return;
  appendChatMessage(user.name || "Anon", text, true);
  chatInput.value = "";
});

// send on Enter
chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    chatSend.click();
  }
});

// --- LOGOUT ---
logoutBtn.addEventListener("click", () => {
  if (!confirm("Log out and clear local data?")) return;
  localStorage.removeItem(STORAGE_KEY);
  // keep chat history but reset user
  user = { name: null, pin: null, coins: 0, gamesPlayed: 0, achievementsUnlocked: 0 };
  // Go back to login
  app.classList.add("hidden");
  loginScreen.classList.remove("hidden");
});

// initial UI
if (user.name && user.pin) {
  // already switched to app above
  updateUI();
}
