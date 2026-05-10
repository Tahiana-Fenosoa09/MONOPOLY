export class Bank {
    constructor(initialMoney = 100000) {
        this.money = initialMoney;
        this.properties = [];
    }

    pay(player, amount) {
        if (this.money < amount) {
            throw new Error("Bank is out of money!");
        }

        this.money -= amount;
        player.receive(amount);
    }

    receive(player, amount) {
        if (player.money < amount) {
            return false;
        }

        player.pay(amount);
        this.money += amount;

        return true;
    }

    sellProperty(player, square) {
        if (player.money < square.price) {
            return false;
        }

        player.pay(square.price);
        this.money += square.price;

        square.owner = player;
        player.addProperty(square);

        return true;
    }
}