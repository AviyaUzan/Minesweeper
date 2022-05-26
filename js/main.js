'use strict';

const FLAG = '🚩'
const BOMB = '💣'
const SMILEY = '😊'
const SAD_SMILEY = '😫'
const WINNER = '🤩'

var gBoard

var gStartTime = 0
var gTimerInt

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    isFirstclick: false,
    lives: 3,
    hints: 3,
};

var gCurrLevel = makeLevel(4, 2, 3)
var gLevel = gCurrLevel

function init() {
    gBoard = creatBoard()
    console.log(gBoard)
    renderBoard(gBoard)
    var elH1 = document.querySelector('h1')
    elH1.innerText = '0.000'

    gGame.isOn = true
}

function creatBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false,
            };
        }
    }
        board = randMines(board);
    return board
}

function randMines(board) {
    var currentTotalMines = gLevel.MINES;
    while (currentTotalMines !== 0) {
        var i = rand(0, gLevel.SIZE)
        var j = rand(0, gLevel.SIZE)
        var currentCell = board[i][j]
        if (!currentCell.isMine) {
            currentCell.isMine = true
            currentTotalMines -= 1
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            console.log('currCell', currCell)

            // for bombs to start after first click ?
            // if (!gGame.isFirstclick) {
                board[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard)

            // }

            var className = 'hidden';
            var tdId = `cell-${i}-${j}`;

            strHTML += `<td 
            id="${tdId}"
            class="cell ${className}"
            onclick="cellclicked(this)" oncontextmenu="cellMarked(this, event)">`;

            if (currCell.isMarked) {
                strHTML += FLAG;
            }

            if (currCell.isShown && currCell.isMine) {
                strHTML += BOMB;
            }

            if (currCell.isShown && currCell.isMine === false) {
                strHTML += currCell.minesAroundCount
            }
            strHTML += `</td>`;
        }
        strHTML += `</tr>`;
    }
    // console.log('strHTML',strHTML)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}
function setMinesNegsCount(cellI, cellJ, gBoard) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;

            if (gBoard[i][j].isMine) neighborsCount++;
        }
    }

    if (neighborsCount === 0) {
        neighborsCount = '';
    }
    // var elCell = document.querySelector('.cell')
// if == 0 elcell.innerText === ''
    // if (neighborsCount === 0) {
    //     elCell.innerText = ' '
    // }

    console.log('neighborsCount', neighborsCount);
    return neighborsCount;
}

function cellclicked(elCell) {

    // if it doesnt have the class hidden so u cant click again
    if (!elCell.classList.contains('hidden')) return;

    if (gGame.isOn === false) return;

    if (gGame.lives === 0) {
        gameOver();
    }

    var cellCoord = getCellCoord(elCell.id);
    // console.log('cellCoord',cellCoord)

    var cell = gBoard[cellCoord.i][cellCoord.j];
    // console.log('cell',cell)

    elCell.classList.remove('hidden');

    if(gBoard.minesAroundCount === 0){
        openMines(cellCoord.i,cellCoord.j, gBoard)
    }

    cell.isShown = true;
    // console.log('cell',cell)

    elCell.innerText = cell.minesAroundCount;

    if (cell.isMine) {
        elCell.innerText = BOMB;
        --gGame.lives;
        var elH2 = document.querySelector('h2');
        elH2.innerText = 'Lives: ' + gGame.lives;
    }
    // active time // should i also add the bomb here? 
    if (!gGame.isFirstclick) {
        gStartTime = Date.now();
        gTimerInt = setInterval(updateTime, 100);
    }

    gGame.isFirstclick = true;

    isVictory();

    if (gGame.lives === 0) {
        gameOver();
    }
}

function updateTime() {
    var currTime = Date.now();
    var time = (currTime - gStartTime) / 1000;

    var fixedTime = financial(time);

    var elh1 = document.querySelector('h1');
    elh1.innerText = fixedTime;
}

function cellMarked(elCell, event) {
    event.preventDefault();

    // if (!gGame.isOn) return;

    var cellCoord = getCellCoord(elCell.id);

    var clickedCell = gBoard[cellCoord.i][cellCoord.j];

    if (clickedCell.isShown) return;

    if (!clickedCell.isMarked && gGame.markedCount === gLevel.MAXFLAGS) {
        return;
    }

    clickedCell.isMarked = !clickedCell.isMarked;

    if (clickedCell.isMarked) {
        elCell.innerHTML = FLAG;
        gGame.markedCount++;
    } else {
        elCell.innerHTML = ''; // or add a class that i can remove later
        gGame.markedCount--;
    }

    console.log(gGame.markedCount);
}

