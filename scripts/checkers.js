let board = document.querySelector(".board");

let square = ``;

for (let i = 0; i < 64; i++) {
  square += `
  <div class="square" id="${i}"></div>`;
}

board.innerHTML = square;
function colorSquares(){
  let themes = [
    ["#777a92", "#161722"],
    ["#f7d564", "#4d2a00"],
  ];
  let theme = themes[1];
  let color = theme[0];
  let squares = document.querySelectorAll('.square')
  squares.forEach((square,i) =>{
    square.style.backgroundColor = color;
    if (color === theme[0] && (i + 1) % 8 !== 0) {
      color = theme[1];
    } else if (color === theme[1] && (i + 1) % 8 !== 0) {
      color = theme[0];
    }
  })
}

function setupBoard() {
  let squares = document.querySelectorAll(".square");
  
  colorSquares()
  squares.forEach((square, i) => {
    if (square.style.backgroundColor === "rgb(77, 42, 0)") {
      if (i < 24 || i >= 40) {
        square.innerHTML = `<div class='piece' ${i >= 40 ? `style="background-color: #fff" data-color-piece="white"` : 'data-color-piece="black"'}></div>`;
      }
    }
  });
}
setupBoard()

/*
1. introduce a click to each piece ✅
2. highlight the moves available✅
2.1. a little animation when illegal move
2.2. exception for edge pieces✅
2.3. showing moves individually for each piece clicked✅
3. move the right piece when clicking to the highlighted square
4. introduce the notion of turn
5. introduce the notion of forcing captures
5.1. make sure the double capture is possible
6. make the game customizable
7. how to put new rules
*/

function movesAvailableFor(piece) {
  piece.addEventListener("click", () => {
    let position = Number(piece.parentElement.getAttribute("id"));

    let { colorPiece } = piece.dataset;

    if (colorPiece === "black") {
      moves = [position + 7,position + 9];
    } else {
      moves = [position - 9,position - 7];
    }

    if (position %8 === 0) {
      moves.shift()
    }
    if ((position + 1)%8 === 0){
      moves.pop()
    }
    colorSquares()
    moves.forEach( moving =>{
      let square = document.getElementById(moving);
      square.style.backgroundColor = "red"
    })

  });
}

let pieces = document.querySelectorAll(".piece");
let moves = [];

pieces.forEach((piece) => {
  movesAvailableFor(piece)
});
