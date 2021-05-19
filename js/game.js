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


function initGame() {
    gBoard = buildBoard()
    setMinesNegsCount(2, 2, gBoard)
    // setMinesNegsCount(gBoard)

    renderBoard(gBoard)
}

function buildBoard() {
    var board = []
    for (var i = 0; i < 4; i++) {
        board.push([])
        for (var j = 0; j < 4; j++) {
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


function setMinesNegsCount(cellI, cellJ, board) {
    console.table(board);
    var minesCountr = 0
    if (board[cellI][cellJ].isMine === true) return
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine === true) {
                board[cellI][cellJ].minesAroundCount++
                continue
            } else {
                minesCountr++
                board[i][j].minesAroundCount+=minesCountr
                console.log(minesCountr);
                minesCountr=0
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
            strHTML += `<td  onclick="cellClicked(${i},${j})" >${value}</td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;

}

function placeMine(board) {


}

function cellClicked(elCell, i, j) {

}

function cellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}