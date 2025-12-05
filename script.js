// =======================
//  NotChris Hub Script
//  Local + optional Firebase backend hooks
// =======================

// ---- Local storage keys ----
const USERS_KEY = "notchris_hub_users_v2";
const CURRENT_KEY = "notchris_hub_current_user_v2";
const CHAT_KEY = "notchris_hub_chat_v2";
const SETTINGS_KEY = "notchris_hub_settings_v1";
const ACTIVITY_KEY = "notchris_hub_activity_v1";

// ---- DOM elements ----
const loader = document.getElementById("loader");
const authScreen = document.getElementById("authScreen");
const authForm = document.getElementById("authForm");
const authName = document.getElementById("authName");
const authPin = document.getElementById("authPin");

const app = document.getElementById("app");

// Top / Home
const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");
const usernameLabel = document.getElementById("usernameLabel");
const coinAmount = document.getElementById("coinAmount");
const streakLabel = document.getElementById("streakLabel");
const homeCoins = document.getElementById("homeCoins");
const homeGames = document.getElementById("homeGames");
const homeAch = document.getElementById("homeAch");
const popularGamesEl = document.getElementById("popularGames");
const trendingGamesEl = document.getElementById("trendingGames");
const newGamesEl = document.getElementById("newGames");
const continueBtn = document.getElementById("continueBtn");
const dailyBtn = document.getElementById("dailyBtn");

// Banner / profile top
const profileAvatar = document.getElementById("profileAvatar");
const profileNameBanner = document.getElementById("profileNameBanner");
const profileRankBanner = document.getElementById("profileRankBanner");
const profileLevelLabel = document.getElementById("profileLevelLabel");
const profileLevelFill = document.getElementById("profileLevelFill");
const profileXPLabel = document.getElementById("profileXPLabel");

// Navigation / screens
const navButtons = document.querySelectorAll(".nav-btn");
const screens = document.querySelectorAll(".inner-screen");

// Games
const gameListEl = document.getElementById("gameList");
const gameSearch = document.getElementById("gameSearch");
const gamesSourceBtns = document.querySelectorAll(".games-source-btn");
const gamesCategoriesEl = document.getElementById("gamesCategories");
const gamesSort = document.getElementById("gamesSort");
const filterTwoPlayer = document.getElementById("filterTwoPlayer");
const filterEasy = document.getElementById("filterEasy");
const filterChromebook = document.getElementById("filterChromebook");

// Game overlay
const gameOverlay = document.getElementById("gameOverlay");
const gameFrame = document.getElementById("gameFrame");
const gameTitleEl = document.getElementById("gameTitle");
const gameBackBtn = document.getElementById("gameBackBtn");
const gameFullscreenBtn = document.getElementById("gameFullscreenBtn");

// Achievements
const achievementsListEl = document.getElementById("achievementsList");

// Leaderboard
const lbLocalBtn = document.getElementById("lbLocalBtn");
const lbGlobalBtn = document.getElementById("lbGlobalBtn");
const lbMetric = document.getElementById("lbMetric");
const lbRange = document.getElementById("lbRange");
const leaderboardList = document.getElementById("leaderboardList");
const leaderboardHint = document.getElementById("leaderboardHint");

// Profile big
const profileAvatarBig = document.getElementById("profileAvatarBig");
const profileNameBig = document.getElementById("profileNameBig");
const profileRankBig = document.getElementById("profileRankBig");
const profileLevelLabelBig = document.getElementById("profileLevelLabelBig");
const profileLevelFillBig = document.getElementById("profileLevelFillBig");
const profileXPLabelBig = document.getElementById("profileXPLabelBig");
const profileTitle = document.getElementById("profileTitle");
const profileCoins = document.getElementById("profileCoins");
const profileGames = document.getElementById("profileGames");
const profileAch = document.getElementById("profileAch");
const profileStreak = document.getElementById("profileStreak");
const profileMessages = document.getElementById("profileMessages");
const profileFavorite = document.getElementById("profileFavorite");
const activityList = document.getElementById("activityList");

