// generating the board with javascript
let board = document.querySelector(".board");

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
      if (i < 29 || i >= 55) {
        // normallement il ya i < 24 ||i >= 40
        square.innerHTML = `<div class='piece' ${i >= 40 ? `style="background-color: #fff" data-color-piece="white"` : 'data-color-piece="black"'} id="piece${i}" draggable="true"></div>`;
      }
    }
  });
}

/**
 * this function helps add infinite moves in the kings pieces
 * that successfully achieved the opponent's side
 */
function infiniteMoves(position) {
  let moves = [];
  let countA = position;
  while (countA > 6) {
    moves.push(countA - 7);
    countA -= 7;
    let selectedSquare = document.getElementById(countA);
    if (selectedSquare.hasChildNodes()) {
      break;
    }
    if ((countA + 1) % 8 === 0) {
      break;
    }
  }
  let countB = position;
  while (countB > 8) {
    moves.push(countB - 9);
    countB -= 9;
    let selectedSquare = document.getElementById(countB);
    if (selectedSquare.hasChildNodes()) {
      break;
    }
    if (countB % 8 === 0) {
      break;
    }
  }
  let countC = position;
  while (countC < 55) {
    moves.push(countC + 9);
    countC += 9;
    let selectedSquare = document.getElementById(countC);
    if (selectedSquare.hasChildNodes()) {
      break;
    }
    if ((countA + 1) % 8 === 0) {
      break;
    }
  }
  let countD = position;
  while (countD < 57) {
    moves.push(countD + 7);
    countD += 7;
    let selectedSquare = document.getElementById(countD);
    if (selectedSquare.hasChildNodes()) {
      break;
    }
    if (countD % 8 === 0) {
      break;
    }
  }

  return moves;
}
setupBoard();
infiniteMoves();
/* TODO:
1. introduce a click to each piece ✅
2. highlight the moves available✅
2.1. a little animation when illegal move
2.2. exception for edge pieces✅
2.3. showing moves individually for each piece clicked✅
3. move the right piece when clicking to the highlighted square✅
4. introduce the notion of turn✅
4.1. animation when its not your turn✅
5. introduce the notion of forcing captures✅
5.1. make sure the double capture is possible✅
6. make the game customizable
7. how to put new rules
8. Add the drag and drop behavior⌛
*/

function movesAvailableFor(piece) {
  let moves = [];
  let position = Number(piece.parentElement.getAttribute("id"));

  let { colorPiece } = piece.dataset;

  if (colorPiece === "black" && position < 55) {
    moves = [position + 7, position + 9];
  } else if (colorPiece === "white" && position > 0) {
    moves = [position - 9, position - 7];
  }

  if (position % 8 === 0) {
    moves.shift();
  }
  if ((position + 1) % 8 === 0) {
    moves.pop();
  }
  // Adding the infinite moves when arriving in the opponent side
  if (
    (colorPiece === "black" && position > 55) ||
    (colorPiece === "white" && position < 8)
  ) {
    piece.classList.add("king");
  }
  colorSquares();

  if (Array.from(piece.classList).includes("king")) {
    moves = infiniteMoves(position);
    moves.forEach((move) => {
      let square = document.getElementById(move);
      if (square.hasChildNodes()) {
        checkCaptureKing(piece.parentElement, move, colorPiece, 1);
      } else {
        square.style.backgroundColor = "green";
      }
    });
  } else {
    moves.forEach((moving) => {
      let square = document.getElementById(moving);
      if (square.hasChildNodes()) {
        checkCapture(piece.parentElement, moving, colorPiece);
      } else {
        square.style.backgroundColor = "green";
      }
    });
  }
}

