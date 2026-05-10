import { Card } from "./Card.js";

export class CardDeck {
    constructor(cardsData) {
        this.chanceDeck = [];
        this.communityDeck = [];

        this._init(cardsData);
    }

    _init(cardsData) {
        this.chanceDeck = cardsData.chance.map(
            c => new Card(c, "chance")
        );

        this.communityDeck = cardsData.community.map(
            c => new Card(c, "community")
        );

        this.shuffle(this.chanceDeck);
        this.shuffle(this.communityDeck);
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    drawChance() {
        if (this.chanceDeck.length === 0) {
            return null;
        }

        return this.chanceDeck.pop();
    }

    drawCommunity() {
        if (this.communityDeck.length === 0) {
            return null;
        }

        return this.communityDeck.pop();
    }
}