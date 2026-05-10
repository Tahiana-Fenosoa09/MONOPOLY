export class Player {
    constructor(name, color, symbol) {
        this.name = name;
        this.money = 1500;
        this.position = 0;
        this.inJail = false;
        this.turnInJail = 0;
        this.outOfJailCard = 0;
        this.properties = [];
        this.isBankrupt = false;
        this.color = color;
        this.symbol = symbol;
    }

    mapSteps(steps) {
        const map = [];
        for (let i = 0; i < steps; i++) {
            map.push(this.position + i);
        }

        return map;
    }

    move(steps) {
        this.position = (this.position + steps) % 40;
    }

    moveTo(index) {
        this.position = index;
    }

    pay(amount) {
        let state = true

        if (amount > this.money) {
            state = false;
        } else {
            this.money = this.money - amount;
        }

        return state;
    }

    receive(amount) {
        this.money = this.money + amount;
    }

    addProperty(Property) {
        this.properties.push(Property);
    }
}