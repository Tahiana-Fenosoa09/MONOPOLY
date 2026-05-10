// ============================================================
//  GameUI.js — Main controller: wires game logic ↔ UI.
//  Handles setup flow, turn loop, events, buy modal.
// ============================================================

import { Game }   from "../models/Game.js";
import { Player } from "../models/Player.js";

const PLAYER_COLORS  = ["#e74c3c", "#3498db", "#27ae60", "#f39c12", "#9b59b6"];
const PLAYER_SYMBOLS = ["♟", "♞", "♜", "♛", "♝"];

export class GameUI {
    constructor(diceUI, stockUI, boardUI) {
        this.diceUI  = diceUI;
        this.stockUI = stockUI;
        this.boardUI = boardUI;

        this.game        = null;
        this.squaresData = null;
        this.cardsData   = null;

        // DOM refs
        this._beginCard     = document.querySelector(".begining-card");
        this._playerForm    = document.querySelector(".player-info-defaulthide");
        this._loadAnim      = document.querySelector(".load-animation-default");
        this._beginSection  = document.querySelector(".begining-section");
        this._gameSection   = document.querySelector(".game-section");
        this._playerGrid    = document.querySelector(".player-grid");
        this._dicePanel     = document.querySelector(".roll-dice-default");
        this._allPlayersDiv = document.querySelector(".all-players-default");
        this._stockGestion  = document.querySelector(".stock-gestion-default");
        this._playerInputs  = document.querySelector(".player-inputs");
        this._selectEl      = document.getElementById("selectOption");

        this._buyModal      = null; // created on demand
    }

    // ──────────────────────────────────────────────────────────
    //  Init
    // ──────────────────────────────────────────────────────────

    init() {
        // Load JSON data
        Promise.all([
            fetch("squares.json").then(r => r.json()),
            fetch("cards.json").then(r => r.json()),
        ]).then(([squares, cards]) => {
            this.squaresData = squares;
            this.cardsData   = cards;
            this._setupBeginFlow();
        });

        // Wire dice callback
        this.diceUI.onRoll(() => this._handleRoll());

        // Create buy modal in DOM
        this._createBuyModal();
    }

    // ──────────────────────────────────────────────────────────
    //  Setup flow: player count → names → loading → game
    // ──────────────────────────────────────────────────────────

