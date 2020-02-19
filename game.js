const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let moving = false;
let gameplay;
const snakeSpeed = 10;
const pongSpeed = 50;


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

const touchPos = (canvas, e) => {
  let rect = canvas.getBoundingClientRect();
  let scaleX = canvas.width / rect.width;
  let scaleY = canvas.height / rect.height;
  return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
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
  e.preventDefault();
  if (e.type === 'click') {
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

        if (pongLevel.all()[pongLevel.current + 1]) {
          pongLevel.current += 1;
        }
      }

      if (position.x > hArrow.x && position.x < hArrow.x + hArrow.w / 2 && position.y > hArrow.y && position.y < hArrow.y + hArrow.h) {
        if (levelDisplay.all()[levelDisplay.current - 1]) {
          levelDisplay.current -= 1;
        }

        if (pongLevel.all()[pongLevel.current - 1]) {
          pongLevel.current -= 1;
        }
      }
    }

    if (gameState.current === gameState.select) {
      if (position.x > hArrow.x + hArrow.w / 2 && position.x < hArrow.x + hArrow.w && position.y > hArrow.y && position.y < hArrow.y + hArrow.h) {
        if (gamesDisplay.all()[gamesDisplay.current + 1]) {
          gamesDisplay.current += 1;
        }
      }

      if (position.x > hArrow.x && position.x < hArrow.x + hArrow.w / 2 && position.y > hArrow.y && position.y < hArrow.y + hArrow.h) {
        if (gamesDisplay.all()[gamesDisplay.current - 1]) {
          gamesDisplay.current -= 1;
        }
      }
    }

    if (position.x > buttons.x && position.x < buttons.x + buttons.w && position.y > buttons.y && position.y < buttons.y + buttons.h) {
      if (gamesDisplay.active() === gamesDisplay.first) {
        if (gameState.current === gameState.select) {
          gameState.current = gameState.layout;
        } else if (gameState.current === gameState.layout) {
          gameState.current = gameState.start;
        } else if (gameState.current === gameState.start) {
          gameState.current = gameState.game;
          clearInterval(gameplay);
          game(snakeSpeed);
        } else if (gameState.current === gameState.end) {
          snake.restart();
          food.restart();
          score.restart();
          gameState.current = gameState.start;
        }
      } else if (gamesDisplay.active() === gamesDisplay.second) {
        if (gameState.current === gameState.select) {
          gameState.current = gameState.layout;
        } else if (gameState.current === gameState.layout) {
          gameState.current = gameState.start;
        } else if (gameState.current === gameState.start) {
          gameState.current = gameState.game;
          clearInterval(gameplay);
          game(pongSpeed);
        } else if (gameState.current === gameState.end) {
          pongBall.reset();
          pongScore.reset();
          gameState.current = gameState.start;
        }
      }
    }

    if (gameState.current === gameState.end && gamesDisplay.active() === gamesDisplay.first) {
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

    if (gameState.current === gameState.end && gamesDisplay.active() === gamesDisplay.second) {
      if (position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > (vArrow.y + vArrow.h / 2) && position.y < vArrow.y + vArrow.h) {
        pongPaddle.reset();
        pongBall.reset();
        pongScore.reset();
        gameState.current = gameState.start;
      } else if (position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > vArrow.y && position.y < vArrow.y + vArrow.h / 2) {
        pongPaddle.reset();
        pongBall.reset();
        pongScore.reset();
        gameState.current = gameState.layout;
      }
    }
  } else if (e.type === 'touchstart') {
   let position = touchPos(canvas, e);

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

    if (gameState.current === gameState.select) {
      if (position.x > hArrow.x + hArrow.w / 2 && position.x < hArrow.x + hArrow.w && position.y > hArrow.y && position.y < hArrow.y + hArrow.h) {
        if (gamesDisplay.all()[gamesDisplay.current + 1]) {
          gamesDisplay.current += 1;
        }
      }

      if (position.x > hArrow.x && position.x < hArrow.x + hArrow.w / 2 && position.y > hArrow.y && position.y < hArrow.y + hArrow.h) {
        if (gamesDisplay.all()[gamesDisplay.current - 1]) {
          gamesDisplay.current -= 1;
        }
      }
    }

    if (position.x > buttons.x && position.x < buttons.x + buttons.w && position.y > buttons.y && position.y < buttons.y + buttons.h) {
      if (gamesDisplay.active() === gamesDisplay.first) {
        if (gameState.current === gameState.select) {
          gameState.current = gameState.layout;
        } else if (gameState.current === gameState.layout) {
          gameState.current = gameState.start;
        } else if (gameState.current === gameState.start) {
          gameState.current = gameState.game;
          clearInterval(gameplay);
          game(snakeSpeed);
        } else if (gameState.current === gameState.end) {
          snake.restart();
          food.restart();
          score.restart();
          gameState.current = gameState.start;
        }
      } else if (gamesDisplay.active() === gamesDisplay.second) {
        if (gameState.current === gameState.select) {
          gameState.current = gameState.start;
        } else if (gameState.current === gameState.start) {
          gameState.current = gameState.game
          clearInterval(gameplay);
          game(pongSpeed);
        } else if (gameState.current === gameState.end) {
          pongBall.reset();
          pongScore.reset();
          gameState.current = gameState.start;
        }
      }
    }

    if (gameState.current === gameState.end && gamesDisplay.active() === gamesDisplay.first) {
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

    if (gameState.current === gameState.end && gamesDisplay.active() === gamesDisplay.second) {
      if (position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > (vArrow.y + vArrow.h / 2) && position.y < vArrow.y + vArrow.h) {
        pongPaddle.reset();
        pongBall.reset();
        pongScore.reset();
        gameState.current = gameState.start;
      } else if (position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > vArrow.y && position.y < vArrow.y + vArrow.h / 2) {
        pongPaddle.reset();
        pongBall.reset();
        pongScore.reset();
        gameState.current = gameState.layout;
      }
    }
  }
}

