'use strict'

const MINE = '💣'
const FACE1 = '🙂'
const FACE2 = '😲'
const FACE3 = '😖'
const WIN_FASE = '🥳'
const LOSE_FACE = '☠️'
const LIVE = '❤️'
const EMPTY_LIVE = '🤍'
const MARK = '🚩'
const HINT = '❓'
const NO_HINT = '❌'



var gBoard;
var gTimer;
var gIsHint=false

var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 2,
    hints:3,
    hitMines: 0
};

function getDifficulty(size, mines) {
    gLevel.size = size;
    gLevel.mines = mines
    numLives()
    initGame()
}

function initGame() {
    gBoard = buildBoard(gLevel.size)
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
            board[i][j] = cell
        }
    }
    console.table(board);
    return board
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            var value = '';
            if (board[i][j].isMarked) {
                value = MARK
            } else {
                if (board[i][j].isShown === true && board[i][j].isMarked === false) {
                    var className = 'shown'
                    if (board[i][j].isMine === true) {
                        value = MINE
                    } else if (board[i][j].minesAroundCount === 0) {
                        value = ''
                    } else {
                        value = board[i][j].minesAroundCount
                    }
                } else {
                    className = ''
                }
            }
            strHTML += `<td oncontextmenu="cellMarked(${i},${j},this,)" class="${className}" onclick="cellClicked(${i},${j},this)" >${value}</td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
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

function placeMine(board) {
    var mines = gLevel.mines
    while (mines > 0) {
        var i = getRandomInt(0, board.length - 1)
        var j = getRandomInt(0, board.length - 1)
        if (board[i][j].isMine === true || gBoard[i][j].isShown) continue
        board[i][j].isMine = true
        mines--
    }
}

function cellClicked(i, j, elCell) {
    if (gGame.secsPassed === 0) {
        var elSpan = document.querySelector('div span')
        gTimer = setInterval(function () {
            gGame.secsPassed += 0.008
            elSpan.innerText = gGame.secsPassed.toFixed(0)
        }, 10)
        gBoard[i][j].isShown = true
        gGame.shownCount++
        placeMine(gBoard)
        setMinesNegsCount(gBoard)
        expandShown(gBoard, i, j)
        renderBoard(gBoard)

    }
    if (gBoard[i][j].isMarked || gBoard[i][j].isShown || !gGame.isOn) return
    if (gBoard[i][j].isMine === true) {
        gGame.hitMines++
        gGame.markedCount--
        checkGameOver()
    }

    gBoard[i][j].isShown = true
    renderBoard(gBoard)
    gGame.shownCount++
    if (gBoard[i][j].minesAroundCount === 0 && gBoard[i][j].isMine === false) expandShown(gBoard, i, j)

    var value = gBoard[i][j].isMine === true ? MINE : gBoard[i][j].minesAroundCount;
    elCell.innerText = value
    checkWin()
}

function cellMarked(i, j, elCell) {
    window.oncontextmenu = (e) => {
        e.preventDefault();
    }
    if (gGame.secsPassed === 0) {
        var elSpan = document.querySelector('div span')
        gTimer = setInterval(function () {
            gGame.secsPassed += 0.008
            elSpan.innerText = gGame.secsPassed.toFixed(0)
        }, 10)
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        elCell.innerText = MARK
        placeMine(gBoard)
        setMinesNegsCount(gBoard)
        expandShown(gBoard, i, j)
        renderBoard(gBoard)
    }
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMarked === false) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        elCell.innerText = MARK
    } else if (gBoard[i][j].isMarked === true) {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        elCell.innerText = ''
    }
    checkWin()
}

function expandShown(board, cellI, cellJ) {
    if (board[cellI][cellJ].minesAroundCount === 0) {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (i === cellI && j === cellJ) continue;
                if (j < 0 || j >= board[i].length) continue;
                if (gBoard[i][j].isMarked === true || gBoard[i][j].isShown) continue
                gBoard[i][j].isShown = true
                gGame.shownCount++
                expandShown(board, i, j)
            }
        }
        renderBoard(board)
    }
}

function checkWin() {
    if (gGame.isOn === true) {
        console.log(gGame.markedCount + gGame.hitMines);
        console.log(gLevel.mines - gGame.hitMines);
        console.log(gGame.shownCount);
        var shownCells = gLevel.size ** 2 - gLevel.mines + gGame.hitMines
        console.log(shownCells);
        if (gGame.markedCount + gGame.hitMines === (gLevel.mines - gGame.hitMines) && gGame.shownCount === shownCells) {
            var elBtn = document.querySelector('.button1')
            elBtn.style.backgroundColor = 'rgb(95, 212, 27)'
            elBtn.innerText = WIN_FASE
            clearInterval(gTimer)
            gGame.isOn = false
        }   
    }
}

function checkGameOver() {
    var elSpan = document.querySelector('h2 span')
    var elBtn = document.querySelector('.button1')
    if (gLevel.mines === 2) {
        if (gGame.lives === 2) {
            gGame.lives--
            elBtn.style.backgroundColor = 'red'
            elBtn.innerText = FACE3
            elSpan.innerText = LIVE + EMPTY_LIVE
        } else if (gGame.lives === 1) {
            elSpan.innerText = EMPTY_LIVE + EMPTY_LIVE
            elBtn.innerText = LOSE_FACE
            clearInterval(gTimer)
            gGame.isOn = false
            var elBtnRestart = document.querySelector('.button1')
            elBtnRestart.style.backgroundColor = 'black'
            showAllMines()
        }
    } else {
        if (gGame.lives === 3) {
            gGame.lives--
            elSpan.innerText = LIVE + LIVE + EMPTY_LIVE
            elBtn.style.backgroundColor = 'yellow'
            elBtn.innerText = FACE2
        } else if (gGame.lives === 2) {
            gGame.lives--
            elBtn.style.backgroundColor = 'red'
            elBtn.innerText = FACE3
            elSpan.innerText = LIVE + EMPTY_LIVE + EMPTY_LIVE
        } else if (gGame.lives === 1) {
            elSpan.innerText = EMPTY_LIVE + EMPTY_LIVE + EMPTY_LIVE
            elBtn.innerText = LOSE_FACE
            clearInterval(gTimer)
            gGame.isOn = false
            var elBtnRestart = document.querySelector('.button1')
            elBtnRestart.style.backgroundColor = 'black'
            showAllMines()
        }
    }
}
// function revealCells(elSpan) {
//     elSpan.innerText=NO_HINT
//     gIsHint=true
// }

function restart() {
    var elSpan = document.querySelector('div span')
    elSpan.innerText = 0
    numLives()
    clearInterval(gTimer)
    var elBtnRestart = document.querySelector('.button1')
    elBtnRestart.style.backgroundColor = 'white'
    elBtnRestart.innerText = FACE1
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.hitMines = 0
    initGame()
}
function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
                renderBoard(gBoard)
            }
        }
    }
}

function numLives() {
    if (gLevel.mines > 3) {
        gGame.lives = 3
        var elSpan = document.querySelector('h2 span')
        elSpan.innerText = LIVE + LIVE + LIVE
    } else if (gLevel.mines < 3) {
        gGame.lives = 2
        var elSpan = document.querySelector('h2 span')
        elSpan.innerText = LIVE + LIVE
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}