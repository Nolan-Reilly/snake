const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const playAgainBtn = document.querySelector("#playAgainBtn");
const gameContainer = document.querySelector("#gameContainer");
const gameOverCard = document.querySelector(".gameOverCard");
const highScoreText = document.querySelector("#highScoreText");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "#e7491c";
const foodBorder = "black";
const unitSize = 25;
const swipeSensitivity = 25;
let highScore = 0;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
  {x:unitSize * 4, y:200},
  {x:unitSize * 3, y:200},
  {x:unitSize * 2, y:200},
  {x:unitSize, y:200},
  {x:0, y:200}
];

let explosion = new Audio("./sfx/explosion.mp3");
explosion.volume = 0.2;

let point = new Audio("./sfx/point.mp3");
point.volume = 0.2;

window.addEventListener("keydown", changeDirection);
playAgainBtn.addEventListener("click", resetGame); 

gameStart();

let startingX, startingY, movingX, movingY;

function touchStart (evt) {
  startingX = evt.touches[0].clientX ;
  startingY = evt.touches[0].clientY ;
}

function touchMove (evt) {
  movingX = evt.touches[0].clientX ;
  movingY = evt.touches[0].clientY ;
}

function touchEnd() {
  const goingUp = (yVelocity == -unitSize);
  const goingDown = (yVelocity == unitSize);
  const goingRight = (xVelocity == unitSize);
  const goingLeft = (xVelocity == -unitSize);
  let swipeDirection = "";
  if ((startingX + swipeSensitivity) < movingX) {
    swipeDirection = "right";
  } else if ((startingX - swipeSensitivity) > movingX) {
    swipeDirection = "left";
  }

  if ((startingY + swipeSensitivity) < movingY) {
   swipeDirection="down";
  } else if ((startingY - swipeSensitivity) > movingY){
    swipeDirection = "up";
  }

  switch(true) {
    case(swipeDirection == "left" && !goingRight):
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case(swipeDirection == "up" && !goingDown):
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case(swipeDirection == "right" && !goingLeft):
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case(swipeDirection == "down" && !goingUp):
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

function gameStart() {
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
};
function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 95);
  }
  else {
    displayGameOver();
  }
};
function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function createFood() {
  function randomFood(min, max) {
    const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  };
  
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameWidth - unitSize);
};
function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake() {
  const head = {x: snake[0].x + xVelocity,
  y: snake[0].y + yVelocity};

  snake.unshift(head);
  // if food is eaten
  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;
    scoreText.textContent = score;
    point.play();
    createFood();
  }
  else {
    snake.pop();
  }
};
function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.StrokeStyle = snakeBorder;
  snake.forEach(snakePart => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  })
};
function changeDirection(event) {
  const keyPressed = event.keyCode;

  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;
  const A = 65;
  const D = 68;
  const S = 83;
  const W = 87;

  const goingUp = (yVelocity == -unitSize);
  const goingDown = (yVelocity == unitSize);
  const goingRight = (xVelocity == unitSize);
  const goingLeft = (xVelocity == -unitSize);

  switch(true) {
    case(keyPressed == LEFT && !goingRight):
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case(keyPressed == A && !goingRight):
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case(keyPressed == UP && !goingDown):
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case(keyPressed == W && !goingDown):
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case(keyPressed == RIGHT && !goingLeft):
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case(keyPressed == D && !goingLeft):
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case(keyPressed == DOWN && !goingUp):
      xVelocity = 0;
      yVelocity = unitSize;
      break;
    case(keyPressed == S && !goingUp):
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
};
function checkGameOver() {
  switch(true) {
    case (snake[0].x < 0):
      explosion.play();
      running = false;
      break;
    case (snake[0].x >= gameWidth):
      explosion.play();
      running = false;
      break;
    case (snake[0].y < 0):
      explosion.play();
      running = false;
      break;
    case (snake[0].y >= gameHeight):
      explosion.play();
      running = false;
      break;
  }
  
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
      explosion.play();
    }
  }
};
function displayGameOver() {
  running = false;
  gameBoard.style.animation = "shake 0.2s";
  gameOverCard.style.display = "block";
  gameContainer.classList.add("blur");
};
function resetGame() {
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    {x:unitSize * 4, y:200},
    {x:unitSize * 3, y:200},
    {x:unitSize * 2, y:200},
    {x:unitSize, y:200},
    {x:0, y:200}
  ];
  gameBoard.style.animation = "none";
  gameOverCard.style.display = "none";
  gameContainer.classList.remove("blur");
  if (score > highScore) {
    highScore = score
    highScoreText.textContent = score;
  }
  score = 0;
  gameStart();
};