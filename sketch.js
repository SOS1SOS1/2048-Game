
/*
  Game: 2048
  Author: Shanti Mickens
  Date: 2-10-2020

  Next Steps -
    * maybe keep track of score
*/

let game_board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

let blockColors = [
  '#b3f7f4',  // 2
  '#8fcadd',  // 4
  '#45a3ff',  // 8
  '#bcaade',  // 16
  '#ffb0ec',  // 32
  '#f5739b',  // 64
  '#f7b6ad',  // 128
  '#e08b4a',  // 256
  '#f4f786',  // 512
  '#a2cf93',  // 1024
  '#3a9947',  // 2048
];

// window size
let w;
let h;

// true if user wins/loses
let win = false;
let loss = false;

// if a piece moved on keyboard click, then this is true
let pieceMoved = false;

function setup() {
 createCanvas(308, 308);
 addPiece();
 addPiece();
 w = width / 4;
 h = height / 4;
}

function keyPressed() {
  // if player hasn't won or loss
  if (!(win) && !(loss)) {
    // resets pieceMoved to false
    pieceMoved = false;

    // moves pieces in given direction, according to arrow key
    if (keyCode === UP_ARROW) {
      rotateArrayClockwise(game_board);
      game_board = combineBlocks(game_board);
      rotateArrayCounterClockwise();
    } else if (keyCode === LEFT_ARROW) {
      rotateArrayClockwise(game_board);
      rotateArrayClockwise(game_board);
      game_board = combineBlocks(game_board);
      rotateArrayCounterClockwise();
      rotateArrayCounterClockwise();
    } else if (keyCode === DOWN_ARROW) {
      rotateArrayCounterClockwise(game_board);
      game_board = combineBlocks(game_board);
      rotateArrayClockwise(game_board);
    } else if (keyCode === RIGHT_ARROW) {
      game_board = combineBlocks(game_board);
    }

    // if a pieceMoved, then it adds a piece
    if (pieceMoved) {
      // add new piece
      addPiece();
    }

    // check for loss (GAME OVER)
    noMovesLeft();

    // check for win (Reached 2048)
    reached2048();
  } else if (win == true) {
    document.getElementById("message").innerHTML = "Winner!";
  } else if (loss == true) {
    document.getElementById("message").innerHTML = "Game Over!";
  }
}

function draw() {
  // background of canvas
  background(255);
  // line width
  strokeWeight(2);
  // rounds ends of lines
  strokeCap(ROUND);

  // line(start x, start y, end x, end y)
  // rect(x, y, w, h, r)
  // text(str, x, y, textbox width, textbox height)

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let x = (w*i) + 6;
      let y = (h*j) + 6;
      let block_width = 65;

      // number
      let number = game_board[j][i];

      if (number != 0) {
        stroke(blockColors[Math.log2(number)-1]);
        fill(blockColors[Math.log2(number)-1]);
      } else {
        // default light gray color
        stroke(200);
        fill(200);
      }
      rect(x, y, block_width, block_width, 12);

      if (number != 0) {
        if (number >= 1024) {
          textSize(25);
        } else if (number >= 128) {
          textSize(27);
        } else if (number >= 8) {
          textSize(29);
        } else {
          textSize(31);
        }

        stroke(80);
        fill(80);
        textAlign(CENTER, CENTER);
        text(number, x, y, block_width + 7, block_width);
      }
    }
  }

}

function copyGameBoard() {
  let testBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  // puts board's values into tempBoard
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      testBoard[i][j] = game_board[i][j];
    }
  }

  return testBoard;
}

function noMovesLeft() {
  openSpot = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game_board[i][j] == 0) {
        openSpot = true;
      }
    }
  }

  // if there are no spots left, it checks if any pieces can be combined
  if (!(openSpot)) {
    let board = copyGameBoard();
    pieceMoved = false;

    // right
    combineBlocks(board);

    // up
    rotateArrayClockwise(board);
    combineBlocks(board);

    // left
    rotateArrayClockwise(board);
    combineBlocks(board);

    // down
    rotateArrayClockwise(board);
    combineBlocks(board);

    // if after trying all four directions, no piece moved, then user lost
    if (!(pieceMoved)) {
      loss = true;
    }
  }
}

function reached2048() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game_board[i][j] == 2048) {
        win = true;
      }
    }
  }
}

function addPiece() {
  var openSpaces = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game_board[i][j] == 0) {
        openSpaces++;
      }
    }
  }

  var randomIndex = Math.floor(Math.random() * openSpaces);
  var index = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game_board[i][j] == 0) {
        if (index == randomIndex) {
          game_board[i][j] = 2;
        }
        index++
      }
    }
  }

}

function rotateArrayCounterClockwise() {
  // stores bottom right values
  let tempBoard = [game_board[2][2], game_board[2][3], game_board[3][2], game_board[3][3]]
  // bottom right quadrant
  game_board[2][2] = game_board[2][1];
  game_board[2][3] = game_board[3][1];
  game_board[3][2] = game_board[2][0];
  game_board[3][3] = game_board[3][0];
  // bottom left quadrant
  game_board[2][0] = game_board[0][1];
  game_board[2][1] = game_board[1][1];
  game_board[3][0] = game_board[0][0];
  game_board[3][1] = game_board[1][0];
  // top left quadrant
  game_board[0][0] = game_board[0][3];
  game_board[0][1] = game_board[1][3];
  game_board[1][0] = game_board[0][2];
  game_board[1][1] = game_board[1][2];
  // top right quadrant
  game_board[0][2] = tempBoard[1];
  game_board[0][3] = tempBoard[3];
  game_board[1][2] = tempBoard[0];
  game_board[1][3] = tempBoard[2];
}

function rotateArrayClockwise(board) {
  // stores bottom right values
  let tempBoard = [board[2][2], board[2][3], board[3][2], board[3][3]]
  // bottom right quadrant
  board[2][2] = board[1][2];
  board[2][3] = board[0][2];
  board[3][2] = board[1][3];
  board[3][3] = board[0][3];
  // top right quadrant
  board[0][2] = board[1][0];
  board[0][3] = board[0][0];
  board[1][2] = board[1][1];
  board[1][3] = board[0][1];
  // top left quadrant
  board[0][0] = board[3][0];
  board[0][1] = board[2][0];
  board[1][0] = board[3][1];
  board[1][1] = board[2][1];
  // bottom left quadrant
  board[2][0] = tempBoard[2];
  board[2][1] = tempBoard[0];
  board[3][0] = tempBoard[3];
  board[3][1] = tempBoard[1];
}

function combineBlocks(board) {
  // moves all blocks to the right
  for (let i = 0; i < 4; i++) {
    for (let j = 2; j >= 0; j--) {
      let x = j;
      while (x <= 2) {
        if (board[i][x] != 0 && board[i][x+1] == 0) {
          // moves block right into empty space
          pieceMoved = true;
          board[i][x+1] = board[i][x];
          board[i][x] = 0;
        }
        x++;
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 2; j >= 0; j--) {
      let x = j;
      // same block, combines them
      if (board[i][x] != 0 && board[i][x+1] == board[i][x]) {
        pieceMoved = true;
        board[i][x] = 0;
        board[i][x+1] = board[i][x+1] * 2;
      }

      // shift blocks right
      for (let k = 2; k >= 0; k--) {
        x = k;
        var pieceSet = false;
        while (!pieceSet) {
          // moves block right into empty space
          if (board[i][x] != 0 && board[i][x+1] == 0) {
            board[i][x+1] = board[i][x];
            board[i][x] = 0;
            x++;
          } else {
            pieceSet = true;
          }
        }
      }
    }
  }

  return board;
}
