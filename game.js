const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let moving = false;

const randomNumber = (min, max, num) => {
  return Math.floor((Math.random() * (max - min + 1) + min) / num) * num;
}

const mousePos = (canvas, e) => {
  let rect = canvas.getBoundingClientRect();
  let scaleX = canvas.width / rect.width;
  let scaleY = canvas.height / rect.height;
  return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      }
}


const changeDirection = (e) => {
  const left = 37;
  const up = 38;
  const right = 39;
  const down = 40;
  if (!moving) {
    if (e.keyCode === up && snake.dy !== 10) {
      snake.dx = 0;
      snake.dy = -10;
    }
    if (e.keyCode === down && snake.dy !== -10) {
      snake.dx = 0;
      snake.dy = 10;
    }
    if (e.keyCode === left && snake.dx !== 10) {
      snake.dx = -10;
      snake.dy = 0;
    }
    if (e.keyCode === right && snake.dx !== -10) {
      snake.dx = 10;
      snake.dy = 0;
    }
  }
  moving = true;
}

const changeState = (e) => {
  let position = mousePos(canvas, e);

  // if (position.x > levelDisplay.first.x && position.x < levelDisplay.first.x + levelDisplay.w && position.y > levelDisplay.first.y && position.y < levelDisplay.first.y + levelDisplay.h) {
  //   if (gameState.current === gameState.layout) {
  //     gameState.current = gameState.start;
  //   }
  // }
  if (gameState.current === gameState.layout) {
    if (position.x > hArrow.x + hArrow.w / 2 && position.x < hArrow.x + hArrow.w && position.y > hArrow.y && position.y < hArrow.y + hArrow.h) {
      if (levelDisplay.all()[levelDisplay.current + 1]) {
        levelDisplay.current += 1;
      }
    }

    if (position.x > hArrow.x && position.x < hArrow.x + hArrow.w / 2 && position.y > hArrow.y && position.y < hArrow.y + hArrow.h) {
      if (levelDisplay.all()[levelDisplay.current - 1]) {
        levelDisplay.current -= 1;
      }
    }
  }

  if (position.x > buttons.x && position.x < buttons.x + buttons.w && position.y > buttons.y && position.y < buttons.y + buttons.h) {
    if (gameState.current === gameState.layout) {
      gameState.current = gameState.start;
    } else if (gameState.current === gameState.start) {
      gameState.current = gameState.game;
    } else if (gameState.current === gameState.end) {
      snake.restart();
      food.restart();
      score.restart();
      gameState.current = gameState.start;
    }
  }

  if (gameState.current === gameState.end) {
    if (position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > (vArrow.y + vArrow.h / 2) && position.y < vArrow.y + vArrow.h) {
      snake.restart();
      food.restart();
      score.restart();
      gameState.current = gameState.start;
    } else if (position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > vArrow.y && position.y < vArrow.y + vArrow.h / 2) {
      snake.restart();
      food.restart();
      score.restart();
      gameState.current = gameState.layout;
    }
  }
}

const changeDirectionPhone = (e) => {
  let position = mousePos(canvas, e);

  if (!moving) {
    if ((position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > vArrow.y && position.y < vArrow.y + vArrow.h / 2) && snake.dy !== 10) {
      snake.dx = 0;
      snake.dy = -10;
    }
    if ((position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > (vArrow.y + vArrow.h / 2) && position.y < vArrow.y + vArrow.h) && snake.dy !== -10) {
      snake.dx = 0;
      snake.dy = 10;
    }
    if ((position.x > hArrow.x && position.x < hArrow.x + hArrow.w / 2 && position.y > hArrow.y && position.y < hArrow.y + hArrow.h) && snake.dx !== 10) {
      snake.dx = -10;
      snake.dy = 0;
    }
    if ((position.x > hArrow.x + hArrow.w / 2 && position.x < hArrow.x + hArrow.w && position.y > hArrow.y && position.y < hArrow.y + hArrow.h) && snake.dx !== -10) {
      snake.dx = 10;
      snake.dy = 0;
    }
  }
}

window.addEventListener('keydown', changeDirection);
canvas.addEventListener('click', changeState);
canvas.addEventListener('click', changeDirectionPhone);

