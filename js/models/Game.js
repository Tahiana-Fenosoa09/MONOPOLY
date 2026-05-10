import { Board }    from "./Board.js";
import { CardDeck } from "./CardDeck.js";
import { Bank }     from "./Bank.js";
import { Dice }     from "./Dice.js";

export class Game {

    constructor(players, squaresData, cardsData) {
        this.board            = new Board(squaresData);
        this.deck             = new CardDeck(cardsData);
        this.bank             = new Bank();
        this.d1               = new Dice();
        this.d2               = new Dice();
        this.lastDicesResult  = 0;
        this.players          = players;
        this.currentPlayerIndex = 0;
        this.gameOver         = false;
        this.winner           = null;
        this._events          = [];
        this.totalPlayers     = players.length;
    }

    get currentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    get events() {
        const copy = [...this._events];
        this._events = [];
        return copy;
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.totalPlayers;
    }

    rollDices() {
        return [this.d1.roll(), this.d2.roll()];
    }

    isDouble(d1, d2) {
        return d1 === d2;
    }

    playTurn(doubleCount = 0) {
        const player = this.currentPlayer;
        const [d1, d2] = this.rollDices();
        this.lastDicesResult = d1 + d2;

        if (doubleCount === 3) {
            this.goToJail(player);
            this.nextPlayer();
            return;
        }

        if (player.inJail) {
            if (this.isDouble(d1, d2)) {
                player.inJail = false;
                player.turnsInJail = 0;
            } else {
                player.turnsInJail++;
                if (player.turnsInJail >= 3) {
                    this.bank.receive(player, 50); 
                    player.inJail = false;
                    player.turnsInJail = 0;
                } else {
                    this.nextPlayer();
                    return;
                }
            }
        }

        const oldPosition = player.position;
        player.move(this.lastDicesResult);

        if (oldPosition + this.lastDicesResult >= 40) {
            this.bank.pay(player, 200); 
            this._events.push(`${player.name} passe par Go et reçoit 200€`);
        }

        this.handleSquare(player);

        if (player.isBankrupt) {
            this.nextPlayer();
            return;
        }

        if (this.isDouble(d1, d2)) {
            this.playTurn(doubleCount + 1);
        } else {
            this.nextPlayer();
        }
    }

    goToJail(player) {
        player.position = this.board.getSquareIndexByType("jail");
        player.inJail = true;
        player.turnsInJail = 0;
        this._events.push(`${player.name} va en prison !`);
    }

    handleSquare(player) {
        const square = this.board.getSquare(player.position);

        switch (square.type) {
            case "start":
                break;

            case "property":
            case "station":
            case "utility":
                this.handlePropertyLanding(player, square);
                break;

            case "tax":
                const taxAmount = square.moneyDue();
                const paid = player.pay(taxAmount);
                this.bank.receive(player, taxAmount);
                this._events.push(`${player.name} paie une taxe de ${taxAmount}€`);
                if (!paid) {
                    this.bankrupt(player);
                }
                break;

            case "chance":
                this.drawAndApplyCard(player, "chance");
                break;

            case "community":
                this.drawAndApplyCard(player, "community");
                break;

            case "jail":
                break;

            case "gotojail":
                this.goToJail(player);
                break;

            case "freeparking":
                break;

            default:
                console.warn(`Type de case inconnu : ${square.type}`);
        }
    }

    handlePropertyLanding(player, square) {
        if (square.owner === null) {
            if (player.money >= square.price) {
                this._events.push({
                    type: "buyOffer",
                    square: square,
                    player: player
                });
            }
        } else if (square.owner !== player) {
            let rent = 0;

            if (square.type === "property") {
                rent = square.calculateRent();
            } else if (square.type === "station") {
                const ownedStations = square.owner.properties.filter(
                    p => p.type === "station"
                ).length;
                rent = square.calculateRentStation(ownedStations);
            } else if (square.type === "utility") {
                const ownedUtilities = square.owner.properties.filter(
                    p => p.type === "utility"
                ).length;
                rent = square.calculatePriceUtility(this.lastDicesResult, ownedUtilities);
            }

            const paid = player.pay(rent);
            square.owner.receive(rent);
            this._events.push(`${player.name} paie ${rent}€ de loyer à ${square.owner.name}`);

            if (!paid) {
                this.bankrupt(player, square.owner);
            }
        }
    }

