function play() {
    board = new Board(ctx)
    draw();
}

let requestId = null

function play() {
    board = new Board(ctx)
    addEventListener();

    // If we havae an old game running then cancel it
    if (requestId) {
        cancelAnimationFrame(requestId);
    }

    time.start = performance.now()
    animate()
}

function draw() {
    const {width, height} = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    board.draw();
    board.piece.draw()
}

let time = {start: 0, elapsed: 0, level: 1000}

function animate(now = 0) {
    // Update elapsed time.
    time.elapsed = now - time.start;
  
    // If elapsed time has passed time for current level
    if (time.elapsed > time.level) {
      // Restart counting from now
      time.start = now;
  
      if (!board.drop()) {
          gameOver();
          return
      }
    }
  
    draw();
    requestId = requestAnimationFrame(animate);
  }

function gameOver() {
    cancelAnimationFrame(requestId);
    ctx.fillStyle = 'black';
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = '1px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', 1.8, 4);
}

function drop() {
    let p = moves[KEY.DOWN](board.piece)
    if (board.valid(p)) {
        board.piece.move(p)
    }
}

moves = {
    [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
    [KEY.UP]: (p) => board.rotate(p),
    [KEY.SPACE]: (p) => ({...p, y: p.y + 1})
  };

let board = new Board();

function handleKeyPress(event) {
    // Stop the event from bubbling
    event.preventDefault()

    if (moves[event.keyCode]) {
        // Get new state of piece
        let p = moves[event.keyCode](board.piece)
        if (event.keyCode === KEY.SPACE) {
            // Hard Drop
            while (board.valid(p)) {
                board.piece.move(p)
                p = moves[KEY.SPACE](board.piece)
            }
        }

        if (board.valid(p)) {
            board.piece.move(p)
        }
    }
}

function addEventListener() {
    document.removeEventListener('keydown', handleKeyPress)
    document.addEventListener("keydown", handleKeyPress)
}