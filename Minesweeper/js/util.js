'use strict'

function rand(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

function financial(x) {
    return Number.parseFloat(x).toFixed(3); // to get 3 nums after the '.'
  }

  function makeLevel(size, mines, flags) {
      gGame.lives = 3
    var level = {
        SIZE: size,
        MINES: mines,
        MAXFLAGS: flags,
    };
    return level;
}