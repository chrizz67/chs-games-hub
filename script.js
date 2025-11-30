/* ---------------------------
   TAB SWITCHING / UI
---------------------------- */
function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.style.display = "none");
    document.getElementById(tabId).style.display = "block";
}

window.onload = () => {
    showTab('home');
    loadGames();  // load games on startup
};


/* ---------------------------
   LOAD INTERNAL GAMES FROM GITHUB API
---------------------------- */

async function loadGames() {
    const container = document.getElementById("game-list");
    if (!container) return; // safety check

    container.innerHTML = "<p>Loading games...</p>";

    try {
        // 🔥 FETCHES THE FOLDER internal-games FROM YOUR REPO
        const res = await fetch("https://api.github.com/repos/chrizz67/chs-games-hub/contents/internal-games");
        const data = await res.json();

        container.innerHTML = ""; // clear loading text

        data.forEach(item => {
            if (item.type === "dir") {
                const gameFolder = item.name;

                container.innerHTML += `
                    <div class="game-card" onclick="openGame('${gameFolder}')">
                        <h3>${gameFolder}</h3>
                        <button class="play-btn">Play</button>
                    </div>
                `;
            }
        });

        if (container.innerHTML.trim() === "") {
            container.innerHTML = "<p>No games found.</p>";
        }

    } catch (e) {
        console.error(e);
        container.innerHTML = "<p>Error loading games.</p>";
    }
}


/* ---------------------------
   OPEN GAME
---------------------------- */

function openGame(folder) {
    // 🔥 This will automatically open internal-games/gameXXX/index.html
    window.location.href = `/internal-games/${folder}/index.html`;
}


/* ---------------------------
   OPTIONAL: Smooth animations
---------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");
});
