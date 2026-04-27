class Game {
  constructor(players, board, cards) {
    this.players = players;
    this.board = board;
    this.cards = cards;
    this.currentPlayerIndex = 0;
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  nextTurn() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
  }

  rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  playTurn() {
    const player = this.currentPlayer;
    const dice = this.rollDice();

    console.log(`${player.name} fait ${dice}`);

    player.move(dice, this.board);

    const caseData = this.board.getCase(player.position);
    this.handleCase(player, caseData);

    this.nextTurn();
  }

handleCase(player, caseData) {
  switch (caseData.type) {

    case "property":
      console.log("Terrain acheté ou disponible");
      break;

    case "tax":
      player.money -= caseData.amount;
      break;

    case "chance":
      const card = this.cards.draw("chance");
      this.applyCard(player, card);
      break;

    case "start":
      player.money += 200;
      break;
  }
}
}