let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let mode = "pvp";

let xScore = 0;
let oScore = 0;

const statusText = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
const winLine = document.querySelector(".win-line");
const clapSound = document.getElementById("clapSound");

const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// ✅ Dark Theme
function toggleTheme() {
    document.body.classList.toggle("dark");
}

// ✅ Mode
function setMode(selectedMode) {
    mode = selectedMode;
    resetGame();
}

// ✅ Main Game Logic
function makeMove(index) {
    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    cells[index].innerHTML = currentPlayer;

    if (checkWin()) {
        statusText.innerHTML = `Player ${currentPlayer} Wins!`;
        clapSound.play();
        gameActive = false;

        if (currentPlayer === "X") {
            xScore++;
            xScoreText.innerHTML = xScore;
        } else {
            oScore++;
            oScoreText.innerHTML = oScore;
        }
        return;
    }

    if (!board.includes("")) {
        statusText.innerHTML = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerHTML = `Player ${currentPlayer} Turn`;

    if (mode === "ai" && currentPlayer === "O") {
        setTimeout(aiMove, 400);
    }
}

// ✅ Simple AI
function aiMove() {
    let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    let move = empty[Math.floor(Math.random() * empty.length)];
    makeMove(move);
}

// ✅ Win Check + Perfect Line
function checkWin() {
    for (let combo of winPatterns) {
        let [a, b, c] = combo;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            drawDynamicLine(a, c);
            return true;
        }
    }
    return false;
}

function drawDynamicLine(start, end) {
    const r1 = cells[start].getBoundingClientRect();
    const r2 = cells[end].getBoundingClientRect();
    const boardRect = document.querySelector(".game-board").getBoundingClientRect();

    let x1 = r1.left + r1.width / 2 - boardRect.left;
    let y1 = r1.top + r1.height / 2 - boardRect.top;

    let x2 = r2.left + r2.width / 2 - boardRect.left;
    let y2 = r2.top + r2.height / 2 - boardRect.top;

    let length = Math.hypot(x2 - x1, y2 - y1);
    let angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    winLine.style.width = length + "px";
    winLine.style.left = x1 + "px";
    winLine.style.top = y1 + "px";
    winLine.style.transform = `rotate(${angle}deg)`;
}

// ✅ Reset Game (Score stays)
function resetGame() {
    board = ["","","","","","","","",""];
    cells.forEach(cell => cell.innerHTML = "");
    winLine.style.width = "0";
    currentPlayer = "X";
    gameActive = true;
    statusText.innerHTML = "Player X Turn";
}
