let board = document.querySelector(".board");

let square = ``;

for (let i = 0; i < 64; i++) {
  square += `
  <div class="square" id="${i}"></div>`;
}

board.innerHTML = square;

let squares = document.querySelectorAll(".square");

let themes = [
  ["#777a92", "#161722"],
  ["#f7d564", "#4d2a00"],
];
let theme = themes[1];
let color = theme[0];

squares.forEach((square, i) => {
  square.style.backgroundColor = color;
  if (color === theme[0] && (i + 1) % 8 !== 0) {
    color = theme[1];
  } else if (color === theme[1] && (i + 1) % 8 !== 0) {
    color = theme[0];
  }
  if(square.style.backgroundColor === "rgb(77, 42, 0)"){
    if (i<24 || i>=40) {
      square.innerHTML =`<div class='piece' ${i>=40 ? `style="background-color: #fff"`:''}></div>`
    }
  }
});
