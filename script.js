const imgURL = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";
const pipeTopURL = "../assets/toppipe.png";
const pipeBottomURL = "../assets/bottompipe.png";
const birdURL = "../assets/bird.png";

const canvas = document.getElementById("canvas");

class Bird {
  constructor(x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = img;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

class Pipe {
  constructor(x, y, width, height, img, passed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = img;
    this.passed = passed;
  }

  move(velocityX) {
    this.x += velocityX;
  }

  draw(context) {
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

class Game {
  constructor(canvas, imgURL, pipeTopURL, pipeBottomURL, birdURL) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.img = new Image();
    this.img.src = imgURL;

    this.pipeTop = new Image();
    this.pipeTop.src = pipeTopURL;

    this.pipeBottom = new Image();
    this.pipeBottom.src = pipeBottomURL;

    this.birdImg = new Image();
    this.birdImg.src = birdURL;

    this.SPEED = 3.1;
    this.index = 0;
    this.moveX = -2;

    this.pipes = [];
    this.pipeWidth = 80;
    this.pipeHeight = 512;
    this.pipeX = this.canvas.width;
    this.pipeY = 0;

    this.spaceUp = 0;
    this.gravity = 0.4;

    this.gameOver = false;
    this.bestScore = localStorage.getItem("bestScore") || 0;
    this.score = 0;

    this.bird = new Bird(
      this.canvas.width / 8,
      this.canvas.height / 2,
      40,
      45,
      this.birdImg
    );

    this.eventListeners();
    this.render();
  }

  eventListeners() {
    document.addEventListener("keydown", (e) => this.flyBird(e));
    this.btnRestart = document.getElementById("restart");
    this.btnRestart.addEventListener("click", (e) => this.restart(e));
  }

  flyBird(event) {
    if (
      event.code === "Space" ||
      event.code === "ArrowUp" ||
      event.code === "KeyX"
    ) {
      this.spaceUp = -6;
    }
  }

  restart() {
    console.log("clicked");
    this.bird.y = this.canvas.height / 2;
    this.pipes = [];
    this.score = 0;
    this.gameOver = false;
    this.spaceUp = 0;
    this.btnRestart.style.display = "none";
    this.render();
  }

  render() {
    for (let i = 0; i < this.pipes.length; i++) {
      this.pipes[i].draw(this.ctx);
    }

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem("bestScore", this.bestScore);
    }

    if (this.gameOver) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.index += 0.3;

    const backgroudX = -((this.index * this.SPEED) % this.canvas.width);

    const bgSource = {
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
    };

    const bgPartOneResult = {
      x: backgroudX + this.canvas.width,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
    };

    const bgPartTwoResult = {
      x: backgroudX,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    };

    this.ctx.drawImage(
      this.img,

      bgSource.x,
      bgSource.y,
      bgSource.width,
      bgSource.height,

      bgPartOneResult.x,
      bgPartOneResult.y,
      bgPartOneResult.width,
      bgPartOneResult.height
    );

    this.ctx.drawImage(
      this.img,

      bgSource.x,
      bgSource.y,
      bgSource.width,
      bgSource.height,

      bgPartTwoResult.x,
      bgPartTwoResult.y,
      bgPartTwoResult.width,
      bgPartTwoResult.height
    );

    this.spaceUp += this.gravity;
    this.bird.y = Math.max(this.bird.y + this.spaceUp, 0);
    this.bird.draw(this.ctx);

    if (this.bird.y > this.canvas.height) {
      this.gameOver = true;
      this.btnRestart.style.display = "flex";
      console.log("hit the floor");
    }

    this.displayPipes();

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "35px 'Pixelify Sans', sans-serif";
    this.ctx.fillText("Current Score: " + this.score, 5, 45);
    this.displayScore();

    requestAnimationFrame(() => this.render());
  }

  displayScore() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "35px 'Pixelify Sans', sans-serif";
    this.ctx.fillText("Best Score: " + this.bestScore, 5, 80);
  }

  displayPipes() {
    if (this.gameOver) {
      return;
    }

    if (
      this.pipes.length === 0 ||
      this.pipes[this.pipes.length - 1].x < this.canvas.width - 200
    ) {
      this.createPipes();
    }

    for (let i = 0; i < this.pipes.length; i++) {
      let pipe = this.pipes[i];
      pipe.x += this.moveX;
      this.ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

      if (!pipe.passed && this.bird.x > 0.5 * (pipe.x + pipe.width)) {
        this.score += 0.5;
        pipe.passed = true;
        if (this.score > this.bestScore) {
          this.bestScore = this.score;
          localStorage.setItem("bestScore", this.bestScore);
          this.ctx.fillStyle = "#FFFFFF";
          this.ctx.font = "35px 'Pixelify Sans', sans-serif";
          this.ctx.fillText("GAME OVER! ", 5, 115);
          console.log(this.bestScore);
        }
      }
      if (this.hitPipes(this.bird, pipe)) {
        this.gameOver = true;
        this.btnRestart.style.display = "flex";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "35px 'Pixelify Sans', sans-serif";
        this.ctx.fillText("GAME OVER!", 5, 115);
      }
    }
  }

  createPipes() {
    let randomY =
      this.pipeY - this.pipeHeight / 4 - Math.random() * (this.pipeHeight / 2);
    let spacePipe = this.pipeHeight * 0.25;

    let topPipe = new Pipe(
      this.canvas.width,
      randomY,
      this.pipeWidth,
      this.pipeHeight,
      this.pipeTop
    );
    this.pipes.push(topPipe);

    let bottomPipe = new Pipe(
      this.canvas.width,
      randomY + this.pipeHeight + spacePipe,
      this.pipeWidth,
      this.pipeHeight,
      this.pipeBottom
    );
    this.pipes.push(bottomPipe);
  }

  hitPipes(b, p) {
    return (
      b.x < p.x + p.width &&
      b.x + b.width > p.x &&
      b.y < p.y + p.height &&
      b.y + b.height > p.y
    );
  }

  gameLoop() {
    this.flyBird();
    this.render();

    requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    this.gameLoop();
  }
}

const game = new Game(canvas, imgURL, pipeTopURL, pipeBottomURL, birdURL);
game.start();