function checkCaptureKing(clickedSquare, nowSquare, color, count = 1) {
  /* check if the next square has a piece*/
  let pieceSquare = document.getElementById(nowSquare);
  let nextPiece = pieceSquare?.children[0];
  if (!nextPiece) {
    return;
  }
  /* get the color of the piece */
  let colorNextPiece = nextPiece.dataset.colorPiece;

  /* remove captures on the rim of the board */
  let initSquare = Number(clickedSquare.getAttribute("id"));
  let destSquare = Number(pieceSquare.getAttribute("id"));
  if (destSquare % 8 === 0 || (destSquare + 1) % 8 === 0) {
    pieceSquare.style.backgroundColor = "red";
    return;
  }
  /* not the same color */
  if (color === colorNextPiece) {
    pieceSquare.style.backgroundColor = "red";
    return;
  }

  /* get the direction of the move */
  let direction = destSquare - initSquare;

  let sens =
    direction % 7 === 0 ? (direction > 0 ? 7 : -7) : direction > 0 ? 9 : -9;

  /*check if the next case is empty */
  let nextSquare = document.getElementById(nowSquare + sens);
  if (nextSquare.hasChildNodes()) {
    pieceSquare.style.backgroundColor = "red";
    return;
  } else {
    pieceSquare.style.backgroundColor = "aqua";
  }
  /* color the next cases */
  /* first direction */
  while (
    (destSquare + 1) % 8 !== 0 &&
    destSquare < 63 &&
    ((direction % 7 === 0 && direction > 0) ||
      (direction % 9 === 0 && direction < 0))
  ) {
    destSquare += sens;
    let finalSquare = document.getElementById(destSquare);
    finalSquare.style.backgroundColor = "white";
    finalSquare.classList.add(`capture-${count}`);
    if (finalSquare.hasChildNodes()) {
      checkCaptureKing(finalSquare, destSquare, color);
      break;
    }
  }
  /* second direction */
  while (
    destSquare % 8 !== 0 &&
    destSquare < 63 &&
    ((direction % 7 === 0 && direction < 0) ||
      (direction % 9 === 0 && direction > 0))
  ) {
    destSquare += sens;
    let finalSquare = document.getElementById(destSquare);
    finalSquare.style.backgroundColor = "white";
    finalSquare.classList.add(`capture-${count}`);
    if (finalSquare.hasChildNodes()) {
      checkCaptureKing(finalSquare, destSquare, color);
      break;
    }
  }
  /* */
  console.log("finished");
}

function checkCapture(clickedSquare, move, color, count = 1, Captured = []) {
  /* check if the next square has a piece*/
  let pieceSquare = document.getElementById(move);
  let nextPiece = pieceSquare?.children[0];
  if (!nextPiece) {
    return;
  }
  /* get the color of the piece */
  let colorNextPiece = nextPiece.dataset.colorPiece;

  /* remove captures on the rim of the board */
  let initSquare = Number(clickedSquare.getAttribute("id"));
  let destSquare = Number(pieceSquare.getAttribute("id"));
  if (destSquare % 8 === 0 || (destSquare + 1) % 8 === 0) {
    pieceSquare.style.backgroundColor = "red";
    return;
  }
  /* getting the new square */
  let newDest = 2 * destSquare - initSquare;
  if (newDest > 63 || newDest < 0) {
    return;
  }
  let finalSquare = document.getElementById(newDest);
  if (!finalSquare) {
    return;
  }

  if (nextPiece.parentElement.style.backgroundColor === "aqua") {
    return;
  }
  if (
    clickedSquare.style.backgroundColor === "white" &&
    color === colorNextPiece
  ) {
    return;
  }

  if (color === colorNextPiece) {
    nextPiece.parentElement.style.backgroundColor = "red";
  } else {
    if (finalSquare.hasChildNodes()) {
      return;
    } else {
      nextPiece.parentElement.style.backgroundColor = "aqua";
      finalSquare.style.backgroundColor = "white";
      finalSquare.classList.add(`capture-${count}`);
      if (count === 1) {
        Captured.push(`${nextPiece.getAttribute("id")}`);
        finalSquare.dataset.capturedPieces = Captured;
      } else {
        Captured = clickedSquare.dataset.capturedPieces.split(",");
        Captured.push(`${nextPiece.getAttribute("id")}`);
        finalSquare.dataset.capturedPieces = Captured;
      }
      count++;
      const allDirections = [
        newDest - 7,
        newDest - 9,
        newDest + 7,
        newDest + 9,
      ];

      allDirections.forEach((direction) => {
        if (direction % 8 === 0 || (direction + 1) % 8 === 0 || direction < 0) {
          return;
        }
        checkCapture(finalSquare, direction, color, count, Captured);
      });
    }
  }
}

