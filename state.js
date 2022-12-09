class State {
    constructor(old, player1 = false, player2 = false) {    
        //How to use constructor :
        //-first instance : new State(null, x, x) (x can be human or an ai)
        //-then : state = new State(old)

        //board
        if (old == null) {
            this.board = [
                [FREE, FREE, FREE, FREE, FREE, FREE, FREE, FREE],
                [FREE, FREE, FREE, FREE, FREE, FREE, FREE, FREE],
                [FREE, FREE, FREE, FREE, FREE, FREE, FREE, FREE],
                [FREE, FREE, FREE, WHITE, BLACK, FREE, FREE, FREE],
                [FREE, FREE, FREE, BLACK, WHITE, FREE, FREE, FREE],
                [FREE, FREE, FREE, FREE, FREE, FREE, FREE, FREE],
                [FREE, FREE, FREE, FREE, FREE, FREE, FREE, FREE],
                [FREE, FREE, FREE, FREE, FREE, FREE, FREE, FREE]
            ];
        }
        else {
            //deep copy of the board
            this.board = JSON.parse(JSON.stringify(old.board));
        }
        //player1 (black)
        if (player1 != false)
            this.player1 = player1;
        else
            this.player1 = old.player1;
        //player2
        if (player2 != false)
            this.player2 = player2;
        else
            this.player2 = old.player2;
        // Turn (black starts)
        this.turn = BLACK;
    }

    //static property : coordinates of corners
    static corners = [
        [0, 0], [0, 7], [7, 0], [7, 7]
    ]
    // table that contains for each field the corresponding value. A good field is a field that is stable or that
    // doesn't give the opportunity to the opponent to get a stable field 
    static valueTable = [
        [4, -3, 2, 2, 2, 2, -3, -4],
        [-3, -4, -1, -1, -1, -1, -4, -3],
        [2, -1, 1, 0, 0, 1, -1, 2],
        [2, -1, 0, 1, 1, 0, -1, 2],
        [2, -1, 0, 1, 1, 0, -1, 2],
        [2, -1, 1, 0, 0, 1, -1, 2],
        [-3, -4, -1, -1, -1, -1, -4, -3],
        [4, -3, 2, 2, 2, 2, -3, -4],
    ]

    //METHODS

    /*
    * Returns true if game is over
    */
    isGameOver() {
        return this.getLegalMoves().length == 0 && this.getLegalMoves(-this.turn).length == 0;
    }

    /*
    * returns the winner
    */
    winner() {
        if (this.isGameOver()) {
            let score = this.getScore();
            if (score.black == score.white) {
                return null;
            }
            if (score.black > score.white) {
                return this.player1;
            } else {
                return this.player2;
            }
        }
    }
    /*
    * Returns the volor of the winner
    */
    winnerColor() {
        if (this.isGameOver()) {
            let score = this.getScore();
            if (score.black == score.white) {
                return "nobody";
            }
            if (score.black > score.white) {
                return "black";
            } else {
                return "white";
            }
        }
    }
    /*
    * Returns score for black and white
    */
    getScore() {
        var res = { 'white': 0, 'black': 0 };
        let color = null;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                color = this.board[r][c];
                if (color == WHITE) {
                    res.white++;
                } else if (color == BLACK) {
                    res.black++;
                }
            }
        }
        return res;
    }

    /*
    * Returns a list of all the legal moves for player represented by @turn
    */
    getLegalMoves(turn = this.turn) {
        let res = [];
        let toggled = false
        // turn!=this.turn => checking the moves that opponent player can play
        if (turn != this.turn) {
            toggled = true
            this.toggleTurn(); // we need to toggle turn to apply this.fipedSquares() for the right player
        }
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.flipedSquares(r, c).length != 0) {
                    res.push({ row: r, col: c });
                }
            }
        }
        //We toggle the turn back, to come back to original state
        if (toggled) {
            this.toggleTurn();
        }
        return res;
    }

    /*
    * Returns the new game state corresponding to (@row,@col) being played
    */
    placeToken(row, col) {
        let fliped = this.flipedSquares(row, col); // gets all the tokens fliped by the play
        // flip every token that have to be fliped
        if (fliped.length != 0) {
            let newState = new State(this);
            let coord;
            for (coord of fliped) {
                newState.board[coord[0]][coord[1]] = this.turn;
            }
            newState.turn = this.turn == BLACK ? WHITE : BLACK;
            return newState;
        } else {
            //shouldn't happen
        }
    }

    /*
    * If turn == WHITE, turn becomes BLACK, and the other way around
    */
    toggleTurn() {
        this.turn = this.turn == BLACK ? WHITE : BLACK;
    }
    /*
    * Checks if token whose coordinates are(@r, @c) is opposite color than current turn
    */
    oppositeColor(r, c) {
        if (r < 0 || c < 0 || r >= 8 || c >= 8)
            return false;
        let color1 = this.board[r][c];
        if (color1 == BLACK && this.turn == WHITE)
            return true;
        if (color1 == WHITE && this.turn == BLACK)
            return true;
        return false;
    }

    /*
    * Returns true is field whose coordinates are (@r, @c) is valid and empty
    */
    isEmpty(r, c) {
        if (r < 0 || c < 0 || r >= 8 || c >= 8)
            return false;
        return this.board[r][c] == FREE
    }

    /*
    * Checks if token whose coordinates are(@r, @c) is same color than current turn
    */
    sameColor(r, c) {
        if (r < 0 || c < 0 || r >= 8 || c >= 8)
            return false;
        let color1 = this.board[r][c];
        if (color1 == this.turn)
            return true;
        return false;
    }

    /*
    * Returns a list of all the fliped squares if the square whose coordinates are (@row,@col)
    *  is played
    */
    flipedSquares(row, col) {
        //If square chosen is already occupied
        if (this.board[row][col] != FREE) {
            return [];
        }

        let res = [];//what will be returned

        /*----------CHECKS 8 DIRECTIONS----------------------*/
        //BELOW
        let r = row + 1; //current checked row
        let c = col;//current checked column
        if (this.oppositeColor(r, c)) {//square below is opposite color
            do {
                r++;
            } while (this.oppositeColor(r, c));//series of square below are still opposite color
            if (this.sameColor(r, c, this.turn)) {//final square is same color
                do {
                    r--;
                    res.push([r, c]);
                } while (r != row);
            }
        }
        //LEFT
        r = row; //current checked row
        c = col - 1;//current checked column
        if (this.oppositeColor(r, c)) {
            do {
                c--;
            } while (this.oppositeColor(r, c));
            if (this.sameColor(r, c)) {//final square is same color
                do {
                    c++;
                    res.push([r, c]);
                } while (c != col);
            }
        }
        //RIGHT
        r = row; //current checked row
        c = col + 1;//current checked column
        if (this.oppositeColor(r, c)) {
            do {
                c++;
            } while (this.oppositeColor(r, c));
            if (this.sameColor(r, c)) {//final square is same color
                do {
                    c--;
                    res.push([r, c]);
                } while (c != col);
            }
        }
        //TOP
        r = row - 1; //current checked row
        c = col;//current checked column
        if (this.oppositeColor(r, c)) {//square on top is opposite color
            do {
                r--;
            } while (this.oppositeColor(r, c));//series of square on top are different color
            if (this.sameColor(r, c)) {//final square is same color
                do {
                    r++;
                    res.push([r, c])
                } while (r != row);
            }
        }
        //Bottom RIGHT
        r = row + 1; //current checked row
        c = col + 1;//current checked column
        if (this.oppositeColor(r, c)) {
            do {
                c++;
                r++;
            } while (this.oppositeColor(r, c));
            if (this.sameColor(r, c)) {//final square is same color
                do {
                    r--;
                    c--;
                    res.push([r, c]);
                } while (r != row);
            }
        }
        //TOP LEFT
        r = row - 1; //current checked row
        c = col - 1;//current checked column
        if (this.oppositeColor(r, c)) {
            do {
                c--;
                r--;
            } while (this.oppositeColor(r, c));
            if (this.sameColor(r, c)) {//final square is same color
                do {
                    r++;
                    c++;
                    res.push([r, c]);
                } while (r != row);
            }
        }
        //TOP RIGHT
        r = row - 1; //current checked row
        c = col + 1;//current checked column
        if (this.oppositeColor(r, c)) {
            do {
                c++;
                r--;
            } while (this.oppositeColor(r, c));
            if (this.sameColor(r, c)) {//final square is same color
                do {
                    r++;
                    c--;
                    res.push([r, c]);
                } while (r != row);
            }
        }
        //BELOW LEFT
        r = row + 1; //current checked row
        c = col - 1;//current checked column
        if (this.oppositeColor(r, c)) {
            do {
                c--;
                r++;
            } while (this.oppositeColor(r, c));
            if (this.sameColor(r, c)) {//final square is same color
                do {
                    r--;
                    c++;
                    res.push([r, c]);
                } while (r != row);
            }
        }
        /*----------------------8 DIRECTION CHECKED-----------------------*/

        return res;
    }

    /*
    * Returns an heuristic value of the state (this). The higher the @level, the more precise is the heuristic
    */
    heuristicValue(level) {
        // heuristics to add at the end
        let heuristicCorners = 0;
        let heuristicMobility = 0;
        let heuristicPotentialMobility = 0;
        let heuristicStability = 0;
        let heuristicnbToken = 0;

        /********************************* CORNERS **********************************/
        let corners = 0;
        let opposentCorners = 0;
        for (var coord of State.corners) {
            // If a corner is taken by player that just played, heuristic improves
            if (this.board[coord[0]][coord[1]] == -this.turn) {
                corners += 1;
            // if a corner is taken by opponent, heuristic diminishes
            } else if (this.board[coord[0]][coord[1]] != FREE) 
                opposentCorners += 1;
        }
        // Most efficient heuristic : each corner is worth 200 points (for each heuristics every multiplier
        // is found by try and error so that the good heuristics have more weight than the others)
        heuristicCorners = (corners - opposentCorners) * 200

        if (level == EASY){
            return heuristicCorners
        }

        /*********************************** MOBILITY ************************************/
        // if many possible moves => many good moves to play 
        // if few possible moves => player can be forced to play bad moves
        // number of moves for player that just played
        let nbMaximisingMoves = this.getLegalMoves(-this.turn).length;
        //number of moves for opponent
        let nbMinimisingMoves = this.getLegalMoves(this.turn).length;
        // nb of moves current player can play - nb of moves opponent player can play) *10
        heuristicMobility = (nbMaximisingMoves - nbMinimisingMoves) * 10

        
        // /*********************************** POTENTIAL MOBILITY ************************************/
        // if opponent has many tokens adjacent to free field, potential mobility increases (potential
        // number of moves to play increases)
        let nbOpponentTokenAdjacentEmptyField = 0;
        let nbTokenAdjacentEmptyField = 0;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.board[r][c] == this.turn) {
                    //if opponent has a token next to free field
                    if (this.isEmpty(r + 1, c) || this.isEmpty(r + 1, c + 1) || this.isEmpty(r, c + 1) || this.isEmpty(r - 1, c + 1) || this.isEmpty(r - 1, c)
                        || this.isEmpty(r - 1, c - 1) || this.isEmpty(r, c - 1) || this.isEmpty(r + 1, c - 1)) {
                        nbOpponentTokenAdjacentEmptyField++;
                    }
                }
            }
        }
        // This heuristic works well, so we multiply every found token by 10
        heuristicPotentialMobility = nbOpponentTokenAdjacentEmptyField * 5



        // /****************** NOMBRE TOKENS ********************/
        // if (this.isGameOver()){
        //     let score = this.getScore();
        //     if (this.turn == BLACK){
        //         heuristicnbToken = (score.white - score.black)*10
        //     }
        //     else{
        //         heuristicnbToken =  (-score.white + score.black)*10
        //     }}

        /***********************************STABILITY************************************/   
        // A field which is not likely to be fliped is stable (corner tokens are as stable as possible as they can't
        // be fliped for example). The more tokens are stable, the better.
        // We use the static attribute valueTable to get the usual stability of each field
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.board[r][c] == -this.turn) {
                    heuristicStability += State.valueTable[r][c]
                } else if (this.board[r][c] == this.turn) {
                    heuristicStability -= State.valueTable[r][c]
                }
            }
        }
        // Has decent impact, 8 seems like a good number after some tests to not override the other heuristics
        heuristicStability = heuristicStability * 8


        

        // Return the sum of all heuristics
        return heuristicCorners + heuristicMobility + heuristicPotentialMobility + heuristicStability + heuristicnbToken;
    }
    

};