const changeDirectionPhone = (e) => {
  e.preventDefault();
  if (e.type === 'click' && gamesDisplay.active() === gamesDisplay.first) {
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
  } else if (e.type === 'touchstart' && gamesDisplay.active() === gamesDisplay.first) {
   let position = touchPos(canvas, e);

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
}

// const movePongPaddle = (e) => {
//   if (gamesDisplay.active() === gamesDisplay.second) {
//     let position = mousePos(canvas, e);
//     pongPaddle.user.y = position.y - pongPaddle.user.h / 2;
//     if (pongPaddle.user.y + pongPaddle.user.h / 2 < gameArea.y) {
//       pongPaddle.user.y = gameArea.y - pongPaddle.user.h / 2;
//     } else if (pongPaddle.user.y + pongPaddle.user.h / 2 > gameArea.h) {
//      pongPaddle.user.y = gameArea.h - pongPaddle.user.h / 2;
//     }

//   }
// }

const movePongPaddleArrows = (e) => {
  e.preventDefault();
  if (e.type === 'click') {
    if (gamesDisplay.active() === gamesDisplay.second && gameState.current === gameState.game) {
      let position = mousePos(canvas, e);

      if(position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > vArrow.y && position.y < vArrow.y + vArrow.h / 2) {
        pongPaddle.user.y -= pongBall.speed * 20;
      }

      if (position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > (vArrow.y + vArrow.h / 2) && position.y < vArrow.y + vArrow.h) {
        pongPaddle.user.y += pongBall.speed * 20;
      }

      if (pongPaddle.user.y + pongPaddle.user.h / 2 < gameArea.y) {
        pongPaddle.user.y = gameArea.y - pongPaddle.user.h / 2;
      } else if (pongPaddle.user.y + pongPaddle.user.h / 2 > gameArea.h) {
        pongPaddle.user.y = gameArea.h - pongPaddle.user.h / 2;
      }
    }
  } else if (e.type === 'touchstart') {
    if (gamesDisplay.active() === gamesDisplay.second && gameState.current === gameState.game) {
      let position = touchPos(canvas, e);

      if(position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > vArrow.y && position.y < vArrow.y + vArrow.h / 2) {
        pongPaddle.user.y -= pongBall.speed * 15;
      }

      if (position.x > vArrow.x && position.x < vArrow.x + vArrow.w && position.y > (vArrow.y + vArrow.h / 2) && position.y < vArrow.y + vArrow.h) {
        pongPaddle.user.y += pongBall.speed * 15;
      }

      if (pongPaddle.user.y + pongPaddle.user.h / 2 < gameArea.y) {
        pongPaddle.user.y = gameArea.y - pongPaddle.user.h / 2;
      } else if (pongPaddle.user.y + pongPaddle.user.h / 2 > gameArea.h) {
        pongPaddle.user.y = gameArea.h - pongPaddle.user.h / 2;
      }
    }
  }
}

window.addEventListener('keydown', changeDirection);
canvas.addEventListener('click', changeState);
canvas.addEventListener('touchstart', changeState);
canvas.addEventListener('click', changeDirectionPhone);
canvas.addEventListener('touchstart', changeDirectionPhone);
// canvas.addEventListener('mousemove', movePongPaddle);
canvas.addEventListener('touchstart', movePongPaddleArrows);
canvas.addEventListener('click', movePongPaddleArrows);

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
  select: 0,
  layout: 1,
  start: 2,
  game: 3,
  end: 4
}

