ui = {
    createGrid() {
        let htmlTableGrid = document.createElement('table');
        htmlTableGrid.className = 'grid';
        htmlTableGrid.id = 'gridId';


        for (let r = 0; r < 8; r++) {
            let tr = htmlTableGrid.appendChild(document.createElement('tr'));
            for (let c = 0; c < 8; c++) {
                let node = tr.appendChild(document.createElement('td'));
                node.id = 'grid' + '_' + r + c;
                node.setAttribute('row', r); //we set a row attribute with the row value
                node.setAttribute('col', c); //we set a col attribute with the col value
                node.addEventListener('click', function () {
                    return playSquare(r, c);
                });
            }
        }
        return htmlTableGrid;
    },

    display(state) {
        let currentNode = null;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                currentNode = document.getElementById('grid_' + r + c);
                currentNode.setAttribute('state', state.board[r][c]);
            }
        }
        this.displayScore();
    },

    displayScore() {
        score = currentState.getScore();
        document.getElementById('blackScore').innerHTML = score.black;
        document.getElementById('whiteScore').innerHTML = score.white;
        if (currentState.isGameOver())
            document.getElementById('score').innerHTML += 'GAME OVER';
    },

    init() {
        grid = ui.createGrid();
        document.getElementById('grid-container').appendChild(grid);
    }
}

/*
* Callback to every square.
* Plays a token on the square whose coordinates are (@r,@c)
*/
function playSquare(r, c) {
    let options = currentState.getLegalMoves();
    if (options.some(o => o.row == r && o.col == c)) {
        currentState = currentState.play(r, c);
        ui.display(currentState);

        //player2 is always an ai (no human vs human possible)
        currentState.player2.play();
        ui.display(currentState);
    }
}