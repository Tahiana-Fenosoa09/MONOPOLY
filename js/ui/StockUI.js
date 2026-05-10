// ============================================================
//  StockUI.js — Stock / portfolio panel per player.
// ============================================================

export class StockUI {
    constructor() {
        this._panel     = document.querySelector(".stock-app-default");
        this._exitBtn   = document.querySelector(".exit-stock");
        this._openBtn   = document.querySelector(".stock-button");
        this._currentPlayer = null;
    }

    init() {
        if (this._exitBtn) {
            this._exitBtn.addEventListener("click", () => this.hide());
        }
        if (this._openBtn) {
            this._openBtn.addEventListener("click", () => {
                if (this._currentPlayer) this.show(this._currentPlayer);
            });
        }
    }

    /** Render and show the stock panel for a player. */
    show(player) {
        this._currentPlayer = player;

        const panel = this._panel;
        panel.classList.add("stock-app");

        // Owner name
        const ownerEl = panel.querySelector("span");
        if (ownerEl) ownerEl.textContent = player.name.toUpperCase();

        // Balance
        const moneyEl = panel.querySelector(".stock-money h3:last-child");
        if (moneyEl) moneyEl.textContent = `£${player.money}`;

        // Expenses = sum of property prices owned
        const totalProp = player.properties.reduce((acc, p) => acc + (p.price || 0), 0);
        const expEl = panel.querySelector(".stock-expenses h3:last-child");
        if (expEl) expEl.textContent = `£${totalProp}`;

        // Properties list
        const infoEl = panel.querySelector(".stock-information");
        if (infoEl) {
            infoEl.innerHTML = `<h3>Properties owned</h3>`;
            if (player.properties.length === 0) {
                infoEl.innerHTML += `<p style="padding:1vh;color:#888;">No properties yet.</p>`;
            } else {
                player.properties.forEach(p => {
                    const buildings = p.hasHotel
                        ? "🏨 Hotel"
                        : (p.house > 0 ? `🏠×${p.house}` : "—");
                    infoEl.innerHTML += `
                      <div class="bought-item">
                        <p>${p.name}</p>
                        <div class="price">
                          <p>£${p.price}</p>
                          <p style="font-size:0.8em;">${buildings}</p>
                        </div>
                      </div>`;
                });
            }
        }

        // Transaction log
        if (player._log && player._log.length > 0) {
            const logEl = document.createElement("div");
            logEl.className = "stock-log";
            logEl.innerHTML = `<h3>Recent activity</h3>`;
            [...player._log].reverse().slice(0, 8).forEach(entry => {
                logEl.innerHTML += `<p class="log-entry">${entry}</p>`;
            });
            infoEl.after(logEl);
        }
    }

    /** Hide the panel. */
    hide() {
        this._panel.classList.remove("stock-app");
    }
}
