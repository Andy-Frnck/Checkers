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
      if (i < 24 || i >= 40) {
        square.innerHTML = `<div class='piece' ${i >= 40 ? `style="background-color: #fff" data-color-piece="white"` : 'data-color-piece="black"'} id="piece${i}" draggable="true"></div>`;
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
4.1. animation when its not your turn✅
5. introduce the notion of forcing captures
5.1. make sure the double capture is possible✅
6. make the game customizable
7. how to put new rules
8. Add the drag and drop behavior⌛
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
    if (square.hasChildNodes()) {
      checkCapture(piece.parentElement, moving, colorPiece);
    } else {
      square.style.backgroundColor = "green";
    }
  });
}

function checkCapture(clickedSquare, move, color, count = 1, Captured = []) {
  let nextPieceSquare = document.getElementById(move);
  let nextPiece = nextPieceSquare?.children[0];
  if (!nextPiece) {
    return;
  }
  let colorNextPiece = nextPiece.dataset.colorPiece;
  let initSquare = Number(clickedSquare.getAttribute("id"));
  let destSquare = Number(nextPieceSquare.getAttribute("id"));
  if (destSquare % 8 === 0 || (destSquare + 1) % 8 === 0) {
    return;
  }
  let newDest = 2 * destSquare - initSquare;
  if (newDest > 64 && newDest < 0) {
    return;
  }
  console.log(newDest)
  let FinalSquare = document.getElementById(newDest);
  if (!FinalSquare) {
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
    if (FinalSquare.hasChildNodes()) {
      return;
    } else {
      nextPiece.parentElement.style.backgroundColor = "aqua";
      FinalSquare.style.backgroundColor = "white";
      FinalSquare.classList.add(`capture-${count}`);
      Captured.push(`${nextPiece.getAttribute("id")}`);
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
        checkCapture(FinalSquare, direction, color, count, Captured);
      });
      FinalSquare.dataset.capturedPieces = Captured;
    }
  }
}

// Adding the drag and drop API to pieces

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

      if (color === "green") {
        square.appendChild(activePiece);
        colorSquares();
        lastPiece = square.children[0].dataset.colorPiece;
      }
      let numbersCaptures = 0;
      if (color === "white") {
        // get all elements whose class contains "capture-"
        const allCaptures = document.querySelectorAll('[class*="capture-"]');
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
          console.log(`Success! ${currentI} is the highest index.`);
          const capturedPieces = (square.dataset.capturedPieces).split(",")
          capturedPieces.forEach(Id =>{
            const captured = document.getElementById(Id)
            captured.remove()
          })
          square.appendChild(activePiece)
          colorSquares()
          lastPiece = square.children[0].dataset.colorPiece;

          Array.from(allCaptures).forEach(captures=>{
            captures.classList.remove(/capture-(\d+)/)
          })
        } else {
          // todo: add animation when its not the highest
          console.log(
            `Action blocked. ${currentI} is not the highest (${maxI}).`,
          );
        }
      }
    });
  });
  //dragDropAPI(lastPiece);
}

startgame();
