export class Dice {
    constructor(){

    }

    roll() {
        return Math.floor(Math.random() * 6) + 1;
    }
}