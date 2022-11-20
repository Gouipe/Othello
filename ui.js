ui = {
    // Creates the HTML grid for the game board
    createGrid() {
        //Create table tag
        let htmlTableGrid = document.createElement('table');
        htmlTableGrid.className = 'grid';
        htmlTableGrid.id = 'gridId';

        //Initialise every td of table
        for (let r = 0; r < 8; r++) {
            let tr = htmlTableGrid.appendChild(document.createElement('tr'));
            for (let c = 0; c < 8; c++) {
                let node = tr.appendChild(document.createElement('td'));
                node.id = 'grid' + '_' + r + c;
                node.setAttribute('row', r); //we set a row attribute with the row value
                node.setAttribute('col', c); //we set a col attribute with the col value
                node.addEventListener('click', function () {
                    return playSquare(r, c); // Callback so the td can be played
                });
            }
        }
        return htmlTableGrid;
    },

    // Displays board and score corresponding to @state
    display(state) {
        let currentNode = null;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                currentNode = document.getElementById('grid_' + r + c);
                currentNode.setAttribute('state', state.board[r][c]);
            }
        }
        this.displayScore(state);
    },

    // displays score corresponding to @state
    displayScore(state) {
        score = state.getScore();
        document.getElementById('blackScore').innerHTML = score.black;
        document.getElementById('whiteScore').innerHTML = score.white;
        if (state.isGameOver())
            document.getElementById('score').innerHTML += 'GAME OVER';
    },

    //initialisation
    init() {
        grid = ui.createGrid();
        document.getElementById('grid-container').appendChild(grid);
    }
}
// Buttons to choose player 1 type (human,ai1...)
document.getElementById('player1Human').addEventListener('click', (function(){game.p1 = 'human'}));
document.getElementById('player1AI').addEventListener('click', (function(){game.p1 = ai}));
// Buttons to choose player 2 type (human,ai1...)
document.getElementById('player2AI').addEventListener('click', (function(){game.p2 = ai}));
//Button to launch game
document.getElementById('play').addEventListener('click', game.run.bind(game))

/*
* Callback added to every square of the board
* Plays a token on the square whose coordinates are (@r,@c)
*/
function playSquare(r, c) {
    let options = game.currentState.getLegalMoves();
    // if the play corresponding to (@r, @c) is among the legal ones
    if (options.some(o => o.row == r && o.col == c)) {
        //back end update
        game.currentState = game.currentState.placeToken(r, c);
        //front end update
        ui.display(game.currentState);

        //notifies player2 to play. player2 is always an ai (no human vs human possible)
        game.currentState = game.currentState.player2.play();
        ui.display(game.currentState);

        //wait for (callback to be called)/(board to be clicked) for game to be continued
    }
}