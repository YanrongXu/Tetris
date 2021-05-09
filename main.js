function play() {
    board = new Board(ctx)
    draw();
}

function play() {
    board = new Board(ctx)
    const {width, height} = ctx.canvas
    ctx.clearRect(0, 0, width, height)

    board.piece.draw()
}