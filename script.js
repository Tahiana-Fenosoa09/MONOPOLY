function createGame(){
    let userName = [];
    const createtheGame = document.querySelector("#player-info-button");
    const beginingSection = document.querySelector(".begining-section");
    const gameSection = document.querySelector(".game-section");
    const allPlayername = document.querySelector(".all-players-default");
    const stockButton = document.querySelector(".stock-gestion-default");
    const logo = document.querySelector(".monopoly-logo");
    const rollDice = document.querySelector(".roll-dice-default");

    function showPlayerinfo(){
        const nextButton = document.querySelector("#begining-button");
        const playerInfocard = document.querySelector(".player-info-defaulthide");
        const beginingCard = document.querySelector(".begining-card");
        const waitingAnimation = document.querySelector(".load-animation-default");

        
        nextButton.addEventListener("click",() => {
            playerInfocard.addEventListener("submit",(e) => {
            e.preventDefault();
            })
            waitingAnimation.classList.add("load-animation");
            beginingCard.classList.add("begining-card-hide");     
            setTimeout(() => {
                waitingAnimation.classList.remove("load-animation")
            },2000)
            setTimeout(() => {
                playerInfocard.classList.add("player-info");
                const playerNumber =  getPlayerNumber();
                for(let i = 0; i < playerNumber; i ++){
                    createInputname();
                }
            },2100)
        })
    }

    function getPlayerNumber(){
        const playerNumber = document.querySelector("#selectOption");
        const selectedIndex = playerNumber.selectedIndex;
        return Number(playerNumber[selectedIndex].value);
    }

    function createInputname(){
        const inputContainer = document.createElement("div");
        const inputName = document.createElement("input");
        const inputGrid = document.querySelector(".player-inputs");
        inputName.classList.add("all-input");
        inputName.placeholder = "Enter player pseudo";
        inputContainer.classList.add("input-container");
        inputContainer.appendChild(inputName);
        inputGrid.appendChild(inputContainer);
    }
    showPlayerinfo()
    createtheGame.addEventListener("click",() => {
        const inputs = document.querySelectorAll(".all-input");
        const waitingAnimation = document.querySelector(".load-animation-default");
        const playerInfo = document.querySelector(".player-info-defaulthide");
        inputs.forEach((e) => {
            userName.push(e.value);
        })
        waitingAnimation.classList.add("load-animation");
        playerInfo.classList.remove("player-info");
        setTimeout(() => {
            waitingAnimation.classList.remove("load-animation")
        },2000)
        setTimeout(() => {
        beginingSection.classList.add("begining-section-remove");
        gameSection.classList.add("game-section-show");
        stockButton.classList.add("stock-gestion");
        allPlayername.classList.add("all-players");
        logo.classList.add("monopoly-logo-hide");
        rollDice.classList.add("roll-dice");
        showUsername(userName);
        },2100);
    })
}

function rollDice(){
    const rollButton = document.querySelector(".roll-button");
    const diceNumbers = [1,2,3,4,5,6];
    const displayNumber1 = document.querySelector(".dice-number");
    const displayNumber2 = document.querySelector(".dice-number2");
    const displayFace = document.querySelector("#dice-icon");
    const displayFace2 = document.querySelector("#dice-icon2");
    const getRandom = (number) => {
        return Math.floor(Math.random() * number);
    }
    let randomNumber1 = diceNumbers[getRandom(diceNumbers.length)];
    let randomNumber2 = diceNumbers[getRandom(diceNumbers.length)];

    rollButton.addEventListener("click", () => {
        displayNumber1.textContent = randomNumber1;
        displayNumber2.textContent = randomNumber2;
        if(randomNumber1 == 1 ){
             displayFace.className = "fa-solid fa-dice-one fa-xl"
        }
        else if(randomNumber1 == 2 ){
             displayFace.className = "fa-solid fa-dice-two fa-xl"
        }
        else if(randomNumber1 == 3){
             displayFace.className = "fa-solid fa-dice-three fa-xl"
        }
        else if(randomNumber1 == 4 ){
             displayFace.className = "fa-solid fa-dice-four fa-xl"
        }
        else if(randomNumber1 == 5 ){
             displayFace.className = "fa-solid fa-dice-five fa-xl"
        }
        else if(randomNumber1 == 6 ){
            displayFace.className = "fa-solid fa-dice-six fa-xl"
        }


        if(randomNumber2 == 1 ){
             displayFace2.className = "fa-solid fa-dice-one fa-xl"
        }
        else if(randomNumber2 == 2 ){
             displayFace2.className = "fa-solid fa-dice-two fa-xl"
        }
        else if(randomNumber2 == 3){
             displayFace2.className = "fa-solid fa-dice-three fa-xl"
        }
        else if(randomNumber2 == 4 ){
             displayFace2.className = "fa-solid fa-dice-four fa-xl"
        }
        else if(randomNumber2 == 5 ){
             displayFace2.className = "fa-solid fa-dice-five fa-xl"
        }
        else if(randomNumber2 == 6 ){
            displayFace2.className = "fa-solid fa-dice-six fa-xl"
        }
        return [randomNumber1,randomNumber2]; 

    })
}

function stockSystem(){
    function stock(){
        const stockCard = document.querySelector(".stock-app-default");
        const stockButton = document.querySelector(".stock-button");
        const exitStock = document.querySelector(".exit-stock");
        stockButton.addEventListener("click", () => {
            stockCard.classList.add("stock-app");
        });
        exitStock.addEventListener("click", () => {
            stockCard.classList.remove("stock-app");
        })
    }
    stock();
}

function showUsername(users){
    const playerGrid = document.querySelector(".player-grid");
    function createH3(text){
        const h3 = document.createElement("h3");
        h3.textContent = text;
        playerGrid.appendChild(h3);
    }
    const allUser = users;
    allUser.forEach((e) => {
        createH3(e);
    })
}

stockSystem();
rollDice();

createGame();