    _setupBeginFlow() {
        const nextBtn = document.getElementById("begining-button");
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                const count = parseInt(this._selectEl.value, 10);
                this._showPlayerNameForm(count);
            });
        }

        const saveBtn = document.getElementById("player-info-button");
        if (saveBtn) {
            saveBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this._startGame();
            });
        }
    }

    _showPlayerNameForm(count) {
        this._beginCard.classList.add("begining-card-hide");
        this._playerForm.classList.remove("player-info-defaulthide");
        this._playerForm.classList.add("player-info");

        this._playerInputs.innerHTML = "";
        for (let i = 0; i < count; i++) {
            const wrapper = document.createElement("div");
            wrapper.className = "input-container";
            wrapper.innerHTML = `
              <label style="color:${PLAYER_COLORS[i]};">${PLAYER_SYMBOLS[i]}</label>
              <input type="text" placeholder="Player ${i + 1} name" id="pname-${i}" required />`;
            this._playerInputs.appendChild(wrapper);
        }
    }

    _startGame() {
        const inputs = this._playerInputs.querySelectorAll("input");
        const players = [];

        inputs.forEach((inp, i) => {
            const name = inp.value.trim() || `Player ${i + 1}`;
            const p = new Player(name, PLAYER_COLORS[i], PLAYER_SYMBOLS[i]);
            p._log = []; // transaction log
            players.push(p);
        });

        // Show loading animation
        this._playerForm.classList.add("player-info-defaulthide");
        this._playerForm.classList.remove("player-info");
        this._loadAnim.classList.remove("load-animation-default");
        this._loadAnim.classList.add("load-animation");

        setTimeout(() => {
            this._launchGame(players);
        }, 1500);
    }

    _launchGame(players) {
        // Build game model
        this.game = new Game(players, this.squaresData, this.cardsData);

        // Switch to game view
        this._beginSection.classList.add("begining-section-remove");
        this._gameSection.style.display = "block";
        this._gameSection.classList.add("game-section-show");

        // Show panels
        this._dicePanel.classList.add("roll-dice");
        this._dicePanel.classList.remove("roll-dice-default");
        this._allPlayersDiv.classList.add("all-players");
        this._allPlayersDiv.classList.remove("all-players-default");
        this._stockGestion.classList.add("stock-gestion");
        this._stockGestion.classList.remove("stock-gestion-default");

        // Build board dynamically
        this.boardUI.buildBoard(this.squaresData, players);

        // Render player sidebar
        this._renderPlayerSidebar();

        // Highlight current player
        this._highlightCurrentPlayer();
    }

    // ──────────────────────────────────────────────────────────
    //  Player sidebar
    // ──────────────────────────────────────────────────────────

    _renderPlayerSidebar() {
        this._playerGrid.innerHTML = "";
        this.game.players.forEach((p, i) => {
            const div = document.createElement("div");
            div.className = "player-card";
            div.id = `player-card-${i}`;
            div.style.cssText = `
              display:flex; gap:8px; align-items:center;
              padding:8px; border-radius:8px;
              border: 2px solid transparent;`;
            div.innerHTML = `
              <div style="width:28px;height:28px;border-radius:50%;background:${p.color};
                          display:flex;align-items:center;justify-content:center;
                          color:#fff;font-size:14px;">${p.symbol}</div>
              <div>
                <div style="font-weight:700;font-size:13px;">${p.name}</div>
                <div class="p-money" style="color:#1a6b2f;font-size:12px;">£${p.money}</div>
              </div>`;
            // Click → open stock panel for this player
            div.addEventListener("click", () => this.stockUI.show(p));
            this._playerGrid.appendChild(div);
        });
    }

    _highlightCurrentPlayer() {
        document.querySelectorAll(".player-card").forEach((el, i) => {
            el.style.border = i === this.game.currentPlayerIndex
                ? `2px solid ${this.game.players[i].color}`
                : "2px solid transparent";
            el.style.background = i === this.game.currentPlayerIndex ? "#f0fff4" : "";
        });

        // Update stock button label
        const btn = document.querySelector(".stock-button");
        if (btn) btn.textContent = `📊 ${this.game.currentPlayer.name}'s Stock`;
    }

    _updateMoneyDisplay() {
        this.game.players.forEach((p, i) => {
            const el = document.querySelector(`#player-card-${i} .p-money`);
            if (el) el.textContent = `£${p.money}`;
        });
    }

    // ──────────────────────────────────────────────────────────
    //  Turn handling
    // ──────────────────────────────────────────────────────────

    _handleRoll() {
        if (!this.game || this.game.gameOver) return;
        this.diceUI.setEnabled(false);

        // Capture dice before playTurn (playTurn re-rolls internally)
        // We intercept by patching rollDices temporarily
        const d1Raw = this.game.d1.roll();
        const d2Raw = this.game.d2.roll();
        this.diceUI.showResult(d1Raw, d2Raw);

        // Now play the full turn using the game logic
        // We need to use the stored roll, so we patch briefly
        const origRoll = this.game.rollDices.bind(this.game);
        let used = false;
        this.game.rollDices = () => {
            if (!used) { used = true; return [d1Raw, d2Raw]; }
            return origRoll();
        };

        this.game.playTurn();
        this.game.rollDices = origRoll;

        // Process events
        const events = this.game.events;
        events.forEach(ev => this._handleEvent(ev));

        // Update board pawns
        this.boardUI.updatePawns();

        // Update owned squares visually
        this.game.players.forEach(p => {
            p.properties.forEach(sq => {
                this.boardUI.markOwned(sq.index, p.color);
                this.boardUI.updateBuildings(sq.index, sq.house, sq.hasHotel);
            });
        });

        // Update sidebar money
        this._updateMoneyDisplay();

        // Bankrupt players: grey out
        this.game.players.forEach((p, i) => {
            if (p.isBankrupt) {
                const card = document.getElementById(`player-card-${i}`);
                if (card) card.style.opacity = "0.4";
            }
        });

        if (this.game.gameOver) {
            this._showGameOver(this.game.winner);
            return;
        }

        this._highlightCurrentPlayer();
        this.diceUI.setEnabled(true);
    }

    _handleEvent(ev) {
        // Buy offer event (object)
        if (ev && typeof ev === "object" && ev.type === "buyOffer") {
            this._showBuyModal(ev.player, ev.square);
            return;
        }
        // Log string events
        if (typeof ev === "string") {
            this._logEvent(ev);
            // Also push to player's _log if we can figure out which player
            this.game.players.forEach(p => {
                if (ev.includes(p.name)) {
                    if (p._log) p._log.push(ev);
                }
            });
        }
    }

    _logEvent(msg) {
        // Show event in dice panel
        let log = document.getElementById("event-log");
        if (!log) {
            log = document.createElement("div");
            log.id = "event-log";
            log.style.cssText = `
              max-height:120px; overflow-y:auto; font-size:11px;
              border-top:1px solid #eee; padding-top:4px; margin-top:4px;`;
            this._dicePanel.appendChild(log);
        }
        const p = document.createElement("p");
        p.style.cssText = "padding:2px 0; border-bottom:1px solid #f0f0f0;";
        p.textContent = msg;
        log.prepend(p);
        // Keep max 10 entries
        while (log.children.length > 10) log.lastChild.remove();
    }

    // ──────────────────────────────────────────────────────────
    //  Buy Modal
    // ──────────────────────────────────────────────────────────

    _createBuyModal() {
        const modal = document.createElement("div");
        modal.id = "buy-modal";
        modal.style.cssText = `
          display:none; position:fixed; inset:0;
          background:rgba(0,0,0,0.55); z-index:100;
          align-items:center; justify-content:center;`;
        modal.innerHTML = `
          <div style="background:#fff; border-radius:16px; padding:32px 40px;
                      box-shadow:0 8px 40px rgba(0,0,0,0.4); text-align:center; min-width:320px;">
            <h2 id="buy-title" style="color:#1a6b2f;margin-bottom:12px;">Buy Property?</h2>
            <p id="buy-desc" style="margin-bottom:20px;line-height:1.5;"></p>
            <div style="display:flex;gap:16px;justify-content:center;">
              <button id="buy-yes" style="
                background:#1a6b2f;color:#fff;border:none;padding:12px 28px;
                border-radius:8px;font-weight:700;font-size:16px;cursor:pointer;">
                Buy
              </button>
              <button id="buy-no" style="
                background:#e0e0e0;color:#333;border:none;padding:12px 28px;
                border-radius:8px;font-weight:700;font-size:16px;cursor:pointer;">
                Skip
              </button>
            </div>
          </div>`;
        document.body.appendChild(modal);
        this._buyModal = modal;
    }

    _showBuyModal(player, square) {
        const modal = this._buyModal;
        const title = document.getElementById("buy-title");
        const desc  = document.getElementById("buy-desc");
        const btnYes = document.getElementById("buy-yes");
        const btnNo  = document.getElementById("buy-no");

        title.textContent = `Buy ${square.name}?`;
        desc.innerHTML = `
          <strong>${player.name}</strong> landed on <strong>${square.name}</strong>.<br>
          Price: <strong>£${square.price}</strong> &nbsp;|&nbsp; Your balance: <strong>£${player.money}</strong>`;

        modal.style.display = "flex";
        this.diceUI.setEnabled(false);

        const close = () => {
            modal.style.display = "none";
            btnYes.replaceWith(btnYes.cloneNode(true));
            btnNo.replaceWith(btnNo.cloneNode(true));
        };

        document.getElementById("buy-yes").addEventListener("click", () => {
            const ok = this.game.bank.sellProperty(player, square);
            if (ok) {
                if (player._log) player._log.push(`Bought ${square.name} for £${square.price}`);
                this.boardUI.markOwned(square.index, player.color);
                this._updateMoneyDisplay();
                this._logEvent(`${player.name} bought ${square.name} for £${square.price}`);
            }
            close();
            this.diceUI.setEnabled(true);
            this._highlightCurrentPlayer();
        });

        document.getElementById("buy-no").addEventListener("click", () => {
            this._logEvent(`${player.name} skipped buying ${square.name}`);
            close();
            this.diceUI.setEnabled(true);
            this._highlightCurrentPlayer();
        });
    }

    // ──────────────────────────────────────────────────────────
    //  Game Over
    // ──────────────────────────────────────────────────────────

    _showGameOver(winner) {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
          position:fixed; inset:0; background:rgba(0,0,0,0.7);
          display:flex; align-items:center; justify-content:center;
          z-index:200;`;
        overlay.innerHTML = `
          <div style="background:#fff; border-radius:20px; padding:48px 64px;
                      text-align:center; box-shadow:0 8px 60px rgba(0,0,0,0.5);">
            <div style="font-size:64px;">🏆</div>
            <h1 style="color:#1a6b2f;margin:16px 0 8px;">Game Over!</h1>
            <h2 style="margin-bottom:24px;">${winner.name} wins!</h2>
            <p style="color:#555;margin-bottom:32px;">Final balance: <strong>£${winner.money}</strong></p>
            <button onclick="location.reload()" style="
              background:#1a6b2f;color:#fff;border:none;padding:14px 36px;
              border-radius:10px;font-size:18px;font-weight:700;cursor:pointer;">
              Play Again
            </button>
          </div>`;
        document.body.appendChild(overlay);
    }
}