const clearBg = {
  x: 0,
  y: 0,
  w: canvas.width,
  h: canvas.height,

  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

const gameState = {
  current: 0,
  layout: 0,
  start: 1,
  game: 2,
  end: 3
}

const levelDisplay = {
  all() {
    return [this.first, this.second, this.third];
  },

  current: 0,

  first: {
    id: 0,
    x: 50,
    y: 50,
    tX: 60,
    tY: 68
  },

  second: {
    id: 1,
    x: 120,
    y: 50,
    tX: 130,
    tY: 68
  },

  third: {
    id: 2,
    x: 190,
    y: 50,
    tX: 200,
    tY: 68
  },

  w: 50,
  h: 30,

  draw() {
    if (gameState.current === gameState.layout) {
      ctx.fillStyle = "darkgreen";
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.strokeRect(this.all()[this.current].x, this.all()[this.current].y, this.w, this.h);
      ctx.fillRect(this.first.x, this.first.y, this.w, this.h);
      ctx.fillRect(this.second.x, this.second.y, this.w, this.h);
      ctx.fillRect(this.third.x, this.third.y, this.w, this.h);
      ctx.fillStyle = "black";
      ctx.font = "10px Arial";
      ctx.fillText("Level 1", this.first.tX, this.first.tY);
      ctx.fillText("Level 2", this.second.tX, this.second.tY);
      ctx.fillText("Level 3", this.third.tX, this.third.tY);
    }
  }
}

const chooseMessage = {
  x: 115,
  y: 120,

  draw() {
    if (gameState.current === gameState.layout) {
      ctx.fillStyle = "black";
      ctx.font = "15px Arial";
      ctx.fillText("Choose a level", this.x, this.y);
    }
  }
}

const background = {
  base: {
    x: 0,
    y: 250,
    w: canvas.width,
    h: canvas.height - 250,
  },

  left: {
    x: 0,
    y: 0,
    w: 20,
    h: 300
  },

  right: {
    x: canvas.width - 20,
    y: 0,
    w: 20,
    h: 300
  },

  top: {
    x: 0,
    y: 0,
    w: canvas.width,
    h: 30
  },

  draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.base.x, this.base.y, this.base.w, this.base.h);
    ctx.fillRect(this.left.x, this.left.y, this.left.w, this.left.h);
    ctx.fillRect(this.right.x, this.right.y, this.right.w, this.right.h);
    ctx.fillRect(this.top.x, this.top.y, this.top.w, this.top.h);
  }
}

const getReady = {
  x: 130,
  y: 120,

  sX: 110,
  sY: 140,

  draw() {
    if (gameState.current === gameState.start) {
      ctx.fillStyle = "black";
      ctx.font = '15px Arial';
      ctx.fillText('Ready?', this.x, this.y);
      ctx.fillText('(Press Start)', this.sX, this.sY);
    }
  }
}

const gameOver = {
  x: 130,
  y: 120,

  layout: {
    x: 140,
    y: 150
  },

  again: {
    x: 140,
    y: 180
  },

  draw() {
    if (gameState.current === gameState.end) {
      ctx.fillStyle = "black";
      ctx.font = '15px Arial';
      ctx.fillText('Game Over', this.x, this.y);
      ctx.font = '10px Arial';
      ctx.fillText('Levels (Up)', this.layout.x, this.layout.y);
      ctx.fillText('Again (Down)', this.again.x, this.again.y);
    }
  }
}

const button = {
  x: 220,
  y: 350,
  r: 70,

  draw() {
    ctx.fillStyle = 'grey';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }
}