const gamesDisplay = {
  all() {
    return [this.first, this.second];
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
    tX: 134,
    tY: 68
  },

  w: 50,
  h: 30,

  active() {
    return this.all()[this.current];
  },

  draw() {
    if (gameState.current === gameState.select) {
      ctx.fillStyle = "darkgreen";
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.strokeRect(this.all()[this.current].x, this.all()[this.current].y, this.w, this.h);
      ctx.fillRect(this.first.x, this.first.y, this.w, this.h);
      ctx.fillRect(this.second.x, this.second.y, this.w, this.h);
      ctx.fillStyle = "black";
      ctx.font = "10px Arial";
      ctx.fillText("Snake", this.first.tX, this.first.tY);
      ctx.fillText("Pong", this.second.tX, this.second.tY);
    }
  }
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
    if (gameState.current === gameState.layout && gamesDisplay.active() === gamesDisplay.first) {
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
    // && gamesDisplay.active() === gamesDisplay.first
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
    if (gameState.current === gameState.end && gamesDisplay.active() === gamesDisplay.first) {
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
  y: 300 - 20,
  w: 30,
  h: 100 + 40,

  draw() {
    ctx.fillStyle = 'darkgrey';
    ctx.fillRect(this.x, this.y + 20, this.w, this.h - 40);
  }
}

const hArrow = {
  x: 170 - 20,
  y: 335,
  w: 100 + 40,
  h: 30,

  draw() {
    ctx.fillStyle = 'darkgrey';
    ctx.fillRect(this.x + 20, this.y, this.w - 40, this.h);
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
    if ((gameState.current === gameState.game || gameState.current === gameState.end || gameState.current === gameState.start) && gamesDisplay.active() === gamesDisplay.first) {
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
    if (gamesDisplay.active() === gamesDisplay.first) {
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

        if (food.x + food.w > this.third.first.x && food.x < this.third.first.x + this.third.first.w && food.y + food.h > this.third.first.y && food.y < this.third.first.y + this.third.first.h) {
          food.x = randomNumber(background.left.w, background.right.x - 10, 10);
          food.y = randomNumber(background.top.h, background.base.y - 10, 10);
        }

        if (food.x + food.w > this.third.second.x && food.x < this.third.second.x + this.third.second.w && food.y + food.h > this.third.second.y && food.y < this.third.second.y + this.third.second.h) {
          food.x = randomNumber(background.left.w, background.right.x - 10, 10);
          food.y = randomNumber(background.top.h, background.base.y - 10, 10);
        }
      }
    }
  },

  draw() {
    if (gamesDisplay.active() === gamesDisplay.first) {
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
    if (gameState.current === gameState.game && gamesDisplay.active() === gamesDisplay.first) {
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
    if ((gameState.current === gameState.game || gameState.current === gameState.end || gameState.current === gameState.start || gameState.current === gameState.layout) && gamesDisplay.active() === gamesDisplay.first) {
      ctx.fillStyle = "white";
      this.position.forEach((part) => {
      ctx.fillRect(part.x, part.y, this.w - 1, this.h - 1);
      });
    }
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
    if ((gameState.current === gameState.game || gameState.current === gameState.end || gameState.current === gameState.start || gameState.current === gameState.layout) && gamesDisplay.active() === gamesDisplay.first) {
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.w - 1, this.h - 1);
    }
  },

  restart() {
    this.x = randomNumber(background.left.w, background.right.x - 10, 10);
    this.y = randomNumber(background.top.h, background.base.y - 10, 10);
  }
}

// pong

const pongLevel = {
  all() {
    return [this.first, this.second, this.third];
  },

  current: 0,

  first: {
    id: 0,
    x: 50,
    y: 50,
    tX: 65,
    tY: 68
  },

  second: {
    id: 1,
    x: 120,
    y: 50,
    tX: 128,
    tY: 68
  },

  third: {
    id: 2,
    x: 190,
    y: 50,
    tX: 205,
    tY: 68
  },

  w: 50,
  h: 30,

  active() {
    return this.all()[this.current];
  },

  draw() {
    if (gameState.current === gameState.layout && gamesDisplay.active() === gamesDisplay.second) {
      ctx.fillStyle = "darkgreen";
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.strokeRect(this.all()[this.current].x, this.all()[this.current].y, this.w, this.h);
      ctx.fillRect(this.first.x, this.first.y, this.w, this.h);
      ctx.fillRect(this.second.x, this.second.y, this.w, this.h);
      ctx.fillRect(this.third.x, this.third.y, this.w, this.h);
      ctx.fillStyle = "black";
      ctx.font = "10px Arial";
      ctx.fillText("Easy", this.first.tX, this.first.tY);
      ctx.fillText("Medium", this.second.tX, this.second.tY);
      ctx.fillText("Hard", this.third.tX, this.third.tY);
    }
  }
}

const pongPaddle = {
  user: {
    x: gameArea.x,
    y: gameArea.h / 2 - 20,
    w: 5,
    h: 40,
  },

  c: {
    x: gameArea.w - 5,
    y: gameArea.h / 2 - 20,
    w: 5,
    h: 40,
  },

  w: 5,
  h: 40,

  update() {
    if (gameState.current === gameState.game && gamesDisplay.active() === gamesDisplay.second) {
      this.c.y += pongBall.y - (this.c.y + this.h / 2);
    }
  },

  draw() {
    if ((gameState.current === gameState.start || gameState.current === gameState.game)&& gamesDisplay.active() === gamesDisplay.second) {
      ctx.fillStyle = 'white';
      ctx.fillRect(this.user.x, this.user.y, this.w, this.h);
      ctx.fillRect(this.c.x, this.c.y, this.w, this.h);
    }
  },

  reset() {
    this.user = {
      x: gameArea.x,
      y: gameArea.h / 2 - 20,
      w: 5,
      h: 40,
    };

    this.c = {
      x: gameArea.w - 5,
      y: gameArea.h / 2 - 20,
      w: 5,
      h: 40,
    };
  }
}

function collision(a, b) {
  const aTop = a.y;
  const aDown = a.y + a.h;
  const aLeft = a.x;
  const aRight = a.x + a.w;
  const bTop = b.y - b.r;
  const bDown = b.y + b.r;
  const bLeft = b.x - b.r;
  const bRight = b.x + b.r;

  return aRight > bLeft && aLeft < bRight && aDown > bTop && aTop < bTop;
}

const pongBall = {
  x: canvas.width / 2,
  y: gameArea.h / 2,
  r: 5,
  dX: [1, 2, 3],

  dY: [-1, -2, -3],

  speed: 1,

  update() {
    if (gameState.current === gameState.game && gamesDisplay.active() === gamesDisplay.second) {

      this.x += this.dX[pongLevel.current];
      this.y += this.dY[pongLevel.current];

      if (this.y + this.r >= gameArea.h || this.y - this.r <= gameArea.y) {
        this.dY[pongLevel.current] = -this.dY[pongLevel.current];
      }

      if (collision(pongPaddle.user, this) || collision(pongPaddle.c, this)) {
        this.speed += 0.01;
        this.dX[pongLevel.current] = -this.dX[pongLevel.current] * this.speed;
        this.dY[pongLevel.current] = this.dY[pongLevel.current] * this.speed;
      }

      if (this.x + this.r < gameArea.x) {
        pongScore.c.current += 1;
        this.reset();
        pongPaddle.reset();
        if (pongScore.c.current !== 5) gameState.current = gameState.start;
      } else if (this.x - this.r > gameArea.x + gameArea.w) {
        pongScore.user.current += 1;
        this.reset();
        pongPaddle.reset();
        if (pongScore.user.current !== 5) gameState.current = gameState.start;
      }
    }
  },

  draw() {
    if ((gameState.current === gameState.start || gameState.current === gameState.game)&& gamesDisplay.active() === gamesDisplay.second) {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      ctx.fill();
    }
  },

  reset() {
    this.x = canvas.width / 2;
    this.y = gameArea.h / 2;
    this.r = 5;
    this.dX = [1, 2, 3];
    this.dY = [-1, -2, -3];
    this.speed = 1;
  }
}

const pongNet = {
  x: canvas.width / 2 - 1.5,
  y: gameArea.y,
  w: 3,
  h: 10,

  draw() {
    if ((gameState.current === gameState.start || gameState.current === gameState.game)&& gamesDisplay.active() === gamesDisplay.second) {
      for (let i = 0; i < gameArea.h - gameArea.y; i += 15) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y + i, this.w, this.h);
      }
    }
  }
}

const pongScore = {
  user: {
    current: 0,
    x: 80,
    y: 60
  },

  c: {
    current: 0,
    x: 230,
    y: 60
  },

  update() {
    if (gameState.current === gameState.game && gamesDisplay.active() === gamesDisplay.second) {
      if (this.user.current === 5 || this.c.current === 5) {
        gameState.current = gameState.end;
      }
    }
  },

  draw() {
    if ((gameState.current === gameState.start || gameState.current === gameState.game)&& gamesDisplay.active() === gamesDisplay.second) {
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(this.user.current, this.user.x, this.user.y);
      ctx.fillText(this.c.current, this.c.x, this.c.y);
    }
  },

  reset() {
    this.user.current = 0;
    this.c.current = 0;
  }
}

const pongEndMessage = {
  x: 90,
  y: 120,

  layout: {
    x: 130,
    y: 150
  },

  again: {
    x: 130,
    y: 180
  },

  draw() {
    if ((gameState.current === gameState.end) && gamesDisplay.active() === gamesDisplay.second) {
      const name = pongScore.user.current === 5 ? 'You' : 'Computer';
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`${name} won`, this.x, this.y);
      ctx.font = '10px Arial';
      ctx.fillText('Levels (Up)', this.layout.x, this.layout.y);
      ctx.fillText('Again (Down)', this.again.x, this.again.y);
   }
  }
}

function update() {

  // snake
  snake.update();
  gameLayouts.update();

  // pong
  pongBall.update();
  pongPaddle.update();
  pongScore.update();
}

function draw() {
  clearBg.draw();


  gamesDisplay.draw();

  gameLayouts.draw();
  chooseMessage.draw();

  // snake
  food.draw();
  snake.draw();
  levelDisplay.draw();
  score.draw();

  // pong
  pongLevel.draw();


  // pong
  pongPaddle.draw();
  pongBall.draw();
  pongNet.draw();
  pongScore.draw();
  pongEndMessage.draw();

  // snake
  getReady.draw();
  gameOver.draw();

  //pong

  background.draw();
  buttons.draw();
  word.draw();
  button.draw();
  vArrow.draw();
  hArrow.draw();
}

function loop() {
  update();
  draw();
  moving = false;
}

const game = (speed) => {
  gameplay = setInterval(loop, 1000 / speed);
}

game(20);
