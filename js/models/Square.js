export class Square {
  constructor(data) {
    this.owner = null;
    this.index = data.index;
    this.name = data.name;
    this.type = data.type;
    this.price = data.price ?? null;
    this.amount = data.amount ?? null;
    this.rent = data.rent ?? null;
    this.group = data.group ?? null;
    this.house = 0;
    this.housePrice = data.housePrice ?? null;
    this.hasHotel = false;
    this.multipliers = data.multipliers ?? null;
  }

  moneyDue() {
    return this.amount ? this.amount : this.price;
  }

  calculateRent() {
     if (this.type !== "property") {
        return;
    }

    if (this.hasHotel) {
        return this.rent.hotel;
    }

    switch (this.house) {
        case 0:
            return this.rent.base;
        case 1:
            return this.rent.house1;
        case 2:
            return this.rent.house2;
        case 3:
            return this.rent.house3;
        case 4:
            return this.rent.house4;
        default:
            return this.rent.base;
    }
  }

    calculateRentStation(ownedStations) {
        return this.rent[ownedStations - 1];
    }

    calculatePriceUtility(numberDice, ownedUtilities) {
        return numberDice * this.multipliers[ownedUtilities - 1];
    }

  buildHouse() {
        if (this.type !== "property") {
            return;
        }

        if (this.hasHotel) {
            throw new Error("Maximum level reached: Hotel already built.");
            return;
        }

        if (this.house < 4) {
            this.house++;
        } else {
            this.house = 0;
            this.hasHotel = true;
        }

        return this.housePrice;
    }

    destroyHouse() {
        if (this.type !== "property") {
            return;
        }

        if (this.house <= 0 && !this.hasHotel) {
            throw new Error("Minimum level reached: Nothing to destroy.");
        }

        if (this.hasHotel) {
            this.hasHotel = false; 
            this.house = 4; 
        } else {
            this.house--;
        }
    }
}
