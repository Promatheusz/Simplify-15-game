// Outline the function that will create the game board
// Numerical values
var dimension = 4;
var gameBoardSize = dimension * dimension;
var moves = 0;
var time_seconds = 0;
// Arrays to store the game board numbers
var gameBoardNumbers = [];
var initialGameBoard = [];
var winningGameBoard = [];

// Return the dimension of the game board
function getDimension(dimension) {
    document.getElementById("dimension").innerText = `${dimension}x${dimension}`;
}

// Create one dimensional array of numbers from 1 to 16
function setNumbers() {
    var numbers = [];
    for (var i = 0; i < gameBoardSize - 1; i++) {
        numbers.push(i + 1);
    }
    numbers.push(""); // Add an empty cell
    var twoDimensionalArray = [];
    for (var i = 0; i < dimension; i++) {
        twoDimensionalArray[i] = [];
        for (var j = 0; j < dimension; j++) {
            twoDimensionalArray[i][j] = numbers[i * dimension + j];
        }
    }
    return twoDimensionalArray;
}

// Shuffle 2D array with the numbers in random orders
function shuffleNumbers() {
    var flatArray = gameBoardNumbers.flat();
    for (var i = flatArray.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var temp = flatArray[i];
        flatArray[i] = flatArray[randomIndex];
        flatArray[randomIndex] = temp;
    }
    for (var i = 0; i < dimension; i++) {
        for (var j = 0; j < dimension; j++) {
            gameBoardNumbers[i][j] = flatArray[i * dimension + j];
        }
    }
}

// Create the game board with 16 cells
function setGameBoard() {
    let board = document.getElementById("game-board");
    board.innerHTML = "";
    for (let i = 0; i < dimension; i++) {
        let row = board.insertRow(i);
        for (let j = 0; j < dimension; j++) {
            let cell = row.insertCell(j);
            let number = gameBoardNumbers[i][j];
            cell.innerHTML = number;
            if (number === "") {
                cell.classList.add("empty");
            } else {
                cell.classList.remove("empty");
            }
            cell.addEventListener("click", handleCellClick); // Add event listener to each cell
        }
    }
}

// New game button
function startGame() {
    // Reset timer
    resetTime();
    getDimension(dimension);
    // Reset moves
    moves = 0;
    document.getElementById("moveCount").innerText = moves;
    // Filling the game board with numbers
    gameBoardNumbers = setNumbers();
    shuffleNumbers();
    // Display the game board
    initialGameBoard = gameBoardNumbers.map(arr => arr.slice()); // Store the initial state of the game board as a deep copy
    setGameBoard();
    startTime();
    if (isGameSolved()) {
        document.getElementById("status").innerText = "Congratulations! You have solved the puzzle!";
    }
}
// Reset game button
function resetGame() {
    gameBoardNumbers = initialGameBoard.map(arr => arr.slice()); // Deep copy of initialGameBoard
    setGameBoard();
    // Reset moves
    moves = 0;
    document.getElementById("moveCount").innerText = moves;
    // Reset timer
    resetTime();
    startTime(); // Start the timer again
}
// Handle cell click event
function handleCellClick(event) {
    let cell = event.target;
    let row = cell.parentNode.rowIndex;
    let col = cell.cellIndex;
    moveCell(row, col);
}

// Move the clicked cell to the empty cell if they are adjacent
function moveCell(row, col) {
    let emptyCell = findEmptyCell();
    if (isMovePossible(row, col, emptyCell.row, emptyCell.col)) {
        // Swap the clicked cell with the empty cell
        gameBoardNumbers[emptyCell.row][emptyCell.col] = gameBoardNumbers[row][col];
        gameBoardNumbers[row][col] = "";
        // Update the game board
        setGameBoard();
        moves++;
        document.getElementById("moveCount").innerText = moves;
    }
}

// Find the position of the empty cell
function findEmptyCell() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (gameBoardNumbers[i][j] === "") {
                return { row: i, col: j };
            }
        }
    }
}

// Check if the move is possible (i.e., the clicked cell is adjacent to the empty cell)
function isMovePossible(row, col, emptyRow, emptyCol) {
    return (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
           (col === emptyCol && Math.abs(row - emptyRow) === 1);
}

// Check if the game is solved
winningGameBoard = setNumbers();
function isGameSolved() {
    return JSON.stringify(gameBoardNumbers) === JSON.stringify(winningGameBoard);
}

// Measure time
var timerInterval;

function startTime() {
    clearInterval(timerInterval); // Clear any existing interval
    timerInterval = setInterval(() => {
        time_seconds++;
        document.getElementById("timer").innerText = time_seconds;
    }, 1000);
}

function resetTime() {
    clearInterval(timerInterval); // Clear the interval when resetting the time
    time_seconds = 0;
    document.getElementById("timer").innerText = time_seconds;
}