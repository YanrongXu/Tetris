function play() {
    board = new Board(ctx)
    draw();
}



function play() {
    board = new Board(ctx)
    draw()
    addEventListener();
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
            draw()
        }
    }
}

function draw() {
    const {width, height} = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    board.piece.draw();
}

function addEventListener() {
    document.removeEventListener('keydown', handleKeyPress)
    document.addEventListener("keydown", handleKeyPress)
}