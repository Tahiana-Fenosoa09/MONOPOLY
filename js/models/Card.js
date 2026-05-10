export class Card {
    constructor(data, cardType) {
        this.id = data.id;
        this.type = cardType;
        this.text = data.text;
        this.action = data.action;
        
        this.value = data.value ?? null;
        this.collect = data.collect ?? null; 
        
        this.houseCost = data.house ?? 0;
        this.hotelCost = data.hotel ?? 0;
    }

}