    drawAndApplyCard(player, type) {
        let card;
        if (type === "chance") {
            card = this.deck.drawChance();
        } else {
            card = this.deck.drawCommunity();
        }

        if (!card) return;

        this._events.push(`${player.name} tire une carte ${type} : ${card.text}`);

        switch (card.action) {
            case "moveTo":
                player.position = card.value;
                if (card.collect) {
                    this.bank.pay(player, card.collect);
                }
                this.handleSquare(player);
                break;

            case "moveBack":
                player.position = (player.position - card.value + 40) % 40;
                this.handleSquare(player);
                break;

            case "collect":
                this.bank.pay(player, card.value);
                this._events.push(`${player.name} reçoit ${card.value}€`);
                break;

            case "pay":
                const success = player.pay(card.value);
                this.bank.receive(player, card.value);
                this._events.push(`${player.name} paie ${card.value}€`);
                if (!success) {
                    this.bankrupt(player);
                }
                break;

            case "goToJail":
                this.goToJail(player);
                break;

            case "getOutOfJailFree":
                player.outOfJailCards++;
                this._events.push(`${player.name} reçoit une carte "Sortir de prison"`);
                return;

            case "payEachPlayer":
                this.players.forEach(other => {
                    if (other !== player && !other.isBankrupt) {
                        const paidEach = player.pay(card.value);
                        other.receive(card.value);
                        if (!paidEach) {
                            this.bankrupt(player);
                        }
                    }
                });
                this._events.push(`${player.name} paie ${card.value}€ à chaque joueur`);
                break;

            case "collectFromEachPlayer":
                this.players.forEach(other => {
                    if (other !== player && !other.isBankrupt) {
                        other.pay(card.value);
                        player.receive(card.value);
                    }
                });
                this._events.push(`${player.name} reçoit ${card.value}€ de chaque joueur`);
                break;

            case "repairs":
                let totalRepairs = 0;
                player.properties.forEach(p => {
                    if (p.hasHotel) {
                        totalRepairs += card.hotelCost;
                    } else if (p.house > 0) {
                        totalRepairs += p.house * card.houseCost;
                    }
                });
                const repaired = player.pay(totalRepairs);
                this.bank.receive(player, totalRepairs);
                this._events.push(`${player.name} paie ${totalRepairs}€ de réparations`);
                if (!repaired) {
                    this.bankrupt(player);
                }
                break;

            case "moveToNearestStation":
                const stations = [5, 15, 25, 35];
                const currentPos = player.position;
                let nearestStation = stations.find(s => s > currentPos);
                if (nearestStation === undefined) {
                    nearestStation = stations[0];
                    this.bank.pay(player, 200);
                }
                player.position = nearestStation;
                this.handleSquare(player);
                break;

            default:
                console.warn(`Action de carte inconnue : ${card.action}`);
        }
    }

    bankrupt(player, creditor = null) {
        player.isBankrupt = true;
        this._events.push(`${player.name} est en faillite !`);

        if (creditor) {
            player.properties.forEach(p => {
                p.owner = creditor;
                creditor.properties.push(p);
            });
            creditor.receive(player.money);
            this._events.push(`Les biens de ${player.name} sont transférés à ${creditor.name}`);
        } else {
            player.properties.forEach(p => {
                p.owner = null;
                p.house = 0;
                p.hasHotel = false;
            });
            this.bank.receive(player, player.money);
        }

        player.money = 0;
        player.properties = [];

        const activePlayers = this.players.filter(p => !p.isBankrupt);
        if (activePlayers.length === 1) {
            this.gameOver = true;
            this.winner = activePlayers[0];
            this._events.push(`La partie est terminée ! ${this.winner.name} gagne !`);
        }
    }
}