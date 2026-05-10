// ============================================================
//  script.js — Point d'entrée (main)
//  Instancie les vues, les branche ensemble, lance l'application.
// ============================================================

import { GameUI }  from "./ui/GameUI.js";
import { DiceUI }  from "./ui/DiceUI.js";
import { StockUI } from "./ui/StockUI.js";
import { BoardUI } from "./ui/BoardUI.js";

// 1. Créer les vues
const diceUI  = new DiceUI();
const stockUI = new StockUI();
const boardUI = new BoardUI();
const gameUI  = new GameUI(diceUI, stockUI, boardUI);

// 2. Initialiser (brancher les écouteurs DOM)
diceUI.init();
stockUI.init();
gameUI.init();
