'use strict'

// debugger
const MINE = '💣'

var gBoard;


var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
var gDifficulty;
function getDifficulty(num) {
    gDifficulty = num;
    initGame()
}

function initGame() {
    gBoard = buildBoard(gDifficulty)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}

function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            if (i === 1 && j === 1 || i === 3 && j === 3) {
                cell.isMine = true

            }
            board[i][j] = cell

        }
    }
    console.table(board);
    return board
}


function setMinesNegsCount(board) {
    var cell;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            cell = { i, j }
            if (board[cell.i][cell.j].isMine === true) continue
            for (var x = cell.i - 1; x <= cell.i + 1; x++) {
                if (x < 0 || x >= board.length) continue;
                for (var k = cell.j - 1; k <= cell.j + 1; k++) {
                    if (x === cell.i && k === cell.j) continue;
                    if (k < 0 || k >= board[x].length) continue;
                    if (board[x][k].isMine === true) {
                        board[cell.i][cell.j].minesAroundCount++

                    }
                }
            }
        }
    }
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            var value = board[i][j].isMine === true ? MINE : board[i][j].minesAroundCount;
            strHTML += `<td class="cell" onclick="cellClicked(${i},${j},this)" >${value}</td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;

}

function placeMine(board) {


}

function cellClicked(i, j, elCell) {
console.log(elCell);
}

function cellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}