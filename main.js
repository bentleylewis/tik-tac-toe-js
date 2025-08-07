// store gameboard as array inside of a gameboard object - wrap in iife since we don't need additional instances
//TODO: maybe we can add user choices for pfp of funny cat images ?? 
const boardDiv = document.getElementById("board");
const turnDiv = document.getElementById("turn");

// Use whosThatCatSrc if you're feeling goofy. 

const whosThatCatSrc = 'Images/starting-cell-div.jpg';
const startImage = 'Images/loaf-cat.jpg';
const userOneImageSrc = 'Images/cat-user-1.jpg';
const userTwoImageSrc = 'Images/cat-user-2.jpg';

const userOne = createUser("playerOne", 'x', userOneImageSrc);
const userTwo = createUser('playerTwo', 'o', userTwoImageSrc);

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
        // TODO: add checking wherever we are calling this method, will likely be a comparison after out getCell
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
        isTurn: false,
    }
}

// control flow of game with object - "how the game runs"

const gameController = (function () {
    let currentPlayer = userOne;
    return {

        start: () => {
            gameboard.reset();
        },

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

        checkWin: function (grid) {
            const winConditions = [
               [0, 1, 2], [3, 4, 5], [6, 7, 8],
                
               [0, 3, 6], [1, 4, 7], [2, 5, 8],
    
               [0, 4, 8], [2, 4, 6]
                ];
            // Loop through each element in the winConditions array, and assign each one in turn to the variable condition (for... of loop)
            const flatGrid = grid.flat();
            for (let conditions of winConditions) {
                const [a, b, c] = conditions;
                if (
                    flatGrid[a] === currentPlayer.symbol &&
                    flatGrid[b] === currentPlayer.symbol &&
                    flatGrid[c] === currentPlayer.symbol
                ) {
                    console.log(`${currentPlayer.name} wins!`);
                    return;
                }
            }

        },

        writeToGrid: function(rowIndex, columnIndex, gridImage) {
            gridImage.classList.remove('startingImage');
            gameboard.setCell(rowIndex, columnIndex, currentPlayer.symbol);
            gridImage.src = currentPlayer.image;
            gridImage.alt = `${currentPlayer.name}'s marker`;

        },

        resetGame: function () {
            gameboard.reset();

        },

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

            if(gameController.isAvailable(rowIndex, columnIndex) === true) {
            gameController.writeToGrid(rowIndex, columnIndex, gridImage);
            gameController.checkWin(gameboard.getGrid());
            gameController.switchPlayer();
            }
            console.log(gameboard.getGrid());
         });
         cellDiv.appendChild(gridImage);
         boardDiv.appendChild(cellDiv);
       }
    }
//TODO: maybe here we can make the box outline or something for when isAvailable returns false
})();