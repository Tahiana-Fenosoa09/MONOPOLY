import { Square } from "./Square,js";

export class Board {
    constructor(datas) {
        this.squares = this._buildBoard(datas);
    }

    _buildBoard(datas) {
        return datas.map(data => new Square(data))
    }

    getSquare(index) {
        return this.squares[index]
    }

    getSquareIndexByType(type) {
        this.squares.forEach(square => {
            if (square.type == type) {
                return square.index;
            }
        });

        return null;
    }
}