// Settings
const themeSelect = document.getElementById("themeSelect");
const animSelect = document.getElementById("animSelect");
const clearDataBtn = document.getElementById("clearDataBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Chat
const chatModeLabel = document.getElementById("chatModeLabel");
const chatMessagesEl = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatChannelSelect = document.getElementById("chatChannelSelect");
const onlineCount = document.getElementById("onlineCount");

// ---- Data state ----
let users = [];
let currentUser = null;
let settings = {
  theme: "red",
  animations: "full"
};
let activities = []; // recent activity feed
let currentSource = "internal"; // internal / external
let currentCategory = "all";

// Firebase hooks (optional)
let firebaseEnabled = false;
let db = null;
let globalChatUnsub = null;
let globalLbUnsub = null;

// for v9 helpers if you decide to wire them this way later
let fsHelpers = null;

// Achievements definition
const achievementsDef = [
  { id: "login_once", title: "Welcome In", desc: "Logged into the hub once.", rarity: "common" },
  { id: "login_5", title: "Regular", desc: "Logged in 5 different days.", rarity: "common" },
  { id: "play_1", title: "First Game", desc: "Played your first game.", rarity: "common" },
  { id: "play_10", title: "Warming Up", desc: "Played 10 games.", rarity: "rare" },
  { id: "coins_100", title: "Coin Collector", desc: "Reach 100 coins.", rarity: "common" },
  { id: "coins_1000", title: "Rich", desc: "Reach 1000 coins.", rarity: "epic" },
  { id: "chat_10", title: "Chatter", desc: "Send 10 messages.", rarity: "common" },
  { id: "streak_3", title: "3-Day Streak", desc: "Log in 3 days in a row.", rarity: "rare" },
  { id: "streak_7", title: "Week Warrior", desc: "7-day login streak.", rarity: "epic" }
    { id: "play_50", title: "Dedicated Player", desc: "Played 50 games.", rarity: "rare" },
    { id: "play_100", title: "Century Club", desc: "Played 100 games.", rarity: "epic" },
        { id: "play_200", title: "Game Master", desc: "Played 200 games.", rarity: "legendary" },
            { id: "coins_500", title: "Coin Enthusiast", desc: "Reach 500 coins.", rarity: "rare" },
                { id: "coins_5000", title: "Millionaire", desc: "Reach 5000 coins.", rarity: "legendary" },
                    { id: "chat_50", title: "Social Butterfly", desc: "Send 50 messages.", rarity: "rare" },
                        { id: "chat_100", title: "Chat Legend", desc: "Send 100 messages.", rarity: "epic" },
                            { id: "streak_14", title: "Two Week Warrior", desc: "14-day login streak.", rarity: "legendary" },
                                { id: "streak_30", title: "Monthly Master", desc: "30-day login streak.", rarity: "legendary" },
                                    { id: "level_5", title: "Rising Star", desc: "Reach level 5.", rarity: "common" },
                                        { id: "level_10", title: "Veteran", desc: "Reach level 10.", rarity: "rare" },
                                            { id: "level_20", title: "Elite Player", desc: "Reach level 20.", rarity: "epic" },
                                                { id: "all_categories", title: "Variety Seeker", desc: "Play games from all 5 categories.", rarity: "rare" },
                                                    { id: "night_owl", title: "Night Owl", desc: "Play a game after midnight.", rarity: "rare" },
                                                        { id: "early_bird", title: "Early Bird", desc: "Play a game before 6 AM.", rarity: "rare" }
];

// Internal games: 300 stub entries
const internalGames = [];

// Internal games - 100+ HTML5 games
internalGames.push(
  // Puzzle Games
  { id: "2048", name: "2048", desc: "Combine numbered tiles to reach 2048", category: "Puzzle", tags: ["puzzle", "numbers"], link: "/internal-games/2048/index.html", available: true, twoPlayer: false, easy: false },
  { id: "sudoku", name: "Sudoku", desc: "Classic number puzzle game", category: "Puzzle", tags: ["puzzle", "logic"], link: "/internal-games/sudoku/index.html", available: true, twoPlayer: false, easy: true },
  { id: "mahjong", name: "MahJong", desc: "Match tiles to clear the board", category: "Puzzle", tags: ["puzzle", "matching"], link: "/internal-games/mahjong/index.html", available: true, twoPlayer: false, easy: true },
  { id: "tetris", name: "Tetris Classic", desc: "Stack falling blocks", category: "Puzzle", tags: ["puzzle", "arcade"], link: "/internal-games/tetris/index.html", available: true, twoPlayer: false, easy: false },
  { id: "jewels", name: "Jewel Quest", desc: "Match 3 colorful jewels", category: "Puzzle", tags: ["puzzle", "matching"], link: "/internal-games/jewels/index.html", available: true, twoPlayer: false, easy: true },
  { id: "crossword", name: "Crossword Puzzle", desc: "Solve word puzzles", category: "Puzzle", tags: ["puzzle", "words"], link: "/internal-games/crossword/index.html", available: true, twoPlayer: false, easy: true },
  { id: "wordsearch", name: "Word Search", desc: "Find hidden words", category: "Puzzle", tags: ["puzzle", "words"], link: "/internal-games/word-search/index.html", available: true, twoPlayer: false, easy: true },
  { id: "solitaire", name: "Solitaire", desc: "Classic card game", category: "Puzzle", tags: ["puzzle", "cards"], link: "/internal-games/solitaire/index.html", available: true, twoPlayer: false, easy: true },
  { id: "minesweeper", name: "Minesweeper", desc: "Clear the minefield", category: "Puzzle", tags: ["puzzle", "logic"], link: "/internal-games/minesweeper/index.html", available: true, twoPlayer: false, easy: false },
  { id: "rubik", name: "Rubik's Cube", desc: "Solve the 3D puzzle", category: "Puzzle", tags: ["puzzle", "3d"], link: "/internal-games/rubik/index.html", available: true, twoPlayer: false, easy: false }
);

// Action Games
internalGames.push(
  { id: "zombieshooter", name: "Zombie Shooter", desc: "Survive the zombie apocalypse", category: "Action", tags: ["action", "shooting"], link: "/internal-games/zombie-shooter/index.html", available: true, twoPlayer: false, easy: false },
  { id: "platformer", name: "Platform Adventure", desc: "Jump and run through levels", category: "Action", tags: ["action", "platformer"], link: "/internal-games/platformer/index.html", available: true, twoPlayer: false, easy: true },
  { id: "spaceinvaders", name: "Space Invaders", desc: "Defend Earth from aliens", category: "Action", tags: ["action", "shooting", "arcade"], link: "/internal-games/space-invaders/index.html", available: true, twoPlayer: false, easy: true },
  { id: "megaman", name: "Mega Runner", desc: "Fast-paced runner game", category: "Action", tags: ["action", "runner"], link: "/internal-games/mega-runner/index.html", available: true, twoPlayer: false, easy: true },
  { id: "ninjafruit", name: "Ninja Fruit Slice", desc: "Slice flying fruits", category: "Action", tags: ["action", "arcade"], link: "/internal-games/ninja-fruit/index.html", available: true, twoPlayer: false, easy: true },
  { id: "asteroids", name: "Asteroids", desc: "Destroy space rocks", category: "Action", tags: ["action", "shooting", "arcade"], link: "/internal-games/asteroids/index.html", available: true, twoPlayer: false, easy: false },
  { id: "pacman", name: "Pac-Man", desc: "Eat dots and avoid ghosts", category: "Action", tags: ["action", "arcade"], link: "/internal-games/pacman/index.html", available: true, twoPlayer: false, easy: true },
  { id: "galaga", name: "Galaga", desc: "Classic space shooter", category: "Action", tags: ["action", "shooting", "arcade"], link: "/internal-games/galaga/index.html", available: true, twoPlayer: false, easy: false },
  { id: "contra", name: "Contra Run", desc: "Side-scrolling shooter", category: "Action", tags: ["action", "shooting"], link: "/internal-games/contra/index.html", available: true, twoPlayer: false, easy: false },
  { id: "robotfighter", name: "Robot Fighter", desc: "Fight through robot enemies", category: "Action", tags: ["action", "fighting"], link: "/internal-games/robot-fighter/index.html", available: true, twoPlayer: true, easy: false }
);

// Racing Games
internalGames.push(
  { id: "racingl", name: "Street Racer", desc: "Race through city streets", category: "Racing", tags: ["racing", "cars"], link: "/internal-games/street-racer/index.html", available: true, twoPlayer: false, easy: true },
  { id: "racing2", name: "Moto GP", desc: "Motorcycle racing game", category: "Racing", tags: ["racing", "motorcycle"], link: "/internal-games/moto-gp/index.html", available: true, twoPlayer: false, easy: true },
  { id: "racing3", name: "F1 Racing", desc: "Formula 1 racing simulator", category: "Racing", tags: ["racing", "simulation"], link: "/internal-games/f1-racing/index.html", available: true, twoPlayer: false, easy: false },
  { id: "racing4", name: "Drift King", desc: "Master the art of drifting", category: "Racing", tags: ["racing", "drifting"], link: "/internal-games/drift-king/index.html", available: true, twoPlayer: false, easy: false },
  { id: "racing5", name: "Kart Racing", desc: "Go-kart racing fun", category: "Racing", tags: ["racing", "karts"], link: "/internal-games/kart-racing/index.html", available: true, twoPlayer: true, easy: true },
  { id: "racing6", name: "Hill Climb", desc: "Drive up challenging hills", category: "Racing", tags: ["racing", "physics"], link: "/internal-games/hill-climb/index.html", available: true, twoPlayer: false, easy: true },
  { id: "racing7", name: "Monster Truck", desc: "Crush obstacles with huge trucks", category: "Racing", tags: ["racing", "trucks"], link: "/internal-games/monster-truck/index.html", available: true, twoPlayer: false, easy: true },
  { id: "racing8", name: "Beach Buggy", desc: "Race on sandy beaches", category: "Racing", tags: ["racing", "beach"], link: "/internal-games/beach-buggy/index.html", available: true, twoPlayer: false, easy: true },
  { id: "racing9", name: "Space Race", desc: "Futuristic space racing", category: "Racing", tags: ["racing", "scifi"], link: "/internal-games/space-race/index.html", available: true, twoPlayer: false, easy: false },
  { id: "racing10", name: "Bike Stunt", desc: "Perform amazing bike stunts", category: "Racing", tags: ["racing", "stunts"], link: "/internal-games/bike-stunt/index.html", available: true, twoPlayer: false, easy: false }
);

// Sports Games
internalGames.push(
  { id: "soccer1", name: "Soccer Pro", desc: "Score amazing goals", category: "Sports", tags: ["sports", "soccer"], link: "/internal-games/soccer-pro/index.html", available: true, twoPlayer: false, easy: true },
  { id: "basketball1", name: "Basketball Stars", desc: "Shoot hoops and win", category: "Sports", tags: ["sports", "basketball"], link: "/internal-games/basketball-stars/index.html", available: true, twoPlayer: true, easy: true },
  { id: "tennis1", name: "Tennis Champion", desc: "Win the tennis tournament", category: "Sports", tags: ["sports", "tennis"], link: "/internal-games/tennis-champion/index.html", available: true, twoPlayer: true, easy: true },
  { id: "golf1", name: "Mini Golf", desc: "Putt through creative courses", category: "Sports", tags: ["sports", "golf"], link: "/internal-games/mini-golf/index.html", available: true, twoPlayer: false, easy: true },
  { id: "bowling1", name: "Strike Bowling", desc: "Bowl for perfect strikes", category: "Sports", tags: ["sports", "bowling"], link: "/internal-games/strike-bowling/index.html", available: true, twoPlayer: false, easy: true },
  { id: "baseball1", name: "Home Run Hero", desc: "Hit massive home runs", category: "Sports", tags: ["sports", "baseball"], link: "/internal-games/home-run-hero/index.html", available: true, twoPlayer: false, easy: true },
  { id: "hockey1", name: "Ice Hockey", desc: "Fast-paced hockey action", category: "Sports", tags: ["sports", "hockey"], link: "/internal-games/ice-hockey/index.html", available: true, twoPlayer: true, easy: false },
  { id: "volleyball1", name: "Beach Volleyball", desc: "Play volleyball on the beach", category: "Sports", tags: ["sports", "volleyball"], link: "/internal-games/beach-volleyball/index.html", available: true, twoPlayer: true, easy: true },
  { id: "boxing1", name: "Punch Out", desc: "Boxing championship game", category: "Sports", tags: ["sports", "boxing"], link: "/internal-games/punch-out/index.html", available: true, twoPlayer: false, easy: false },
  { id: "skateboard1", name: "Skate Pro", desc: "Perform awesome skateboard tricks", category: "Sports", tags: ["sports", "skateboarding"], link: "/internal-games/skate-pro/index.html", available: true, twoPlayer: false, easy: false }
);

// Strategy Games
internalGames.push(
  { id: "tower1", name: "Tower Defense Pro", desc: "Build towers to defend", category: "Strategy", tags: ["strategy", "tower"], link: "/internal-games/tower-defense/index.html", available: true, twoPlayer: false, easy: false },
  { id: "chess1", name: "Chess Master", desc: "Classic chess game", category: "Strategy", tags: ["strategy", "board"], link: "/internal-games/chess-master/index.html", available: true, twoPlayer: true, easy: false },
  { id: "checkers1", name: "Checkers", desc: "Jump and capture pieces", category: "Strategy", tags: ["strategy", "board"], link: "/internal-games/checkers/index.html", available: true, twoPlayer: true, easy: true },
  { id: "risk1", name: "World Conquest", desc: "Conquer the world", category: "Strategy", tags: ["strategy", "war"], link: "/internal-games/world-conquest/index.html", available: true, twoPlayer: false, easy: false },
  { id: "citybuilder1", name: "City Builder", desc: "Build your dream city", category: "Strategy", tags: ["strategy", "simulation"], link: "/internal-games/city-builder/index.html", available: true, twoPlayer: false, easy: true },
  { id: "farm1", name: "Farm Manager", desc: "Manage your own farm", category: "Strategy", tags: ["strategy", "farming"], link: "/internal-games/farm-manager/index.html", available: true, twoPlayer: false, easy: true },
  { id: "castle1", name: "Castle Defense", desc: "Defend your castle", category: "Strategy", tags: ["strategy", "defense"], link: "/internal-games/castle-defense/index.html", available: true, twoPlayer: false, easy: false },
  { id: "battle1", name: "Battle Commander", desc: "Lead armies to victory", category: "Strategy", tags: ["strategy", "war"], link: "/internal-games/battle-commander/index.html", available: true, twoPlayer: false, easy: false },
  { id: "empire1", name: "Empire Builder", desc: "Build a vast empire", category: "Strategy", tags: ["strategy", "empire"], link: "/internal-games/empire-builder/index.html", available: true, twoPlayer: false, easy: false },
  { id: "merchant1", name: "Trade Master", desc: "Trading simulation game", category: "Strategy", tags: ["strategy", "trading"], link: "/internal-games/trade-master/index.html", available: true, twoPlayer: false, easy: true }
);

// Arcade Classics
internalGames.push(
  { id: "donkeykong1", name: "Donkey Kong", desc: "Classic arcade platformer", category: "Arcade", tags: ["arcade", "classic"], link: "/internal-games/donkey-kong/index.html", available: true, twoPlayer: false, easy: true },
  { id: "frogger1", name: "Frogger", desc: "Cross the road safely", category: "Arcade", tags: ["arcade", "classic"], link: "/internal-games/frogger/index.html", available: true, twoPlayer: false, easy: true },
  { id: "breakout1", name: "Breakout", desc: "Break all the bricks", category: "Arcade", tags: ["arcade", "classic"], link: "/internal-games/breakout/index.html", available: true, twoPlayer: false, easy: true },
  { id: "pong1", name: "Pong Classic", desc: "First video game ever", category: "Arcade", tags: ["arcade", "classic"], link: "/internal-games/pong/index.html", available: true, twoPlayer: true, easy: true },
  { id: "snake1", name: "Snake Game", desc: "Eat and grow longer", category: "Arcade", tags: ["arcade", "classic"], link: "/internal-games/snake/index.html", available: true, twoPlayer: false, easy: true },
  { id: "missile1", name: "Missile Command", desc: "Defend cities from missiles", category: "Arcade", tags: ["arcade", "defense"], link: "/internal-games/missile-command/index.html", available: true, twoPlayer: false, easy: false },
  { id: "centipede1", name: "Centipede", desc: "Shoot the centipede", category: "Arcade", tags: ["arcade", "shooting"], link: "/internal-games/centipede/index.html", available: true, twoPlayer: false, easy: true },
  { id: "digdug1", name: "Dig Dug", desc: "Dig and defeat enemies", category: "Arcade", tags: ["arcade", "classic"], link: "/internal-games/dig-dug/index.html", available: true, twoPlayer: false, easy: true },
  { id: "qbert1", name: "Q*bert", desc: "Jump on cubes", category: "Arcade", tags: ["arcade", "classic"], link: "/internal-games/qbert/index.html", available: true, twoPlayer: false, easy: true },
  { id: "joust1", name: "Joust", desc: "Flying bird combat", category: "Arcade", tags: ["arcade", "classic"], link: "/internal-games/joust/index.html", available: true, twoPlayer: true, easy: false }
);

// Casual Games
internalGames.push(
  { id: "bubbleshoot1", name: "Bubble Shooter", desc: "Pop colorful bubbles", category: "Casual", tags: ["casual", "bubbles"], link: "/internal-games/bubble-shooter/index.html", available: true, twoPlayer: false, easy: true },
  { id: "candycrush1", name: "Candy Match", desc: "Match sweet candies", category: "Casual", tags: ["casual", "matching"], link: "/internal-games/candy-match/index.html", available: true, twoPlayer: false, easy: true },
  { id: "cut1", name: "Cut the Rope", desc: "Feed the monster candy", category: "Casual", tags: ["casual", "puzzle"], link: "/internal-games/cut-rope/index.html", available: true, twoPlayer: false, easy: true },
  { id: "angry1", name: "Angry Birds Clone", desc: "Launch birds at pigs", category: "Casual", tags: ["casual", "physics"], link: "/internal-games/angry-birds/index.html", available: true, twoPlayer: false, easy: true },
  { id: "fruit1", name: "Fruit Ninja", desc: "Slice flying fruits", category: "Casual", tags: ["casual", "action"], link: "/internal-games/fruit-ninja/index.html", available: true, twoPlayer: false, easy: true },
  { id: "stack1", name: "Stack Tower", desc: "Stack blocks high", category: "Casual", tags: ["casual", "stacking"], link: "/internal-games/stack-tower/index.html", available: true, twoPlayer: false, easy: true },
  { id: "color1", name: "Color Switch", desc: "Match colors perfectly", category: "Casual", tags: ["casual", "reflex"], link: "/internal-games/color-switch/index.html", available: true, twoPlayer: false, easy: false },
  { id: "piano1", name: "Piano Tiles", desc: "Tap the black tiles", category: "Casual", tags: ["casual", "music"], link: "/internal-games/piano-tiles/index.html", available: true, twoPlayer: false, easy: true },
  { id: "flappy1", name: "Flappy Bird", desc: "Fly through pipes", category: "Casual", tags: ["casual", "flying"], link: "/internal-games/flappy-bird/index.html", available: true, twoPlayer: false, easy: false },
  { id: "doodle1", name: "Doodle Jump", desc: "Jump endlessly upward", category: "Casual", tags: ["casual", "jumping"], link: "/internal-games/doodle-jump/index.html", available: true, twoPlayer: false, easy: true }
);

// Adventure & RPG
internalGames.push(
  { id: "zelda1", name: "Legend Quest", desc: "Epic adventure game", category: "Adventure", tags: ["adventure", "rpg"], link: "/internal-games/legend-quest/index.html", available: true, twoPlayer: false, easy: false },
  { id: "mario1", name: "Super Plumber", desc: "Classic platformer adventure", category: "Adventure", tags: ["adventure", "platformer"], link: "/internal-games/super-plumber/index.html", available: true, twoPlayer: false, easy: true },
  { id: "metroid1", name: "Space Explorer", desc: "Explore alien planets", category: "Adventure", tags: ["adventure", "exploration"], link: "/internal-games/space-explorer/index.html", available: true, twoPlayer: false, easy: false },
  { id: "castlevania1", name: "Castle Adventure", desc: "Fight through haunted castle", category: "Adventure", tags: ["adventure", "action"], link: "/internal-games/castle-adventure/index.html", available: true, twoPlayer: false, easy: false },
  { id: "sonic1", name: "Fast Hedgehog", desc: "Run at super speed", category: "Adventure", tags: ["adventure", "speed"], link: "/internal-games/fast-hedgehog/index.html", available: true, twoPlayer: false, easy: true },
  { id: "rpg1", name: "Fantasy Quest RPG", desc: "Turn-based RPG adventure", category: "Other", tags: ["rpg", "turnbased"], link: "/internal-games/fantasy-quest/index.html", available: true, twoPlayer: false, easy: false },
  { id: "dungeon1", name: "Dungeon Crawler", desc: "Explore dark dungeons", category: "Adventure", tags: ["adventure", "dungeon"], link: "/internal-games/dungeon-crawler/index.html", available: true, twoPlayer: false, easy: false },
  { id: "pokemon1", name: "Monster Collector", desc: "Collect and battle monsters", category: "Other", tags: ["rpg", "collecting"], link: "/internal-games/monster-collector/index.html", available: true, twoPlayer: false, easy: true },
  { id: "dragon1", name: "Dragon Slayer", desc: "Defeat legendary dragons", category: "Adventure", tags: ["adventure", "fantasy"], link: "/internal-games/dragon-slayer/index.html", available: true, twoPlayer: false, easy: false },
  { id: "pirate1", name: "Pirate Treasure Hunt", desc: "Search for hidden treasure", category: "Adventure", tags: ["adventure", "exploration"], link: "/internal-games/pirate-treasure/index.html", available: true, twoPlayer: false, easy: true }
);

// Fighting & Beat 'em Up
internalGames.push(
  { id: "fighter1", name: "Street Fighter", desc: "Classic fighting game", category: "Action", tags: ["fighting", "arcade"], link: "/internal-games/street-fighter/index.html", available: true, twoPlayer: true, easy: false },
  { id: "mortal1", name: "Mortal Battle", desc: "Brutal fighting combat", category: "Action", tags: ["fighting", "combat"], link: "/internal-games/mortal-battle/index.html", available: true, twoPlayer: true, easy: false },
  { id: "tekken1", name: "Fight Champion", desc: "3D fighting tournament", category: "Action", tags: ["fighting", "3d"], link: "/internal-games/fight-champion/index.html", available: true, twoPlayer: true, easy: false },
  { id: "ninja1", name: "Ninja Warrior", desc: "Fast ninja combat", category: "Action", tags: ["fighting", "ninja"], link: "/internal-games/ninja-warrior/index.html", available: true, twoPlayer: false, easy: false },
  { id: "brawl1", name: "Brawl Stars", desc: "Multiplayer brawling", category: "Action", tags: ["fighting", "brawling"], link: "/internal-games/brawl-stars/index.html", available: true, twoPlayer: true, easy: true },
  { id: "smash1", name: "Smash Brothers", desc: "Platform fighting game", category: "Action", tags: ["fighting", "platformer"], link: "/internal-games/smash-bros/index.html", available: true, twoPlayer: true, easy: true },
  { id: "kung1", name: "Kung Fu Master", desc: "Martial arts fighting", category: "Action", tags: ["fighting", "martialarts"], link: "/internal-games/kung-fu/index.html", available: true, twoPlayer: false, easy: true },
  { id: "tmnt1", name: "Turtle Brawlers", desc: "Beat 'em up action", category: "Action", tags: ["fighting", "beatem up"], link: "/internal-games/turtle-brawlers/index.html", available: true, twoPlayer: true, easy: true },
  { id: "dbz1", name: "Dragon Ball Fighter", desc: "Anime fighting game", category: "Action", tags: ["fighting", "anime"], link: "/internal-games/dragon-ball-fighter/index.html", available: true, twoPlayer: true, easy: false },
  { id: "naruto1", name: "Ninja Battle", desc: "Ninja anime fighter", category: "Action", tags: ["fighting", "ninja"], link: "/internal-games/ninja-battle/index.html", available: true, twoPlayer: true, easy: false }
);

// Simulation & Idle Games
internalGames.push(
  { id: "tycoon1", name: "Business Tycoon", desc: "Build a business empire", category: "Other", tags: ["simulation", "tycoon"], link: "/internal-games/business-tycoon/index.html", available: true, twoPlayer: false, easy: true },
  { id: "simcity1", name: "City Sim", desc: "Build and manage a city", category: "Strategy", tags: ["simulation", "city"], link: "/internal-games/city-sim/index.html", available: true, twoPlayer: false, easy: true },
  { id: "roller1", name: "Roller Coaster Builder", desc: "Design thrilling rides", category: "Other", tags: ["simulation", "building"], link: "/internal-games/roller-coaster/index.html", available: true, twoPlayer: false, easy: true },
  { id: "cooking1", name: "Cooking Dash", desc: "Manage a restaurant", category: "Other", tags: ["simulation", "cooking"], link: "/internal-games/cooking-dash/index.html", available: true, twoPlayer: false, easy: true },
  { id: "hospital1", name: "Hospital Manager", desc: "Run a hospital", category: "Other", tags: ["simulation", "management"], link: "/internal-games/hospital-manager/index.html", available: true, twoPlayer: false, easy: false },
  { id: "plane1", name: "Flight Simulator", desc: "Fly realistic planes", category: "Other", tags: ["simulation", "flying"], link: "/internal-games/flight-sim/index.html", available: true, twoPlayer: false, easy: false },
  { id: "train1", name: "Train Conductor", desc: "Manage train routes", category: "Other", tags: ["simulation", "trains"], link: "/internal-games/train-conductor/index.html", available: true, twoPlayer: false, easy: true },
  { id: "zoo1", name: "Zoo Tycoon", desc: "Create your dream zoo", category: "Other", tags: ["simulation", "animals"], link: "/internal-games/zoo-tycoon/index.html", available: true, twoPlayer: false, easy: true },
  { id: "idle1", name: "Cookie Clicker", desc: "Click to make cookies", category: "Other", tags: ["idle", "clicker"], link: "/internal-games/cookie-clicker/index.html", available: true, twoPlayer: false, easy: true },
  { id: "idle2", name: "Adventure Capitalist", desc: "Idle money maker", category: "Other", tags: ["idle", "clicker"], link: "/internal-games/adventure-capitalist/index.html", available: true, twoPlayer: false, easy: true },
  { id: "idle3", name: "Clicker Heroes", desc: "Click to defeat monsters", category: "Other", tags: ["idle", "rpg"], link: "/internal-games/clicker-heroes/index.html", available: true, twoPlayer: false, easy: true },
  { id: "card1", name: "Solitaire Spider", desc: "Spider solitaire variant", category: "Puzzle", tags: ["cards", "solitaire"], link: "/internal-games/spider-solitaire/index.html", available: true, twoPlayer: false, easy: true },
  { id: "card2", name: "Poker Pro", desc: "Texas Hold'em poker", category: "Other", tags: ["cards", "poker"], link: "/internal-games/poker-pro/index.html", available: true, twoPlayer: true, easy: false },
  { id: "card3", name: "Blackjack 21", desc: "Classic blackjack game", category: "Other", tags: ["cards", "casino"], link: "/internal-games/blackjack/index.html", available: true, twoPlayer: false, easy: true },
  { id: "card4", name: "Uno Cards", desc: "Colorful card matching", category: "Other", tags: ["cards", "multiplayer"], link: "/internal-games/uno/index.html", available: true, twoPlayer: true, easy: true }
);
// External games
const externalGames = [
  {
    id: "krunker",
    name: "Krunker",
    desc: "Fast-paced FPS.",
    category: "FPS",
    tags: ["fps", "online"],
    link: "https://krunker.io",
    twoPlayer: false,
    easy: false,
    chromebookSafe: true,
    plays: 0
  },
  {
    id: "1v1lol",
    name: "1v1.lol",
    desc: "Build & fight duels.",
    category: "Battle Royale",
    tags: ["build", "pvp"],
    link: "https://1v1.lol",
    twoPlayer: true,
    easy: false,
    chromebookSafe: true,
    plays: 0
  },
  {
    id: "shellshock",
    name: "Shell Shockers",
    desc: "Egg FPS online.",
    category: "FPS",
    tags: ["fps", "eggs"],
    link: "https://shellshock.io",
    twoPlayer: false,
    easy: false,
    chromebookSafe: true,
    plays: 0
  },
  {
    id: "surviv",
    name: "Surviv.io",
    desc: "2D battle royale.",
    category: "Battle Royale",
    tags: ["2d", "br"],
    link: "https://surviv.io",
    twoPlayer: false,
    easy: true,
    chromebookSafe: true,
    plays: 0
  },
    {
          id: "agario",
          name: "Agar.io",
          desc: "Eat to grow bigger.",
          category: "Arcade",
          tags: ["multiplayer", "casual"],
          link: "https://agar.io",
          twoPlayer: false,
          easy: true,
          chromebookSafe: true,
          plays: 0
              },
    {
          id: "slitherio",
          name: "Slither.io",
          desc: "Snake battle royale.",
          category: "Arcade",
          tags: ["multiplayer", "snake"],
          link: "https://slither.io",
          twoPlayer: false,
          easy: true,
          chromebookSafe: true,
          plays: 0
              },
    {
          id: "slope",
          name: "Slope",
          desc: "Fast-paced rolling ball.",
          category: "Racing",
          tags: ["3d", "speed"],
          link: "https://slope-game.github.io/rungame/slope/index.html",
          twoPlayer: false,
          easy: false,
          chromebookSafe: true,
          plays: 0
              },
    { id: "run3", name: "Run 3", desc: "Endless space runner.", category: "Puzzle", tags: ["3d", "runner"], link: "https://run3.io", twoPlayer: false, easy: true, chromebookSafe: true, plays: 0 },
    { id: "tetris", name: "Tetris", desc: "Classic block stacking.", category: "Puzzle", tags: ["classic", "puzzle"], link: "https://tetris.com/play-tetris", twoPlayer: false, easy: true, chromebookSafe: true, plays: 0 }
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

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) settings = JSON.parse(raw);
  } catch (e) {
    settings = { theme: "red", animations: "full" };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadActivities() {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (raw) activities = JSON.parse(raw);
  } catch (e) {
    activities = [];
  }
}

