const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')
const canvasNext = document.getElementById('next')
const ctxNext = canvasNext.getContext('2d')

// Calculate size of canvas from constants.
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// Size canvas for four blocks.  
ctxNext.canvas.width = 4 * BLOCK_SIZE;  
ctxNext.canvas.height = 4 * BLOCK_SIZE;  
 
// Scale blocks
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);

let requestId = null

let accountValues = {
    score: 0,
    lines: 0,
    level: 0
}

let account = new Proxy(accountValues, {
    set: (target, key, value) => {
        target[key] = value
        updateAccount(key, value)
        return true;
    }
})

function updateAccount(key, value) {
    let element = document.getElementById(key)
    if (element) {
        element.textContent = value
    }
}

function resetGame() {
    account.score = 0
    account.lines = 0
    account.level = 0
    board = new Board(ctx, ctxNext)
    time = {start: performance.now(), elapsed: 0, level: LEVEL[0]}
}

function play() {
    resetGame()
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

    checkHighScore(account.score)
}

function checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || []

    const LowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

    if (score > LowestScore) {
        saveHighScore(score, highScores)
        showHighScores()
    }
}

function saveHighScore(score, highScores) {
    const name = prompt('You got a highscore! Enter name:')
    const newScore = {score, name}

    highScores.push(newScore)
    highScores.sort((a, b) => b.score - a.score)
    highScores.splice(NO_OF_HIGH_SCORES)

    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores))
}

function showHighScores() {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || []
    const highScoreList = document.getElementById(HIGH_SCORES)

    highScoreList.innerHTML = highScores
        .map((score) => `<li>${score.score} - ${score.name}`)
        .join('')
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

let board = new Board(ctx, ctxNext);

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
                account.score += POINTS.HARD_DROP;
                p = moves[KEY.SPACE](board.piece)
            }
        }

        if (board.valid(p)) {
            board.piece.move(p)
            if (event.keyCode === KEY.DOWN) {
                account.score += POINTS.SOFT_DROP;
            }
        }
    }
}

function addEventListener() {
    document.removeEventListener('keydown', handleKeyPress)
    document.addEventListener("keydown", handleKeyPress)
}

showHighScores()