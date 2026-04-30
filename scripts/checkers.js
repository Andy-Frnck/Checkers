// generating the board with javascript
let lastPiece="";
let board = document.querySelector(".board");
let activeSquare;

let square = ``;

for (let i = 0; i < 64; i++) {
  square += `
  <div class="square" id="${i}"></div>`;
}

board.innerHTML = square;
function colorSquares() {
  let themes = [
    ["#777a92", "#161722"],
    ["#f7d564", "#4d2a00"],
  ];
  let theme = themes[1];
  let color = theme[0];
  let squares = document.querySelectorAll(".square");
  squares.forEach((square, i) => {
    square.style.backgroundColor = color;
    if (color === theme[0] && (i + 1) % 8 !== 0) {
      color = theme[1];
    } else if (color === theme[1] && (i + 1) % 8 !== 0) {
      color = theme[0];
    }
  });
}

function setupBoard() {
  let squares = document.querySelectorAll(".square");

  colorSquares();
  squares.forEach((square, i) => {
    if (square.style.backgroundColor === "rgb(77, 42, 0)") {
      if (i < 24 || i >= 40) {
        square.innerHTML = `<div class='piece' ${i >= 40 ? `style="background-color: #fff" data-color-piece="white"` : 'data-color-piece="black"'}></div>`;
      }
    }
  });
}
setupBoard();

/* todo:
1. introduce a click to each piece ✅
2. highlight the moves available✅
2.1. a little animation when illegal move
2.2. exception for edge pieces✅
2.3. showing moves individually for each piece clicked✅
3. move the right piece when clicking to the highlighted square✅
4. introduce the notion of turn✅
5. introduce the notion of forcing captures
5.1. make sure the double capture is possible
6. make the game customizable
7. how to put new rules
8. Add the drag and drop behavior
*/

function movesAvailableFor(piece) {
  let moves = [];
  let position = Number(piece.parentElement.getAttribute("id"));

  let { colorPiece } = piece.dataset;

  if (colorPiece === "black") {
    moves = [position + 7, position + 9];
  } else {
    moves = [position - 9, position - 7];
  }

  if (position % 8 === 0) {
    moves.shift();
  }
  if ((position + 1) % 8 === 0) {
    moves.pop();
  }
  colorSquares();

  moves.forEach((moving) => {
    let square = document.getElementById(moving);
    let nextPiece = square.children[0];
    if (square.hasChildNodes()) {
      checkCapture(piece, nextPiece);
    } else {
      square.style.backgroundColor = "green";
    }
  });
}

function checkCapture(clickedPiece, nextPiece) {
  let colorPieceClicked = clickedPiece.dataset.colorPiece;
  let colorNextPiece = nextPiece.dataset.colorPiece;

  if (colorPieceClicked === colorNextPiece) {
    nextPiece.parentElement.style.backgroundColor = "red";
  } else {
    nextPiece.parentElement.style.backgroundColor = "aqua";
  }
}

//the start of the game

function Showmoves(lastPiece) {
  
}

function turn(lastPiece) {
  if (lastPiece === undefined|| lastPiece=== "black") {
    return "white";
  } else {
    return "black";
  }
}

// adding the movement of pieces

function startgame() {
  let squares = document.querySelectorAll(".square");
  let lastPiece = 'black';
  let pieces = document.querySelectorAll(".piece");
  
  pieces.forEach((piece) => {
    piece.addEventListener("click", () => {
      let currentTurn = turn(lastPiece);
      let colorPieceClicked = piece.dataset.colorPiece;
      if(colorPieceClicked !== currentTurn){
        console.log("you are" + lastPiece + "clicking again" + colorPieceClicked)
        return;
      }
      if (colorPieceClicked === currentTurn) {
        movesAvailableFor(piece);
        activeSquare = piece.parentElement;
      }
    });
  });

  squares.forEach((square) => {
    square.addEventListener("click", () => {
      Showmoves(lastPiece);
      let color = square.style.backgroundColor;

      if (color === "green") {
        square.appendChild(activeSquare.children[0]);
        colorSquares();
        lastPiece = square.children[0].dataset.colorPiece;
      }
    });
  });
}

startgame();
