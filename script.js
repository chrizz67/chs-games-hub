// --- COIN SYSTEM ---
let coins = localStorage.getItem("coins");
if (!coins) {
    coins = 0;
    localStorage.setItem("coins", coins);
}
document.getElementById("coinAmount").innerText = coins;

// Add coins function
function addCoins(amount) {
    coins = parseInt(coins) + amount;
    localStorage.setItem("coins", coins);
    document.getElementById("coinAmount").innerText = coins;
}

// --- ACHIEVEMENTS ---
const achievements = [
    { id: 1, name: "First Launch", desc: "Opened the hub.", earned: true },
    { id: 2, name: "First Game", desc: "Played any game.", earned: false },
    { id: 3, name: "Coin Collector", desc: "Earn 100 coins.", earned: false },
];

function loadAchievements() {
    const container = document.getElementById("achievementList");
    container.innerHTML = "";

    achievements.forEach(a => {
        const div = document.createElement("div");
        div.classList.add("achievement");

        div.innerHTML = `
            <h3>${a.name}</h3>
            <p>${a.desc}</p>
            <p style="opacity:0.5; margin-top:5px;">
                ${a.earned ? "✔ Earned" : "❌ Not yet"}
            </p>
        `;

        container.appendChild(div);
    });
}

loadAchievements();

// --- GAME OPENING ---
function openGame(game) {
    // Award achievement #2
    achievements[1].earned = true;
    loadAchievements();

    // Give coins for opening game
    addCoins(10);

    alert("Game '" + game + "' would launch here (you can add the real games later).");
}
