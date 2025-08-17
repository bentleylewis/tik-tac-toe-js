// store gameboard as array inside of a gameboard object - wrap in iife since we don't need additional instances
//TODO: maybe we can add user choices for pfp of funny cat images ?? 
const boardDiv = document.getElementById("board");
const turnDiv = document.getElementById("turn");
const scoreOneDiv = document.getElementById("user-one-score");
const scoreTwoDiv = document.getElementById("user-two-score");
const playAgainButton = document.getElementById("play-again-button");

let gameActive = true;

const whosThatCatSrc = 'Images/starting-cell-div.jpg';
const startImage = 'Images/loaf-cat.jpg';
const userOneImageSrc = 'Images/cat-user-1.jpg';
const userTwoImageSrc = 'Images/cat-user-2.jpg';
const drawCatImageSrc = 'Images/draw-cat.jpg';

const userOne = createUser("eepy kitty", 'x', userOneImageSrc);
const userTwo = createUser('goofy kitty', 'o', userTwoImageSrc);

boardDiv.textContent = "";

// iife function, create one instance of gameboard, create 3x3 array of arrays
const gameboard = (()  => {
    let grid = [];
    for (let i=0; i < 3; i++) {
        let row = [];
        for(let j=0; j < 3; j++) {
            row.push(''); // each cell init with empty string
        }
        grid.push(row);
    }

    return {
        getGrid: () => {
            return grid;
        },
        // return value inside cell
        getCell: (r, c) => {
            return grid[r][c];
        },
        // set cell if no value
        setCell: (r, c, symbol) => {
            grid[r][c] = symbol;

            
        },
        // reset gameboard values
        reset: () => {
            for(let i=0; i<3; i++) {
                for (let j=0; j<3; j++){
                    grid[i][j] = '';
                }
            }
        }
    }
})();


// players are stored in objects - "what a player is"
function createUser (name, symbol, image) {
    return {
        name, 
        symbol,
        image,
        score: 0,
        isTurn: false,
    }
}

// control flow of game with object - "how the game runs"

const gameController = (function () {
    let currentPlayer = userOne;
    return {

        switchPlayer: () => {
            currentPlayer = (currentPlayer === userOne) ? userTwo : userOne;
        },

        isAvailable: function(rowIndex, columnIndex) {
            const checkedCell = gameboard.getCell(rowIndex, columnIndex);
            if (checkedCell === '') {
                return true;
            }
                else {
                return false;            
            };
        },

        writeToGrid: function(rowIndex, columnIndex, gridImage) {
            gridImage.classList.remove('startingImage');
            gameboard.setCell(rowIndex, columnIndex, currentPlayer.symbol);
            gridImage.src = currentPlayer.image;
            gridImage.alt = `${currentPlayer.name}'s marker`;

        },

        checkWin: function (flatGrid) {
            const winConditions = [
               [0, 1, 2], [3, 4, 5], [6, 7, 8],
                
               [0, 3, 6], [1, 4, 7], [2, 5, 8],
    
               [0, 4, 8], [2, 4, 6]
                ];
            // Loop through each element in the winConditions array, and assign each one in turn to the variable condition (for... of loop)
            for (let conditions of winConditions) {
                const [a, b, c] = conditions;
                if (
                    flatGrid[a] === currentPlayer.symbol &&
                    flatGrid[b] === currentPlayer.symbol &&
                    flatGrid[c] === currentPlayer.symbol
                ) {
                    return true; 
                }
            }
            return false; 

        },
        checkDraw: function (flatGrid) {
            for (let i = 0; i < flatGrid.length; i++) {
                if (flatGrid[i] === '') {
                    return false;
                }
            }
            return true;
        },

        checkGameOver: function (grid) {
            const flatGrid = grid.flat();
            if (this.checkWin(flatGrid) === true) {
                return 'win';
            }
            else if (this.checkDraw(flatGrid) === true) {
                return 'draw';
            }
            return 'continue';
    },

        resetGame: function () {
            currentPlayer = userOne;
            turnDiv.innerHTML =`<div class='score-html-container'>It is ${currentPlayer.name}'s turn, Begin!<img class="scoreImage"></img></div>`;
            const turnImg = turnDiv.querySelector('img');
            turnImg.src = currentPlayer.image;
            gameActive = true;
            gameboard.reset();

        },

        playTurn: function (rowIndex, columnIndex, gridImage) {
            if (gameActive === false) {
                return;
            }
            else {
            if(gameController.isAvailable(rowIndex, columnIndex) === true) {
            gameController.writeToGrid(rowIndex, columnIndex, gridImage);
            let result = gameController.checkGameOver(gameboard.getGrid());
            if (result === 'win') {
                turnDiv.innerHTML =`<div class='score-html-container'>${currentPlayer.name} Wins! <img class="scoreImage"></img></div>`;
                const winImg = turnDiv.querySelector('img');
                winImg.src = currentPlayer.image;
                gameActive = false;
            }
            else if (result === 'draw') {
                turnDiv.innerHTML = `<div class='score-html-container'>It's a Draw...<img class="scoreImage"></img></div>`;
                const DrawImg = turnDiv.querySelector('img');
                DrawImg.src = drawCatImageSrc;
                gameActive = false;
            } 
            else {
            gameController.switchPlayer();
            turnDiv.innerHTML =`<div class='score-html-container'>It is ${currentPlayer.name}'s turn!<img class="scoreImage"></img></div>`;
            const turnImg = turnDiv.querySelector('img');
            turnImg.src = currentPlayer.image;
                }
            
            }
        }
        }
    }
})();

const displayController = (function () {
   for(let i=0; i < 3; i++) {
       for (let j=0; j < 3; j++) {
         let cellDiv = document.createElement('div');
         cellDiv.classList.add('cell');
         cellDiv.dataset.row = i;
         cellDiv.dataset.column = j;

         const gridImage = document.createElement("img");
         gridImage.classList.add('gridImage');
         gridImage.src = startImage;
         gridImage.alt = 'unclaimed square image';
         gridImage.classList.add('startingImage');

         cellDiv.addEventListener("click", () => {
            const rowIndex = Number(cellDiv.dataset.row); 
            const columnIndex = Number(cellDiv.dataset.column);
            gameController.playTurn(rowIndex, columnIndex, gridImage);
            console.log(gameboard.getGrid());
         });
         cellDiv.appendChild(gridImage);
         boardDiv.appendChild(cellDiv);
       }
    }
    playAgainButton.addEventListener("click", () => {
        const collectedCells = boardDiv.querySelectorAll(".gridImage");
        collectedCells.forEach((image) => {
            image.classList.add('startingImage');
            image.src = startImage;
        });
        gameController.resetGame();
    })
})();