function saveActivities() {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities.slice(-30)));
}

function addActivity(text) {
  const item = { text, ts: Date.now() };
  activities.push(item);
  saveActivities();
  renderActivity();
}

function findUser(name) {
  return users.find(u => u.username.toLowerCase() === name.toLowerCase());
}

function setCurrentUser(u) {
  currentUser = u;
  if (u) localStorage.setItem(CURRENT_KEY, u.username);
  else localStorage.removeItem(CURRENT_KEY);
}

// ---- XP / Level / Rank / Titles ----
function getLevelFromXP(xp) {
  let level = 1;
  let needed = 100;
  let remainingXP = xp;

  while (remainingXP >= needed) {
    remainingXP -= needed;
    level++;
    needed = Math.round(needed * 1.2);
  }
  return { level, currentXP: remainingXP, needed };
}

function getRankFromStats(user) {
  const xp = user.xp || 0;
  const games = user.gamesPlayed || 0;
  const coins = user.coins || 0;

  if (xp > 5000 || coins > 5000) return "NotChris Certified";
  if (xp > 2000 || games > 200) return "Legend";
  if (xp > 1000 || games > 100) return "Elite";
  if (xp > 500 || games > 50) return "Gamer";
  if (xp > 200 || games > 20) return "Tryhard";
  if (xp > 50 || games > 5) return "Casual Gamer";
  return "New Player";
}

