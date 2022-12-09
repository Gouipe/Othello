ui = {
    //Attribute that indicates if the grid has already been created
    initialised: false,

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
        // document.getElementById('blackMoves').innerHTML = game.currentState.getLegalMoves().length;
        // document.getElementById('whiteMoves').innerHTML = game.currentState.getLegalMoves(game.currentState.turn, false).length;
        if (state.isGameOver())
            document.getElementById('result').innerHTML = 'GAME OVER : ' + game.currentState.winnerColor() + " wins";
    },

    //initialisation
    init() {
        grid = ui.createGrid();
        // if the grid has not been already initialised,
        if (!this.initialised) {
            document.getElementById('grid-container').appendChild(grid);
            //grid has been initialised
            this.initialised = true
        }
        // else{
        //     document.getElementById('grid-container').replaceChild(grid, document.getElementById('gridId'))
        // }
    }
}
// Buttons to choose player 1 type (human,ai1...)
document.getElementById('player1Human').addEventListener('click', (function () { game.p1 = 'human' }));
document.getElementById('player1AIRandom').addEventListener('click', (function () { game.p1 = aiRandom }));
document.getElementById('player1AIEasy').addEventListener('click', (function () { game.p1 = new AiNegaMax(EASY) }));
document.getElementById('player1AIMedium').addEventListener('click', (function () { game.p1 = new AiNegaMax(MEDIUM) }));
// Buttons to choose player 2 type (human,ai1...)
document.getElementById('player2AIRandom').addEventListener('click', (function () { game.p2 = aiRandom }));
document.getElementById('player2AIEasy').addEventListener('click', (function () { game.p2 = new AiNegaMax(EASY) }));
document.getElementById('player2AIMedium').addEventListener('click', (function () { game.p2 = new AiNegaMax(MEDIUM) }));
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
        setTimeout(function () { game.currentState = game.currentState.player2.play(); ui.display(game.currentState); }, 500);


        //wait for (callback to be called)/(board to be clicked) for game to be continued
    }
}