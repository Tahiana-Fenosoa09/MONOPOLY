class Board {
  constructor() {
    this.cases = document.querySelectorAll(".case");
    this.size = this.cases.length;

    this.map = [];
    this.initPositions();
  }

  initPositions() {
    this.cases.forEach(el => {
      const index = el.dataset.index;

      const rect = el.getBoundingClientRect();

      this.map[index] = {
        x: rect.left,
        y: rect.top,
        element: el
      };
    });
  }

  getCase(index) {
    return this.map[index];
  }

  getPosition(index) {
    return this.map[index];
  }
}