function getTitleFromStats(user) {
  const streak = user.streak || 0;
  const games = user.gamesPlayed || 0;
  const messages = user.messagesSent || 0;

  if (streak >= 7) return "Week Warrior";
  if (messages >= 100) return "Chatty";
  if (games >= 100) return "Grinder";
  if (games >= 30) return "Warmup Complete";
  return "Rookie";
}

// ---- Optional Firebase init (v8 or v9 helpers) ----
function initFirebaseIfConfigured() {
  try {
    // v8 style via window.firebase + window.NOTCHRIS_FIREBASE_CONFIG
    if (window.firebase && window.NOTCHRIS_FIREBASE_CONFIG) {
      firebase.initializeApp(window.NOTCHRIS_FIREBASE_CONFIG);
      db = firebase.firestore();
      firebaseEnabled = true;
      chatModeLabel.textContent = "Global chat (Firebase)";
if (leaderboardHint)       leaderboardHint.textContent = "Global leaderboard via Firebase. Local is still used as backup.";
      setupGlobalChatListener();
      setupGlobalLeaderboardListener();
      return;
    }

    // v9 style (if you ever wire helpers like window.notchrisDB + window.notchrisFirestore)
    if (window.notchrisDB && window.NOTCHRIS_BACKEND_ENABLED && window.notchrisFirestore) {
      db = window.notchrisDB;
      fsHelpers = window.notchrisFirestore;
      firebaseEnabled = true;
      chatModeLabel.textContent = "Global chat (Firebase)";
      if (leaderboardHint) leaderboardHint.textContent = "Global leaderboard via Firebase. Local is still used as backup.";
      setupGlobalChatListener();
      setupGlobalLeaderboardListener();
      return;
    }

    // Otherwise local-only
    firebaseEnabled = false;
    chatModeLabel.textContent = "Local demo chat";
    if (leaderboardHint) leaderboardHint.textContent = "Local leaderboard (device-only). Add Firebase config for global.";
  } catch (e) {
    console.error("Firebase init error", e);
    firebaseEnabled = false;
  }
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
    u = {
      username: name,
      pin,
      coins: 0,
      gamesPlayed: 0,
      achievementsUnlocked: 0,
      earnedAchievements: [],
      xp: 0,
      lastLoginDay: null,
      streak: 0,
      lastGameId: null,
      messagesSent: 0,
      favoriteGameId: null,
      createdAt: Date.now()
    };
    users.push(u);
    saveUsers();
  } else {
    if (u.pin !== pin) {
      alert("Wrong PIN for this username.");
      return;
    }
  }

  setCurrentUser(u);
  addActivity(`Logged in as ${u.username}.`);
  enterApp();
});

