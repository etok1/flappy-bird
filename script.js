const imgURL = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = imgURL;

const SPEED = 3.1;
const SIZE = [51, 36];

let index = 0;
let moveX = -2;

let pipes = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = canvas.width;
let pipeY = 0;
let topPipe = new Image();
topPipe.src = "../assets/toppipe.png";
let bottomPipe = new Image();
bottomPipe.src = "../assets/bottompipe.png";

const render = () => {
  index += 0.3;

  const backgroudX = -((index * SPEED) % canvas.width);

  const bgSource = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  const bgPartOneResult = {
    x: backgroudX + canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  const bgPartTwoResult = {
    x: backgroudX,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  ctx.drawImage(
    img,

    bgSource.x,
    bgSource.y,
    bgSource.width,
    bgSource.height,

    bgPartOneResult.x,
    bgPartOneResult.y,
    bgPartOneResult.width,
    bgPartOneResult.height
  );

  ctx.drawImage(
    img,

    bgSource.x,
    bgSource.y,
    bgSource.width,
    bgSource.height,

    bgPartTwoResult.x,
    bgPartTwoResult.y,
    bgPartTwoResult.width,
    bgPartTwoResult.height
  );

  const birdSource = {
    x: 432,
    y: Math.floor((index % 9) / 3) * SIZE[1],
    width: SIZE[0],
    height: SIZE[1],
  };

  const birdResult = {
    x: canvas.width / 2 - SIZE[0] / 2,
    y: 200,
    width: SIZE[0],
    height: SIZE[1],
  };

  ctx.drawImage(
    img,

    birdSource.x,
    birdSource.y,
    birdSource.width,
    birdSource.height,

    birdResult.x,
    birdResult.y,
    birdResult.width,
    birdResult.height
  );

  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    pipe.x += moveX;
    ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
  }
  // setInterval(displayPipes, 1500);
  window.requestAnimationFrame(render);
};

function displayPipes() {
  let topPipes = {
    img: topPipe,
    x: pipeX,
    y: pipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipes.push(topPipes);
}

img.onload = render;
