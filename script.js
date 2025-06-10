
const board = document.getElementById('board');
const turnDisplay = document.getElementById('turnDisplay');
const winMessage = document.getElementById('winMessage');
const winText = document.getElementById('winText');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
let playVsAI = document.getElementById('playVsAI').checked;
let difficulty = document.getElementById('difficulty').value;

let cells, currentPlayer, gameActive, scores;

function initGame() {
    board.innerHTML = '';
    cells = [];
    currentPlayer = 'X';
    gameActive = true;
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
        cells.push(null);
    }
    turnDisplay.textContent = `Turn: Player ${currentPlayer}`;
    if (!scores) scores = { X: 0, O: 0 };
}

function handleClick(e) {
    const index = e.target.dataset.index;
    if (!gameActive || cells[index]) return;
    makeMove(index, currentPlayer);
    if (checkWinner(currentPlayer)) {
        endGame(currentPlayer);
        return;
    }
    if (cells.every(c => c)) {
        endGame('Draw');
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnDisplay.textContent = `Turn: Player ${currentPlayer}`;

    if (playVsAI && currentPlayer === 'O') {
        setTimeout(() => {
            const aiMove = getAIMove();
            makeMove(aiMove, 'O');
            if (checkWinner('O')) {
                endGame('O');
                return;
            }
            if (cells.every(c => c)) {
                endGame('Draw');
                return;
            }
            currentPlayer = 'X';
            turnDisplay.textContent = `Turn: Player X`;
        }, 500);
    }
}

function makeMove(index, player) {
    cells[index] = player;
    const cell = board.children[index];
    cell.textContent = player;
    cell.classList.add(player);
}

function getAIMove() {
    const emptyIndices = cells.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (difficulty === 'easy') {
        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
    // Hard: center > corner > random
    if (cells[4] === null) return 4;
    const corners = [0, 2, 6, 8].filter(i => cells[i] === null);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => 
        pattern.every(index => cells[index] === player)
    );
}

function endGame(winner) {
    gameActive = false;
    if (winner === 'Draw') {
        winText.textContent = "It's a Draw!";
    } else {
        winText.textContent = `Player ${winner} Wins!`;
        scores[winner]++;
        scoreX.textContent = `Player X: ${scores.X}`;
        scoreO.textContent = `Player O: ${scores.O}`;
    }
    winMessage.classList.remove('hidden');
}

function restartGame() {
    winMessage.classList.add('hidden');
    initGame();
}

function resetGame() {
    scores = { X: 0, O: 0 };
    scoreX.textContent = "Player X: 0";
    scoreO.textContent = "Player O: 0";
    restartGame();
}

document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !gameActive) {
        restartGame();
    }
});

document.getElementById('playVsAI').addEventListener('change', e => {
    playVsAI = e.target.checked;
    restartGame();
});

document.getElementById('difficulty').addEventListener('change', e => {
    difficulty = e.target.value;
});

initGame();