logoutBtn.addEventListener("click", () => {
  if (!confirm("Log out and end this session on this device?")) return;
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

// ---- Games helpers ----
function getCurrentGames() {
  return currentSource === "internal" ? internalGames : externalGames;
}

function buildCategories() {
  const games = getCurrentGames();
  const cats = new Set();
  games.forEach(g => cats.add(g.category || "Other"));

  gamesCategoriesEl.innerHTML = "";

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
  const sort = gamesSort.value;

  let list = games
    .filter(g => g.name.toLowerCase().includes(term))
    .filter(g => currentCategory === "all" || g.category === currentCategory)
    .filter(g => !filterTwoPlayer.checked || g.twoPlayer)
    .filter(g => !filterEasy.checked || g.easy)
    .filter(g => !filterChromebook.checked || g.chromebookSafe);

  if (sort === "az") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "new") {
    list.sort((a, b) => (b.addedOrder || 0) - (a.addedOrder || 0));
  } else if (sort === "unplayed" && currentUser) {
    list.sort((a, b) => {
      const aPlayed = (currentUser.gamesPlayedMap || {})[a.id] || 0;
      const bPlayed = (currentUser.gamesPlayedMap || {})[b.id] || 0;
      return aPlayed - bPlayed;
    });
  } else {
    list.sort((a, b) => (b.plays || 0) - (a.plays || 0));
  }

  gameListEl.innerHTML = "";

  list.forEach(game => {
    const row = document.createElement("div");
    row.className = "game-item";

    const playable = (currentSource === "external") || (currentSource === "internal" && game.available);

    const tags = [...(game.tags || [])];
    if (game.twoPlayer) tags.push("2P");
    if (game.easy) tags.push("Easy");
    if (!game.easy) tags.push("Hard");
    if (game.chromebookSafe) tags.push("School-safe");

    row.innerHTML = `
      <div class="game-info">
        <h4>${game.name}</h4>
        <p>${game.desc}</p>
        <div class="game-meta">
          ${currentSource === "internal" ? "Internal" : "External"} • ${game.category || ""}
          ${!playable && currentSource === "internal" ? " • Unavailable" : ""}
        </div>
        <div class="game-tags">${tags.join(" • ")}</div>
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
      btn.addEventListener("click", () => alert("This game isn't set up yet."));
    }

    gameListEl.appendChild(row);
  });
}

// Search & filters
gameSearch.addEventListener("input", renderGames);
[filterTwoPlayer, filterEasy, filterChromebook].forEach(el => {
  el.addEventListener("change", renderGames);
});
gamesSort.addEventListener("change", renderGames);

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

// Popular / trending / new
function renderHomeGameStrips() {
  const popular = [...internalGames].sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 6);
  const trending = [...internalGames].slice(10, 16);
  const newly = [...internalGames].slice(-6);

  function renderStrip(list, el) {
    el.innerHTML = "";
    list.forEach(g => {
      const pill = document.createElement("div");
      pill.className = "pill";
      pill.textContent = g.name;
      pill.addEventListener("click", () => {
        switchToTab("games");
        gameSearch.value = g.name;
        renderGames();
      });
      el.appendChild(pill);
    });
  }

  renderStrip(popular, popularGamesEl);
  renderStrip(trending, trendingGamesEl);
  renderStrip(newly, newGamesEl);
}

// ---- Game actions ----
function onGamePlayed(game) {
  if (!currentUser) return;

    // Cooldown check: only award coins/XP every 5 minutes per game
    const now = Date.now();
    if (!currentUser.gamePlayTimestamps) currentUser.gamePlayTimestamps = {};
    const lastPlayed = currentUser.gamePlayTimestamps[game.id] || 0;
    const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
    const canEarnRewards = (now - lastPlayed) >= COOLDOWN_TIME;

    // Update timestamp
    currentUser.gamePlayTimestamps[game.id] = now;
  if (!currentUser.gamesPlayedMap) currentUser.gamesPlayedMap = {};
  currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
  currentUser.gamesPlayedMap[game.id] = (currentUser.gamesPlayedMap[game.id] || 0) + 1;
  currentUser.lastGameId = game.id;
  game.plays = (game.plays || 0) + 1;

    // Only award coins/XP if cooldown has passed
    if (canEarnRewards) {
    const baseCoins = currentSource === "internal" ? 5 : 3;
    const baseXP = currentSource === "internal" ? 10 : 7;
    currentUser.coins = (currentUser.coins || 0) + baseCoins;
    currentUser.xp = (currentUser.xp || 0) + baseXP;

        }
  if (!currentUser.favoriteGameId || (currentUser.gamesPlayedMap[game.id] > (currentUser.gamesPlayedMap[currentUser.favoriteGameId] || 0))) {
    currentUser.favoriteGameId = game.id;
  }

  addActivity(`Played ${game.name}.`);
  checkAchievements();
  saveUsers();
  updateUI();
  updateGlobalLeaderboard();
}

function playInternalGame(game) {
  if (!currentUser) return;
  onGamePlayed(game);
  openGameOverlay(game);
}

function playExternalGame(game) {
  if (!currentUser) return;
  onGamePlayed(game);
  window.open(game.link, "_blank");
}

continueBtn.addEventListener("click", () => {
  if (!currentUser || !currentUser.lastGameId) return;
  let game = internalGames.find(g => g.id === currentUser.lastGameId) ||
             externalGames.find(g => g.id === currentUser.lastGameId);
  if (!game) return;
  if (internalGames.includes(game) && game.available) {
    openGameOverlay(game);
  } else if (externalGames.includes(game)) {
    window.open(game.link, "_blank");
  } else {
    alert("Last game not available anymore.");
  }
});

dailyBtn.addEventListener("click", () => {
  if (!currentUser) return;
  if (!currentUser.lastDailyTime) currentUser.lastDailyTime = 0;
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  if (now - currentUser.lastDailyTime < ONE_DAY) {
    alert("You already claimed your daily reward. Try again tomorrow.");
    return;
  }
  currentUser.lastDailyTime = now;
  const rewardCoins = 25;
  const rewardXP = 50;
  currentUser.coins = (currentUser.coins || 0) + rewardCoins;
  currentUser.xp = (currentUser.xp || 0) + rewardXP;
  addActivity(`Claimed daily reward: +${rewardCoins} coins, +${rewardXP} XP.`);
  checkAchievements();
  saveUsers();
  updateUI();
});

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
  else alert("Fullscreen not supported.");
});

// ---- Achievements ----
function checkAchievements() {
  if (!currentUser) return;
  if (!currentUser.earnedAchievements) currentUser.earnedAchievements = [];
  const set = new Set(currentUser.earnedAchievements);
  const days = currentUser.streak || 0;
  const games = currentUser.gamesPlayed || 0;
  const coins = currentUser.coins || 0;
  const msgs = currentUser.messagesSent || 0;

  set.add("login_once");
  if (days >= 5) set.add("login_5");
  if (games >= 1) set.add("play_1");
  if (games >= 10) set.add("play_10");
  if (coins >= 100) set.add("coins_100");
  if (coins >= 1000) set.add("coins_1000");
  if (msgs >= 10) set.add("chat_10");
  if (days >= 3) set.add("streak_3");
  if (days >= 7) set.add("streak_7");

    // Additional game play achievements
    if (games >= 50) set.add("play_50");
    if (games >= 100) set.add("play_100");
    if (games >= 200) set.add("play_200");

    // Additional coin achievements
    if (coins >= 500) set.add("coins_500");
    if (coins >= 5000) set.add("coins_5000");

    // Additional chat achievements
    if (msgs >= 50) set.add("chat_50");
    if (msgs >= 100) set.add("chat_100");

    // Additional streak achievements
    if (days >= 14) set.add("streak_14");
    if (days >= 30) set.add("streak_30");

    // Level achievements
    const level = getLevelFromXP(currentUser.xp || 0).level;
    if (level >= 5) set.add("level_5");
    if (level >= 10) set.add("level_10");
    if (level >= 20) set.add("level_20");

  currentUser.earnedAchievements = Array.from(set);
  currentUser.achievementsUnlocked = currentUser.earnedAchievements.length;
}

function renderAchievements() {
  achievementsListEl.innerHTML = "";
  if (!currentUser) return;
  const earnedSet = new Set(currentUser.earnedAchievements || []);

  achievementsDef.forEach(a => {
    const earned = earnedSet.has(a.id);
    const div = document.createElement("div");
    div.className = "ach";
    const rarity = a.rarity || "common";
    let rarityLabel = rarity;
    if (rarity === "rare") rarityLabel = "Rare";
    if (rarity === "epic") rarityLabel = "Epic";

    div.innerHTML = `
      <div class="ach-header">
        <span>${a.title}</span>
        <span>${rarityLabel}</span>
      </div>
      <div class="ach-desc">${a.desc}</div>
      <div class="ach-earned">${earned ? "✔ Earned" : "• Locked"}</div>
    `;
    achievementsListEl.appendChild(div);
  });
}

// ---- Leaderboard ----
function buildLocalLeaderboard(metric = "xp") {
  const sorted = [...users].sort((a, b) => (b[metric] || 0) - (a[metric] || 0));
  return sorted.slice(0, 20);
}

function renderLeaderboard() {
  const metric = lbMetric.value;
  const modeLocal = lbLocalBtn.classList.contains("active");

  leaderboardList.innerHTML = "";

  if (modeLocal || !firebaseEnabled) {
    const list = buildLocalLeaderboard(metric);
    list.forEach((u, idx) => {
      const li = document.createElement("li");
      const val = u[metric] || 0;
      const youTag = (currentUser && u.username === currentUser.username) ? " (you)" : "";
      li.textContent = `${idx + 1}. ${u.username}${youTag} — ${val}`;
      leaderboardList.appendChild(li);
    });
  } else {
    globalLbCache.forEach((entry, idx) => {
      const li = document.createElement("li");
      const youTag = (currentUser && entry.username === currentUser.username) ? " (you)" : "";
      li.textContent = `${idx + 1}. ${entry.username}${youTag} — ${entry[metric] || 0}`;
      leaderboardList.appendChild(li);
    });
  }
}

lbLocalBtn.addEventListener("click", () => {
  lbLocalBtn.classList.add("active");
  lbGlobalBtn.classList.remove("active");
  renderLeaderboard();
});
lbGlobalBtn.addEventListener("click", () => {
  if (!firebaseEnabled) {
    alert("Global leaderboard needs Firebase config first.");
    return;
  }
  lbGlobalBtn.classList.add("active");
  lbLocalBtn.classList.remove("active");
  renderLeaderboard();
});
lbMetric.addEventListener("change", renderLeaderboard);
lbRange.addEventListener("change", renderLeaderboard);

let globalLbCache = [];
function setupGlobalLeaderboardListener() {
  if (!firebaseEnabled || !db) return;
  if (globalLbUnsub) globalLbUnsub();

  // v8 or v9 style depending on how db/helpers are provided
  try {
    if (window.firebase && db) {
      globalLbUnsub = db.collection("leaderboard")
        .orderBy("xp", "desc")
        .limit(30)
        .onSnapshot(snapshot => {
          globalLbCache = [];
          snapshot.forEach(doc => globalLbCache.push(doc.data()));
          if (lbGlobalBtn.classList.contains("active")) renderLeaderboard();
        }, err => console.error("LB listener error", err));
    } else if (fsHelpers && db) {
      const { collection, query, orderBy, limit, onSnapshot } = fsHelpers;
      const q = query(collection(db, "leaderboard"), orderBy("xp", "desc"), limit(30));
      globalLbUnsub = onSnapshot(q, snapshot => {
        globalLbCache = [];
        snapshot.forEach(doc => globalLbCache.push(doc.data()));
        if (lbGlobalBtn.classList.contains("active")) renderLeaderboard();
      }, err => console.error("LB listener error", err));
    }
  } catch (e) {
    console.error("setupGlobalLeaderboardListener error", e);
  }
}

function updateGlobalLeaderboard() {
  if (!firebaseEnabled || !db || !currentUser) return;
  try {
    if (window.firebase && db) {
      db.collection("leaderboard").doc(currentUser.username).set({
        username: currentUser.username,
        xp: currentUser.xp || 0,
        coins: currentUser.coins || 0,
        gamesPlayed: currentUser.gamesPlayed || 0,
        achievementsUnlocked: currentUser.achievementsUnlocked || 0,
        updatedAt: Date.now()
      }, { merge: true }).catch(console.error);
    } else if (fsHelpers && db) {
      const { doc, setDoc, collection } = fsHelpers;
      const ref = doc(collection(db, "leaderboard"), currentUser.username);
      setDoc(ref, {
        username: currentUser.username,
        xp: currentUser.xp || 0,
        coins: currentUser.coins || 0,
        gamesPlayed: currentUser.gamesPlayed || 0,
        achievementsUnlocked: currentUser.achievementsUnlocked || 0,
        updatedAt: Date.now()
      }, { merge: true }).catch(console.error);
    }
  } catch (e) {
    console.error("updateGlobalLeaderboard error", e);
  }
}

// ---- Chat (local + optional global) ----
function loadChatLocal() {
  chatMessagesEl.innerHTML = "";
  let msgs = [];
  try {
    const stored = localStorage.getItem(CHAT_KEY);
    if (stored) msgs = JSON.parse(stored);
  } catch (e) {}
  msgs.forEach(m => appendChatMessage(m.name, m.text, m.ts, false, m.system, m.channel || "general"));
}

function saveChatLocal(msgs) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(msgs));
}

function getLocalChatMessages() {
  try {
    const stored = localStorage.getItem(CHAT_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return [];
}

function appendChatMessage(name, text, ts = Date.now(), save = true, system = false, channel = "general") {
  const selChannel = chatChannelSelect.value;
  if (channel !== selChannel && !system) {
    // don't render now, but keep stored
  }

  if (channel === selChannel || system) {
    const div = document.createElement("div");
    div.className = "chat-msg";
    let timeStr = new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (system) {
      div.innerHTML = `<span class="chat-system">[${timeStr}] ${text}</span>`;
    } else {
      const rank = currentUser && name === currentUser.username ? getRankFromStats(currentUser) : "";
      div.innerHTML = `<span class="chat-name">${name}${rank ? " (" + rank + ")" : ""}:</span><span>${text}</span><span class="chat-time">${timeStr}</span>`;
    }
    chatMessagesEl.appendChild(div);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  if (save) {
    let msgs = getLocalChatMessages();
    msgs.push({ name, text, ts, system, channel });
    if (msgs.length > 200) msgs = msgs.slice(-200);
    saveChatLocal(msgs);
  }
}

function setupGlobalChatListener() {
  if (!firebaseEnabled || !db) return;
  if (globalChatUnsub) globalChatUnsub();

  try {
    if (window.firebase && db) {
      globalChatUnsub = db.collection("chat")
        .orderBy("ts", "desc")
        .limit(50)
        .onSnapshot(snapshot => {
          chatMessagesEl.innerHTML = "";
          const all = [];
          snapshot.forEach(doc => all.push(doc.data()));
          all.sort((a, b) => a.ts - b.ts);
          all.forEach(m => {
            appendChatMessage(m.name, m.text, m.ts, false, m.system, m.channel || "general");
          });
        }, err => console.error("chat listener err", err));
    } else if (fsHelpers && db) {
      const { collection, query, orderBy, limit, onSnapshot } = fsHelpers;
      const q = query(collection(db, "chat"), orderBy("ts", "desc"), limit(50));
      globalChatUnsub = onSnapshot(q, snapshot => {
        chatMessagesEl.innerHTML = "";
        const all = [];
        snapshot.forEach(doc => all.push(doc.data()));
        all.sort((a, b) => a.ts - b.ts);
        all.forEach(m => {
          appendChatMessage(m.name, m.text, m.ts, false, m.system, m.channel || "general");
        });
      }, err => console.error("chat listener err", err));
    }
  } catch (e) {
    console.error("setupGlobalChatListener error", e);
  }
}

function sendGlobalChatMessage(name, text, system = false, channel = "general") {
  if (!firebaseEnabled || !db) return;
  try {
    if (window.firebase && db) {
      db.collection("chat").add({
        name,
        text,
        ts: Date.now(),
        system,
        channel
      }).catch(console.error);
    } else if (fsHelpers && db) {
      const { collection, addDoc } = fsHelpers;
      addDoc(collection(db, "chat"), {
        name,
        text,
        ts: Date.now(),
        system,
        channel
      }).catch(console.error);
    }
  } catch (e) {
    console.error("sendGlobalChatMessage error", e);
  }
}

chatSend.addEventListener("click", () => {
  sendChatFromInput();
});
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendChatFromInput();
  }
});
chatChannelSelect.addEventListener("change", () => {
  if (!firebaseEnabled) {
    chatMessagesEl.innerHTML = "";
    const msgs = getLocalChatMessages();
    msgs.forEach(m => appendChatMessage(m.name, m.text, m.ts, false, m.system, m.channel || "general"));
  }
});

function sendChatFromInput() {
  const text = (chatInput.value || "").trim();
  if (!text) return;

  if (text.startsWith("/")) {
    handleChatCommand(text);
    chatInput.value = "";
    return;
  }

  if (!currentUser) {
    alert("Log in first.");
    return;
  }

  const name = currentUser.username;
  const channel = chatChannelSelect.value;

  appendChatMessage(name, text, Date.now(), true, false, channel);
  if (firebaseEnabled) {
    sendGlobalChatMessage(name, text, false, channel);
  }

  currentUser.messagesSent = (currentUser.messagesSent || 0) + 1;
  currentUser.xp = (currentUser.xp || 0) + 2;
  checkAchievements();
  saveUsers();
  updateUI();

  chatInput.value = "";
}

function handleChatCommand(cmd) {
  const base = cmd.toLowerCase().trim();

  function sys(msg) {
    appendChatMessage("System", msg, Date.now(), true, true, chatChannelSelect.value);
  }

  if (base === "/help") {
    sys("Commands: /help, /stats, /coins, /daily, /randomgame, /rank, /clear");
    return;
  }
  if (!currentUser) {
    sys("Log in to use commands.");
    return;
  }

  if (base === "/stats") {
    sys(`Stats: Level ${getLevelFromXP(currentUser.xp || 0).level}, XP ${currentUser.xp || 0}, Coins ${currentUser.coins || 0}, Games ${currentUser.gamesPlayed || 0}, Achievements ${currentUser.achievementsUnlocked || 0}.`);
  } else if (base === "/coins") {
    sys(`You have ${currentUser.coins || 0} coins.`);
  } else if (base === "/daily") {
    dailyBtn.click();
  } else if (base === "/randomgame") {
    const games = getCurrentGames();
    const pick = games[Math.floor(Math.random() * games.length)];
    sys(`Random game: ${pick.name}`);
  } else if (base === "/rank") {
    sys(`Your rank: ${getRankFromStats(currentUser)}.`);
  } else if (base === "/clear") {
    saveChatLocal([]);
    chatMessagesEl.innerHTML = "";
    sys("Chat cleared (local only).");
  } else {
    sys("Unknown command. Type /help");
  }
}

// ---- Activity render ----
function renderActivity() {
  activityList.innerHTML = "";
  const last10 = activities.slice(-10).reverse();
  last10.forEach(a => {
    const li = document.createElement("li");
    const timeStr = new Date(a.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    li.textContent = `[${timeStr}] ${a.text}`;
    activityList.appendChild(li);
  });
}

// ---- Settings ----
themeSelect.addEventListener("change", () => {
  settings.theme = themeSelect.value;
  applyTheme();
  saveSettings();
});

animSelect.addEventListener("change", () => {
  settings.animations = animSelect.value;
  applyAnimations();
  saveSettings();
});

clearDataBtn.addEventListener("click", () => {
  if (!confirm("Clear ALL local data (users, stats, chat)? This cannot be undone.")) return;
  localStorage.clear();
  location.reload();
});

function applyTheme() {
  const theme = settings.theme || "red";
  document.body.dataset.theme = theme;
}

function applyAnimations() {
  const mode = settings.animations || "full";
  document.body.dataset.anim = mode;
}

// ---- Streak handling ----
function updateStreakOnLogin() {
  if (!currentUser) return;
  const today = new Date();
  const dayKey = today.toISOString().slice(0, 10);
  const last = currentUser.lastLoginDay;

  if (!last) {
    currentUser.streak = 1;
  } else if (last === dayKey) {
  } else {
    const lastDate = new Date(last);
    const diffDays = Math.round((today - lastDate) / (24 * 60 * 60 * 1000));
    if (diffDays === 1) {
      currentUser.streak = (currentUser.streak || 0) + 1;
    } else {
      currentUser.streak = 1;
    }
  }
  currentUser.lastLoginDay = dayKey;
}

// ---- UI update ----
function updateUI() {
  if (!currentUser) return;

  const uname = currentUser.username || "Player";
  usernameLabel.textContent = uname;

  coinAmount.textContent = currentUser.coins || 0;
  homeCoins.textContent = currentUser.coins || 0;
  homeGames.textContent = currentUser.gamesPlayed || 0;
  homeAch.textContent = currentUser.achievementsUnlocked || 0;

  const xp = currentUser.xp || 0;
  const { level, currentXP, needed } = getLevelFromXP(xp);
  const pct = Math.min(100, (currentXP / needed) * 100);

  profileLevelLabel.textContent = `Level ${level}`;
  profileXPLabel.textContent = `${currentXP} / ${needed} XP`;
  profileLevelFill.style.width = `${pct}%`;

  profileLevelLabelBig.textContent = `Level ${level}`;
  profileXPLabelBig.textContent = `${currentXP} / ${needed} XP`;
  profileLevelFillBig.style.width = `${pct}%`;

  const rank = getRankFromStats(currentUser);
  const title = getTitleFromStats(currentUser);

  profileRankBanner.textContent = rank;
  profileRankBig.textContent = rank;
  profileTitle.textContent = title;

  profileNameBanner.textContent = uname;
  profileNameBig.textContent = uname;

  const streak = currentUser.streak || 0;
  streakLabel.textContent = `${streak} day streak`;
  profileStreak.textContent = `${streak} days`;

  profileMessages.textContent = currentUser.messagesSent || 0;

  if (currentUser.favoriteGameId) {
    const g = internalGames.find(g => g.id === currentUser.favoriteGameId) ||
              externalGames.find(g => g.id === currentUser.favoriteGameId);
    profileFavorite.textContent = g ? g.name : "Unknown";
  } else {
    profileFavorite.textContent = "None yet";
  }

  profileCoins.textContent = currentUser.coins || 0;
  profileGames.textContent = currentUser.gamesPlayed || 0;
  profileAch.textContent = currentUser.achievementsUnlocked || 0;

  if (currentUser.lastGameId) {
    continueBtn.disabled = false;
  } else {
    continueBtn.disabled = true;
  }

  renderAchievements();
  renderLeaderboard();
  renderHomeGameStrips();
  renderActivity();
  loadChatLocal();
}

// ---- Enter app ----
function enterApp() {
  authScreen.classList.add("hidden");
  app.classList.remove("hidden");

  updateStreakOnLogin();
  checkAchievements();
  saveUsers();
  updateUI();
  updateGlobalLeaderboard();
}

// ---- Tab switch from JS ----
function switchToTab(name) {
  navButtons.forEach(btn => {
    if (btn.dataset.target === name) btn.classList.add("active");
    else btn.classList.remove("active");
  });
  screens.forEach(s => {
    if (s.id === `screen-${name}`) s.classList.add("active");
    else s.classList.remove("active");
  });
}

// ---- Init ----
function init() {
  loadUsers();
  loadSettings();
  loadActivities();
  applyTheme();
  applyAnimations();

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

  buildCategories();
  renderGames();


  initFirebaseIfConfigured();

    // Retry Firebase init after delays (in case external scripts load slowly)
  let retries = 0;
  const maxRetries = 5;
  const retryInterval = setInterval(() => {
    if (!firebaseEnabled && retries < maxRetries) {
      retries++;
      console.log(`Retrying Firebase init (attempt ${retries}/${maxRetries})...`);
      initFirebaseIfConfigured();
    }
    if (firebaseEnabled || retries >= maxRetries) {
      clearInterval(retryInterval);
      if (firebaseEnabled) {
        console.log('Firebase enabled successfully!');
      } else {
        console.log('Firebase not available, using local mode.');
      }
    }
  }, 500);

    // Hide loader after all initialization
  if (loader) loader.classList.add("hidden");
}

// Start
init();




