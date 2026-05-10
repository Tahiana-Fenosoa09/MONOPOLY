// ============================================================
//  BoardUI.js — Generates the board dynamically from squares data
//  and manages pawn positions on the board.
// ============================================================

export class BoardUI {

    constructor() {
        this.gameCard = document.getElementById("game-card");
        this.squaresData = null;
        this.players = [];
    }

    buildBoard(squaresData, players) {
        this.squaresData = squaresData;
        this.players = players;
        this.gameCard.querySelectorAll(".case").forEach(el => el.remove());

        squaresData.forEach(sq => this._createSquareEl(sq));
        this.updatePawns();
    }

    updatePawns() {
        this.gameCard.querySelectorAll(".pions-case, #pions-container").forEach(el => {
            el.innerHTML = "";
        });

        this.players.forEach(player => {
            if (player.isBankrupt) return;
            const container = player.position === 0
                ? document.getElementById("pions-container")
                : document.getElementById(`pions-${player.position}`);
            if (!container) return;

            const pion = document.createElement("div");
            pion.className = "pion";
            pion.style.background = player.color;
            pion.title = player.name;
            pion.textContent = player.symbol;
            container.appendChild(pion);
        });
    }

    highlightSquare(index) {
        const el = this.gameCard.querySelector(`[data-index="${index}"]`);
        if (!el) return;
        el.classList.add("square-highlight");
        setTimeout(() => el.classList.remove("square-highlight"), 900);
    }

    markOwned(squareIndex, playerColor) {
        const el = this.gameCard.querySelector(`[data-index="${squareIndex}"]`);
        if (!el) return;
        let dot = el.querySelector(".owner-dot");
        if (!dot) {
            dot = document.createElement("div");
            dot.className = "owner-dot";
            el.appendChild(dot);
        }
        dot.style.background = playerColor;
    }

    /** Update house / hotel icons on a square. */
    updateBuildings(squareIndex, houseCount, hasHotel) {
        const el = this.gameCard.querySelector(`[data-index="${squareIndex}"]`);
        if (!el) return;
        let bldg = el.querySelector(".buildings");
        if (!bldg) {
            bldg = document.createElement("div");
            bldg.className = "buildings";
            el.appendChild(bldg);
        }
        bldg.innerHTML = hasHotel ? `<span>🏨</span>` : "🏠".repeat(houseCount);
    }

    // ── Private helpers ──────────────────────────────────────

    /**
     * Grid position (1-indexed) for each of the 40 squares.
     *  row 1  → indices  0-10  (bottom row, left→right)
     *  col 11 → indices 11-19  (right col, top→bottom... wait: row 2-10)
     *  row 11 → indices 20-30  (top row, right→left)
     *  col 1  → indices 31-39  (left col, bottom→top... row 10-2)
     */
    _gridPos(index) {
        if (index <= 10)       return { row: 1,          col: index + 1 };
        if (index <= 19)       return { row: index - 9,  col: 11 };
        if (index <= 30)       return { row: 11,         col: 11 - (index - 20) };
        /* 31-39 */            return { row: 11 - (index - 30), col: 1 };
    }

    _bandClass(index) {
        if (index >= 1  && index <= 9)  return "bande bande-bas";
        if (index >= 11 && index <= 19) return "bande bande-gauche";
        if (index >= 21 && index <= 29) return "bande bande-haut";
        if (index >= 31 && index <= 39) return "bande bande-droite";
        return "";
    }

    _groupColor(group) {
        const map = {
            brown:    "var(--brown)",
            lightblue:"var(--lightblue)",
            pink:     "var(--pink)",
            orange:   "var(--orange)",
            red:      "var(--red)",
            yellow:   "var(--yellow)",
            green:    "var(--green)",
            darkblue: "var(--darkblue)",
        };
        return map[group] || "#aaa";
    }

    _createSquareEl(sq) {
        const { row, col } = this._gridPos(sq.index);
        const div = document.createElement("div");
        div.className = "case";
        div.dataset.index = sq.index;
        div.dataset.type  = sq.type;
        div.style.cssText = `grid-row:${row};grid-column:${col};`;
        div.innerHTML = this._squareHTML(sq);
        this.gameCard.appendChild(div);
    }

    _squareHTML(sq) {
        switch (sq.type) {
            case "start":
                return `
                  <div class="coin coin-depart" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                    <div class="coin-libelle">🏁 GO</div>
                    <div class="rangee-pions" id="pions-container"></div>
                  </div>`;

            case "jail":
                return `
                  <div class="coin coin-prison" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                    <div class="coin-libelle">🔒 Jail /<br>Just Visiting</div>
                    <div class="pions-case" id="pions-${sq.index}"></div>
                  </div>`;

            case "gotojail":
                return `
                  <div class="coin coin-aller-prison" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                    <div class="coin-libelle">🚔 Go to<br>Jail</div>
                    <div class="pions-case" id="pions-${sq.index}"></div>
                  </div>`;

            case "freeparking":
                return `
                  <div class="coin coin-parc" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                    <div class="coin-libelle">🌳 Free<br>Parking</div>
                    <div class="pions-case" id="pions-${sq.index}"></div>
                  </div>`;

            case "property": {
                const band  = this._bandClass(sq.index);
                const color = this._groupColor(sq.group);
                return `
                  <div class="${band}" style="background:${color};"></div>
                  <div class="case-nom">${sq.name}</div>
                  <div class="case-prix">£${sq.price}</div>
                  <div class="pions-case" id="pions-${sq.index}"></div>`;
            }

            case "station":
                return `
                  <div class="case-icone">🚉</div>
                  <div class="case-nom">${sq.name}</div>
                  <div class="case-prix">£${sq.price}</div>
                  <div class="pions-case" id="pions-${sq.index}"></div>`;

            case "utility": {
                const icon = sq.name.toLowerCase().includes("water") ? "💧" : "⚡";
                return `
                  <div class="case-icone">${icon}</div>
                  <div class="case-nom">${sq.name}</div>
                  <div class="case-prix">£${sq.price}</div>
                  <div class="pions-case" id="pions-${sq.index}"></div>`;
            }

            case "tax": {
                const icon = sq.name.toLowerCase().includes("super") ? "💎" : "💸";
                return `
                  <div class="case-icone">${icon}</div>
                  <div class="case-nom">${sq.name}</div>
                  <div class="case-prix">£${sq.amount}</div>
                  <div class="pions-case" id="pions-${sq.index}"></div>`;
            }

            case "chance":
                return `
                  <div class="case-icone">🃏</div>
                  <div class="case-nom">Chance</div>
                  <div class="pions-case" id="pions-${sq.index}"></div>`;

            case "community":
                return `
                  <div class="case-icone">📦</div>
                  <div class="case-nom">Community Chest</div>
                  <div class="pions-case" id="pions-${sq.index}"></div>`;

            default:
                return `<div class="case-nom">${sq.name}</div><div class="pions-case" id="pions-${sq.index}"></div>`;
        }
    }
}
