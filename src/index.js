
const rows = 29;
const cols = 60;

let playing = false;
let gameState = buildGameState();

const Board = document.getElementById('Board');

const btnPlay = document.getElementById('playButton');
const iconBtnPlay = document.getElementById('iconPlayButton');

const btnErase = document.getElementById('eraseButton');
const btnRandom = document.getElementById('randomButton');

window.addEventListener('load', async (e) => {

    render(gameState);
    while (true) {
        await sleep(100);
        if (playing) {
            update();
        }
    }
});

btnPlay.addEventListener('click', () => {
    if (playing == false) {
        playing = true;
        iconBtnPlay.className = 'bi bi-pause-circle-fill icon';
    } else {
        playing = false;
        iconBtnPlay.className = 'bi bi-play-circle-fill icon';
    }
});

btnErase.addEventListener('click', () => {
    gameState = buildGameState(true);
    render(gameState);
});

btnRandom.addEventListener('click', () => {
    gameState = buildGameState(false);
    render(gameState);
});

function update() {
    gameState = nextGameState(gameState);
    render(gameState);
}

function buildGameState(justZeros = false) {
    if (justZeros) {
        return new Array(rows).fill(null)
        .map(() => new Array(cols).fill(0));
    } else {
        return new Array(rows).fill(null)
        .map(() => new Array(cols).fill(null)
        .map(() => Math.floor(Math.random() * 2)));
    }
}

function nextGameState(gameState) {
    const nextGameState = gameState.map(arr => [...arr]);
    
    for (let row = 0; row < gameState.length; row++) {
        for (let col = 0; col < gameState[row].length; col++) {
            const cell = gameState[row][col];
            let numNeighbours = 0;
            
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    const x_cell = col + i;
                    const y_cell = row + j;
                    
                    if (x_cell >= 0 && y_cell >= 0 && x_cell < cols && y_cell < rows) {
                        const currentNeighbor = gameState[row + j][col + i];
                        numNeighbours += currentNeighbor;
                    }
                }
            }
            
            if (cell === 1 && numNeighbours < 2) {
                nextGameState[row][col] = 0;
            } else if (cell === 1 && numNeighbours > 3) {
                nextGameState[row][col] = 0;
            } else if (cell === 0 && numNeighbours === 3) {
                nextGameState[row][col] = 1;
            }
        }
    }
    return nextGameState;
}

function render(gameState) {
    document.getElementById('Board').innerHTML = "";
    for (let row = 0; row < rows; row++) {
        createRow(row);
        for (let col = 0; col < cols; col++) {
            const cell = gameState[row][col];
            createCell(row, col, cell);
            
        }
    }
}

function createRow(id) {
    let newRow = document.createElement('div');
    newRow.className = 'Row'
    newRow.id = `Row-${id}`;
    
    document.getElementById('Board').appendChild(newRow);
}

function createCell(idRow, idCol, valueCell) {
    let newCell = document.createElement('div');
    newCell.className = `Cell ${valueCell == 1 ? 'alive' : ''}`;
    newCell.id = `Cell-${idRow},${idCol}`;
    newCell.onclick = () => changeCellState(idRow, idCol);
    
    document.getElementById(`Row-${idRow}`).appendChild(newCell);
}

function changeCellState(idRow, idCol) {
    const cell = gameState[idRow][idCol];
    
    if (cell == 1) {
        gameState[idRow][idCol] = 0;
        document.getElementById(`Cell-${idRow},${idCol}`).className = `Cell`;
    } else if (cell == 0) {
        gameState[idRow][idCol] = 1;
        document.getElementById(`Cell-${idRow},${idCol}`).className = `Cell alive`;
    }
}

async function sleep(miliseconds) {
    return new Promise((resolve) => setTimeout(resolve, miliseconds));
}