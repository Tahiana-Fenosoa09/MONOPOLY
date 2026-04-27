// ============================================================
//  MONOPOLY — script.js 
// ============================================================


// ── 1. CRÉATION DE LA PARTIE ─────────────────────────────────

function createGame() {
  let playerNames = [];

  // Éléments DOM utilisés dans plusieurs étapes
  const saveButton      = document.querySelector("#player-info-button");
  const beginningSection = document.querySelector(".begining-section");
  const gameSection     = document.querySelector(".game-section");
  const playerListPanel = document.querySelector(".all-players-default");
  const stockPanel      = document.querySelector(".stock-gestion-default");
  const logo            = document.querySelector(".monopoly-logo");
  const dicePanel       = document.querySelector(".roll-dice-default");

  // ---------- Étape 1 : clic sur "Next" ----------
  function setupNextButton() {
    const nextButton      = document.querySelector("#begining-button");
    const playerForm      = document.querySelector(".player-info-defaulthide");
    const beginningCard   = document.querySelector(".begining-card");
    const loadingOverlay  = document.querySelector(".load-animation-default");

    nextButton.addEventListener("click", () => {
      // Empêche la soumission involontaire du formulaire
      playerForm.addEventListener("submit", (e) => e.preventDefault());

      showLoading(loadingOverlay, () => {
        beginningCard.classList.add("begining-card-hide");
      });

      afterLoading(() => {
        playerForm.classList.add("player-info");
        const count = getSelectedPlayerCount();
        for (let i = 0; i < count; i++) {
          addPlayerInput();
        }
      });
    });
  }

  // ---------- Étape 2 : clic sur "Save information" ----------
  saveButton.addEventListener("click", () => {
    const inputs         = document.querySelectorAll(".all-input");
    const loadingOverlay = document.querySelector(".load-animation-default");
    const playerForm     = document.querySelector(".player-info-defaulthide");

    // Récupère les pseudos saisis
    playerNames = Array.from(inputs).map((input) => input.value);

    showLoading(loadingOverlay, () => {
      playerForm.classList.remove("player-info");
    });

    afterLoading(() => {
      // Bascule vers l'écran de jeu
      beginningSection.classList.add("begining-section-remove");
      gameSection.classList.add("game-section-show");
      stockPanel.classList.add("stock-gestion");
      playerListPanel.classList.add("all-players");
      logo.classList.add("monopoly-logo-hide");
      dicePanel.classList.add("roll-dice");

      renderPlayerList(playerNames);
    });
  });

  setupNextButton();
}


// ── HELPERS création de partie ────────────────────────────────

function getSelectedPlayerCount() {
  const select = document.querySelector("#selectOption");
  return Number(select[select.selectedIndex].value);
}

/** Ajoute un champ de saisie de pseudo dans le formulaire */
function addPlayerInput() {
  const container = document.createElement("div");
  const input     = document.createElement("input");

  input.classList.add("all-input");
  input.placeholder = "Enter player pseudo";
  container.classList.add("input-container");

  container.appendChild(input);
  document.querySelector(".player-inputs").appendChild(container);
}

function showLoading(overlay, onShow) {
  overlay.classList.add("load-animation");
  if (onShow) onShow();
  setTimeout(() => overlay.classList.remove("load-animation"), 2000);
}

function afterLoading(callback) {
  setTimeout(callback, 2100);
}


// ── 2. LANCER LES DÉS ────────────────────────────────────────

function setupDice() {
  const rollButton = document.querySelector(".roll-button");

  // Correspondance valeur → classe Font Awesome
  const DICE_CLASSES = {
    1: "fa-solid fa-dice-one fa-xl",
    2: "fa-solid fa-dice-two fa-xl",
    3: "fa-solid fa-dice-three fa-xl",
    4: "fa-solid fa-dice-four fa-xl",
    5: "fa-solid fa-dice-five fa-xl",
    6: "fa-solid fa-dice-six fa-xl",
  };

  function rollOneDie() {
    return Math.floor(Math.random() * 6) + 1;
  }

  rollButton.addEventListener("click", () => {
    const result1 = rollOneDie();
    const result2 = rollOneDie();

    document.querySelector(".dice-number").textContent  = result1;
    document.querySelector(".dice-number2").textContent = result2;
    document.querySelector("#dice-icon").className      = DICE_CLASSES[result1];
    document.querySelector("#dice-icon2").className     = DICE_CLASSES[result2];

    return [result1, result2]; 
  });
}


// ── 3. PANNEAU DE STOCK ───────────────────────────────────────

function setupStock() {
  const stockCard   = document.querySelector(".stock-app-default");
  const openButton  = document.querySelector(".stock-button");
  const closeButton = document.querySelector(".exit-stock");

  openButton.addEventListener("click",  () => stockCard.classList.add("stock-app"));
  closeButton.addEventListener("click", () => stockCard.classList.remove("stock-app"));
}


// ── 4. AFFICHAGE DES JOUEURS ──────────────────────────────────

function renderPlayerList(players) {
  const grid = document.querySelector(".player-grid");
  grid.innerHTML = ""; 

  players.forEach((name) => {
    const h3 = document.createElement("h3");
    h3.textContent = name;
    grid.appendChild(h3);
  });
}


// ── INITIALISATION ────────────────────────────────────────────

setupStock();
setupDice();
createGame();