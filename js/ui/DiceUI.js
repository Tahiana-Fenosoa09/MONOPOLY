// ============================================================
//  DiceUI.js — Handles the dice roll button and result display.
// ============================================================

const DICE_ICONS = {
    1: "fa-dice-one",
    2: "fa-dice-two",
    3: "fa-dice-three",
    4: "fa-dice-four",
    5: "fa-dice-five",
    6: "fa-dice-six",
};

export class DiceUI {
    constructor() {
        this._onRollCallback = null;
    }

    init() {
        const btn = document.querySelector(".roll-button");
        if (btn) {
            btn.addEventListener("click", () => {
                if (this._onRollCallback) this._onRollCallback();
            });
        }
    }

    /** Register a callback triggered when the Roll button is clicked. */
    onRoll(callback) {
        this._onRollCallback = callback;
    }

    /**
     * Display the two dice results.
     * @param {number} d1
     * @param {number} d2
     */
    showResult(d1, d2) {
        // Values
        const n1 = document.querySelector(".dice-number");
        const n2 = document.querySelector(".dice-number2");
        if (n1) n1.textContent = d1;
        if (n2) n2.textContent = d2;

        // Icons
        const icon1 = document.getElementById("dice-icon");
        const icon2 = document.getElementById("dice-icon2");
        if (icon1) {
            icon1.className = `fa-solid ${DICE_ICONS[d1] || "fa-dice"} fa-xl`;
        }
        if (icon2) {
            icon2.className = `fa-solid ${DICE_ICONS[d2] || "fa-dice"} fa-xl`;
        }
    }

    /** Enable / disable the roll button. */
    setEnabled(enabled) {
        const btn = document.querySelector(".roll-button");
        if (btn) btn.disabled = !enabled;
    }
}