// Adding the drag and drop API to pieces
// TODO: restrict the draggability if its not your turn
// the idea was simply that if the square was the right square
// it will be highlighted in green and red otherwise
// FIXME: failed to correct the highlighting process
// FIXME: failed to remove the draggability when its not your turn
function dragDropAPI(lastPiece) {
  // todo: to introduce the notion of turn with the drag and drop API
  let squares = document.querySelectorAll(".square");
  let pieces = document.querySelectorAll(".piece");

  squares.forEach((square, i) => {
    if (square.style.backgroundColor === "rgb(77, 42, 0)") {
      square.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      square.addEventListener("dragenter", (e) => {
        e.preventDefault();
        if (e.currentTarget.hasChildNodes()) {
          e.currentTarget.classList.add("over-bad");
        }
        let color = square.style.backgroundColor;
        if (color === "green") {
          e.currentTarget.classList.add("over-good");
        }
      });
      square.addEventListener("dragleave", (e) => {
        e.currentTarget.classList.remove("over-bad");
      });
      // you have to add a condition so that if the square has a class of over-bad we are not supposed to drop (it shows an error and the piece return in its home square)
      square.addEventListener("drop", (e) => {
        const idPiece = e.dataTransfer.getData("text/plain");

        const pieceTaken = document.getElementById(idPiece);

        e.currentTarget.appendChild(pieceTaken);
        e.currentTarget.classList.remove("over-bad");
        e.currentTarget.classList.remove("over-good");
        colorSquares();
      });
    }
  });
  pieces.forEach((piece) => {
    piece.addEventListener("dragstart", (e) => {
      let currentTurn = turn(lastPiece);
      let { colorPiece } = piece.dataset;
      board.classList.add("is-dragging");
      if (colorPiece !== currentTurn) {
        piece.setAttribute("draggable", "false");
      } else {
        piece.setAttribute("draggable", "true");
      }
      if (colorPiece === currentTurn) {
        e.dataTransfer.setData("text/plain", e.target.id);
        movesAvailableFor(piece);
      }
    });
    piece.addEventListener("dragend", (e) => {
      let currentTurn = turn(lastPiece);
      let { colorPiece } = piece.dataset;
      if (colorPiece !== currentTurn) {
        piece.setAttribute("draggable", "false");
      }
      board.classList.remove("is-dragging");
    });
  });
}

//the start of the game

function Showmoves(lastPiece) {}

function turn(lastPiece) {
  if (lastPiece === undefined || lastPiece === "black") {
    return "white";
  } else {
    return "black";
  }
}

// adding the movement of pieces

function startgame() {
  let squares = document.querySelectorAll(".square");
  let lastPiece = "black";
  let pieces = document.querySelectorAll(".piece");
  let activePiece = "";

  pieces.forEach((piece) => {
    piece.addEventListener("click", (e) => {
      let currentTurn = turn(lastPiece);
      let colorPieceClicked = piece.dataset.colorPiece;
      if (colorPieceClicked !== currentTurn) {
        e.target.style.animation = "notMe .5s ease-in-out";
        e.target.onanimationend = () => {
          e.target.style.animation = "";
        };
        e.target.setAttribute("draggable", "false");
        return;
      }
      if (colorPieceClicked === currentTurn) {
        movesAvailableFor(piece);
        activePiece = e.target;
      }
    });
  });

  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      let color = square.style.backgroundColor;
      // get all elements whose class contains "capture-"
      const allCaptures = document.querySelectorAll('[class*="capture-"]');

      if (color === "green" && Array.from(allCaptures).length === 0) {
        square.appendChild(activePiece);
        colorSquares();
        lastPiece = square.children[0].dataset.colorPiece;
        return;
      }
      if (color === "green") {
        activePiece.style.animation = "notMe .5s ease-in-out";
        activePiece.onanimationend = () => {
          activePiece.style.animation = "";
        };

        alert("there is a crucial capture you missed");
      }
      let numbersCaptures = 0;
      if (color === "white") {
        const indices = Array.from(allCaptures).map((el) => {
          const match = el.className.match(/capture-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        });
        // looking for the highest amount of captures
        const maxI = Math.max(...indices);

        const currentMatch = e.target.className.match(/capture-(\d+)/);
        const currentI = currentMatch ? parseInt(currentMatch[1], 10) : null;

        // 5. Execute if this is the highest
        if (currentI === maxI) {
          const capturedPieces = square.dataset.capturedPieces.split(",");
          capturedPieces.forEach((Id) => {
            const captured = document.getElementById(Id);
            captured.remove();
          });
          square.appendChild(activePiece);
          colorSquares();
          lastPiece = square.children[0].dataset.colorPiece;

          Array.from(allCaptures).forEach((divs) => {
            let captureClass = Array.from(divs.classList).filter((className) =>
              className.includes("capture-"),
            );
            divs.classList.remove(captureClass[0]);
          });
        } else {
          activePiece.style.animation = "notMe .5s ease-in-out";
          activePiece.onanimationend = () => {
            activePiece.style.animation = "";
          };
          alert("this is not the highest possible");
        }
      }
    });
  });
  //dragDropAPI(lastPiece);
}

startgame();
