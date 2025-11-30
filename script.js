async function loadGames() {
    const gameContainer = document.getElementById("game-list");

    try {
        const response = await fetch("https://api.github.com/repos/chrizz67/chs-games-hub/contents/internal-games");
        const data = await response.json();

        let html = "";

        data.forEach(folder => {
            if (folder.type === "dir") {
                const name = folder.name;

                html += `
                    <div class="game-card" onclick="playGame('${name}')">
                        <h3>${name}</h3>
                        <button>Play</button>
                    </div>
                `;
            }
        });

        gameContainer.innerHTML = html;

    } catch (err) {
        console.error("Game load error:", err);
    }
}

function playGame(folder) {
    window.location.href = `/internal-games/${folder}/index.html`;
}

window.onload = loadGames;
