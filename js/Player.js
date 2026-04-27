class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.position = 0;
    this.money = 1500;
    this.element = null;
  }

  move(steps, board) {
    this.position = (this.position + steps) % board.size;

    const pos = board.getPosition(this.position);

    this.element.style.left = pos.x + "px";
    this.element.style.top = pos.y + "px";
  }
}