function changeSize(size, mines, flags) {
    gCurrLevel = makeLevel(size, mines, flags);
    gLevel = gCurrLevel;
    var elH2 = document.querySelector('h2');
    elH2.innerText = 'Lives: ' + 3;

    newGame();
}

function gameOver() {
    var elBtnSmiley = document.querySelector('.smiley');
    elBtnSmiley.innerText = SAD_SMILEY;

    gGame.isOn = false;
    clearInterval(gTimerInt);
    gStartTime = 0;
    gGame.isFirstclick = true;
    gGame.lives = 3;
}

function newGame() {
    gGame.isOn = true;
    gGame.lives = 3;
    gGame.isFirstclick = false;
    clearInterval(gTimerInt);

    gStartTime = 0;
    var elBtnSmiley = document.querySelector('.smiley');
    elBtnSmiley.innerText = SMILEY;

    var elH2 = document.querySelector('h2');
    elH2.innerText = 'Lives: ' + 3;

    init();
}

function isVictory() {
    var correctCells = 0;
    var correctMark = 0;
    var mineCells = 0

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];

            if(currCell.isMine) mineCells++

            if (currCell.isMarked && currCell.isMine) {
                // make for all bomb are marked
                correctMark++;
            }

            if (currCell.isShown && !currCell.isMine) correctCells++;
        }
    }
    if (correctMark === gLevel.MINES) return true;
    if (correctMark === gLevel.MINES) return true;
    // if(correctCells.isMarked && correctCells.isMine) return true
    if(mineCells === correctMark) return true


    if (correctCells === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {
        var elBtnSmiley = document.querySelector('.smiley');
        elBtnSmiley.innerText = WINNER;
        clearInterval(gTimerInt);
        return true;
    } else {
        return false;
    }
}

// function openCells() {
//     // to open cells around
//     for(var i = 0 ; i < gBoardlength ; i++){
//         for(var j = 0 ; j < gBorad.length ; j++){
//             var cell =  gBoard[i][j]
//             var cellAmount = cell.minesAroundCount
//             if(cellAmount === 0){
//                 cell.isShown
//             }
//         }
//     }
// }

// if(gBoard.minesAroundCount === 0){
// }


// function openCells(cellI, cellJ, gBoard) {
//     var neighborsCount = 0
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (i === cellI && j === cellJ) continue;
//             if (j < 0 || j >= gBoard[i].length) continue;
//             if (gBoard[i][j].isMine) continue
//             neighborsCount++
//             gBoard[i][i].classList.remove('hidden')
//         }
//     }

// // if == 0 elcell.innerText === ''
//     if (neighborsCount === 0) {
//         // neighborsCount = '';
//     }
// }

// function hints(elHints, cellI, cellJ) {
//     if(!gGame.isOn) return
//     if(gGame.hints === 0) return
//     gGame.hints -- 
//     elHints.innerText = 'Hints: ' + gGame.hints;

//     toggleVisibility(cellI, cellJ, true)
//     setTimeout(() => {
//         toggleVisibility(cellI, cellJ, false)
//     }, 1000)
// }

// function toggleVisibility(cellI, cellJ, toggle) {

//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (i === cellI && j === cellJ) continue;
//             if (j < 0 || j >= gBoard[i].length) continue;
        
//              var minesAroundCount = setMinesNegsCount(i, j, gBoard)
//             var cellCoord = getCellCoord(elCell.id);
//             var cellId = gBoard[cellCoord.i][cellCoord.j];

            
//             if(!gBoard[i][j].isShown) {
                
//                 var elCell = document.getElementById(`${cellId}`)

//             if(toggle) {
//                 elCell.classList.remove('hidden')

//                 if (gBoard[i][j].isMine) {
//                     elCell.innerHTML = MINE
//                     continue;
//             }

//                 elCell.innerHTML = minesAroundCount
//         }else {
//             elCell.classList.add('hidden');
//           elCell.innerHTML = ''
//         }   
//     }
// }
// }
// }