const vArrow = {
  x: 205,
  y: 300,
  w: 30,
  h: 100,

  draw() {
    ctx.fillStyle = 'darkgrey';
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

const hArrow = {
  x: 170,
  y: 335,
  w: 100,
  h: 30,

  draw() {
    ctx.fillStyle = 'darkgrey';
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

const buttons = {
  x: 50,
  y: 330,
  w: 70,
  h: 30,

  draw() {
    ctx.fillStyle = 'grey';
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

const word = {
  x: 68,
  y: 350,

  draw() {
    ctx.font = '15px Arial';
    ctx.fillStyle = "lightgrey";
    ctx.fillText('Start', this.x, this.y);
  }
}

const score = {
  current() {
    return levelDisplay.current;
  },

  first: {
    id: 0,
    name: "oldSnakeLvl1",
    current: 0,
    best: Number.parseInt(localStorage.getItem('oldSnakeLvl1')) || 0
  },

  second: {
    id: 1,
    name: "oldSnakeLvl2",
    current: 0,
    best: Number.parseInt(localStorage.getItem('oldSnakeLvl2')) || 0
  },

  third: {
    id: 2,
    name: "oldSnakeLvl3",
    current: 0,
    best: Number.parseInt(localStorage.getItem('oldSnakeLvl3')) || 0
  },

  all() {
    return [this.first.id, this.second.id, this.third.id];
  },

  active() {
    if (this.current() === this.first.id) {
      return this.first;
    } else if (this.current() === this.second.id) {
      return this.second;
    } else if (this.current() === this.third.id) {
      return this.third;
    }
  },

  xC: 250,
  yC: 40,

  xB: 220,
  yB: 50,


  draw() {
    if (gameState.current === gameState.game || gameState.current === gameState.end || gameState.current === gameState.start) {
      if (levelDisplay.current === this.all()[this.current()]) {
        ctx.font = '10px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`Score: ${this.active().current}`, this.xC, this.yC);
        ctx.fillText(`Highscore: ${this.active().best}`, this.xB, this.yB);
      }
    }
  },

  restart() {
    this.active().current = 0;
  }
}

const gameArea = {
  x: background.left.w,
  y: background.top.h,
  w: canvas.width - background.right.w,
  h: canvas.height - background.base.h
}

const gameLayouts = {
  current() {
    return levelDisplay.current;
  },

  second: {
    id: 1,
    x: gameArea.w / 2,
    y: 70,
    w: 30,
    h: 150
  },

  third: {
    id: 2,
    first: {
      x: 80,
      y: 70,
      w: 30,
      h: 150
    },
    second: {
      x: 200,
      y: 70,
      w: 30,
      h: 150
    }
  },

  update() {
    if (this.current() === this.second.id) {
      if (snake.position[0].x + snake.w > this.second.x && snake.position[0].x < this.second.x + this.second.w && snake.position[0].y + snake.h > this.second.y && snake.position[0].y < this.second.y + this.second.h) {
        gameState.current = gameState.end;
      }

      if (food.x + food.w > this.second.x && food.x < this.second.x + this.second.w && food.y + food.h > this.second.y && food.y < this.second.y + this.second.h) {
        food.x = randomNumber(background.left.w, background.right.x - 10, 10);
        food.y = randomNumber(background.top.h, background.base.y - 10, 10);
      }
    }

    if (this.current() === this.third.id) {
      if (snake.position[0].x + snake.w > this.third.first.x && snake.position[0].x < this.third.first.x + this.third.first.w && snake.position[0].y + snake.h > this.third.first.y && snake.position[0].y < this.third.first.y + this.third.first.h) {
        gameState.current = gameState.end;
      }

      if (snake.position[0].x + snake.w > this.third.second.x && snake.position[0].x < this.third.second.x + this.third.second.w && snake.position[0].y + snake.h > this.third.second.y && snake.position[0].y < this.third.second.y + this.third.second.h) {
        gameState.current = gameState.end;
      }
    }
  },

  draw() {
    if (this.current() === this.second.id) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.second.x, this.second.y, this.second.w, this.second.h);
    }

    if (this.current() === this.third.id) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.third.first.x, this.third.first.y, this.third.first.w, this.third.first.h);
      ctx.fillRect(this.third.second.x, this.third.second.y, this.third.second.w, this.third.second.h);
    }
  }
}

const snake = {
  position: [
  {x: 50, y: 230},
  {x: 60, y: 230}
  ],

  w: 10,
  h: 10,

  dx: 10,
  dy: 0,

  update() {
    if (gameState.current === gameState.game) {
      const head = {x: this.position[0].x + this.dx, y: this.position[0].y + this.dy};
      this.position.unshift(head);
      if (food.x === this.position[0].x && food.y === this.position[0].y) {
        food.x = randomNumber(background.left.w, background.right.x - 10, 10);
        food.y = randomNumber(background.top.h, background.base.y - 10, 10);
        score.active().current += 10;
        score.active().best = Math.max(score.active().current, score.active().best);
        localStorage.setItem(score.active().name, score.active().best);
        this.position.forEach((part) => {
          if (food.x === part.x && food.y === part.y) {
            food.x = randomNumber(background.left.w, background.right.x - 10, 10);
            food.y = randomNumber(background.top.h, background.base.y - 10, 10);
          }
        });

      } else {
        this.position.pop();
      }

      if (this.position[0].x + this.w > gameArea.w) {
        this.position[0].x = gameArea.x;
      } else if (this.position[0].x < gameArea.x) {
        this.position[0].x = gameArea.w - this.w;
      } else if (this.position[0].y + this.h > gameArea.h) {
        this.position[0].y = gameArea.y;
      } else if (this.position[0].y < gameArea.y) {
        this.position[0].y = gameArea.h -this.h;
      }

      for (let i = 4; i < this.position.length; i++) {
        if (this.position[0].x === this.position[i].x && this.position[0].y === this.position[i].y) {
          gameState.current = gameState.end;
        }
      }
    }

  },

  draw() {
    ctx.fillStyle = "white";
    this.position.forEach((part) => {
    ctx.fillRect(part.x, part.y, this.w - 1, this.h - 1);
    });
  },

  restart() {
    this.position = [
      {x: 50, y: 230},
      {x: 60, y: 230}
      ];
  }
}

const food = {
  x: randomNumber(background.left.w, background.right.x - 10, 10),
  y: randomNumber(background.top.h, background.base.y - 10, 10),
  w: 10,
  h: 10,

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.w - 1, this.h - 1);
  },

  restart() {
    this.x = randomNumber(background.left.w, background.right.x - 10, 10);
    this.y = randomNumber(background.top.h, background.base.y - 10, 10);
  }
}

function update() {
  snake.update();
  gameLayouts.update();
}

function draw() {
  clearBg.draw();
  background.draw();
  buttons.draw();
  word.draw();
  button.draw();
  vArrow.draw();
  hArrow.draw();
  gameLayouts.draw();
  chooseMessage.draw();
  food.draw();
  snake.draw();
  levelDisplay.draw();
  score.draw();
  getReady.draw();
  gameOver.draw();
}

function loop() {
  update();
  draw();
  moving = false;
}

setInterval(loop, 100);