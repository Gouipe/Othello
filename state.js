class State {
    constructor(old, player1=false, player2=false){
        //How to use constructor :
        //-first instance : new State(null, x, x) (x can be human or an ai)
        //-then : state = new State(old)

        //board
        if(old == null){    
            this.board=[
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
        else{
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
        [0,0], [0, 7], [7, 0], [7, 7]
    ]

    //METHODS

    /*
    * Returns true if game is over
    */
    isGameOver(){
        return this.getLegalMoves().length == 0;
    }

    /*
    * returns the winner
    */
    winner(){
        if (this.isGameOver()){
            let score = this.getScore();
            if (score.black == score.white){
                return null;
            }
            if (score.black > score.white){
                return this.player1;
            }else{
                return this.player2;
            }
        }
    }
    /*
    * Returns the volor of the winner
    */
    winnerColor(){
        if (this.isGameOver()){
            let score = this.getScore();
            if (score.black == score.white){
                return "nobody";
            }
            if (score.black > score.white){
                return "black";
            }else{
                return "white";
            }
        }
    }
    /*
    * Returns score for black and white
    */
    getScore(){
        var res ={'white':0 ,'black':0};
        let color =null;
        for (let r=0 ;r<8 ; r++){
            for (let c=0 ; c<8 ; c++){
                color = this.board[r][c];
                if (color == WHITE){
                    res.white++;
                } else if (color == BLACK){
                    res.black++;
                }
            }
        }
        return res;
    }

    /*
    * Returns a list of all the legal moves for player represented by @turn
    */
    getLegalMoves(turn=this.turn){
        let res = [];
        let toggled = false
        // turn!=this.turn => checking the moves that opponent player can play
        if (turn!=this.turn){
            toggled = true
            this.toggleTurn(); // we need to toggle turn to apply this.fipedSquares() for the right player
        }
        for (let r=0;r<8;r++){
            for(let c=0 ; c<8 ;c++){
                if (this.flipedSquares(r,c).length != 0){
                    res.push({row:r, col:c});
                }
            }
        }
        //We toggle the turn back, to come back to original state
        if (toggled){
            this.toggleTurn();
        }
        return res;
    }

    /*
    * Returns the new game state corresponding to (@row,@col) being played
    */
    placeToken(row,col){
        let fliped=this.flipedSquares(row,col); // gets all the tokens fliped by the play
        // flip every token that have to be fliped
        if (fliped.length != 0){
            let newState = new State(this);
            let coord;
            for (coord of fliped){
                newState.board[coord[0]][coord[1]] = this.turn;
            }
            newState.turn = this.turn == BLACK ? WHITE : BLACK;
            return newState;
        }else{
            //shouldn't happen
        }
    }

    /*
    * If turn == WHITE, turn becomes BLACK, and the other way around
    */
    toggleTurn(){
        this.turn = this.turn == BLACK ? WHITE : BLACK;
    }
    /*
    * Checks if token whose coordinates are(@r, @c) is opposite color than current turn
    */
    oppositeColor(r, c){
        if(r < 0 || c < 0 || r >= 8 || c >= 8)
         return false;
        let color1 = this.board[r][c];
        if(color1 == BLACK && this.turn == WHITE)
            return true;
        if(color1 == WHITE && this.turn == BLACK)
            return true;
        return false;
    }

    /*
    * Returns true is field whose coordinates are (@r, @c) is valid and empty
    */
    isEmpty(r, c){
        if(r < 0 || c < 0 || r >= 8 || c >= 8)
            return false;
        return this.board[r][c] == FREE
    }

    /*
    * Checks if token whose coordinates are(@r, @c) is same color than current turn
    */
    sameColor(r, c){
        if(r < 0 || c < 0 || r >= 8 || c >= 8)
            return false;
        let color1 = this.board[r][c];
        if(color1 == this.turn)
            return true;
        return false;
    }

    /*
    * Returns a list of all the fliped squares if the square whose coordinates are (@row,@col)
    *  is played
    */
    flipedSquares(row, col){
        //If square chosen is already occupied
        if(this.board[row][col] != FREE){
            return [];
        }
    
        let res = [];//what will be returned
    
        /*----------CHECKS 8 DIRECTIONS----------------------*/
        //BELOW
        let r = row+1; //current checked row
        let c = col;//current checked column
        if(this.oppositeColor(r,c)){//square below is opposite color
            do{
                r++;
            }while(this.oppositeColor(r,c));//series of square below are still opposite color
            if(this.sameColor(r, c, this.turn)){//final square is same color
                do{
                    r--;
                    res.push([r,c]);
                }while(r != row);
            }
        }
        //LEFT
        r = row; //current checked row
        c = col-1;//current checked column
        if(this.oppositeColor(r,c)){
            do{
                c--;
            }while(this.oppositeColor(r,c));
            if(this.sameColor(r,c)){//final square is same color
                do{
                    c++;
                    res.push([r,c]);
                }while(c != col);
            }
        }
        //RIGHT
        r = row; //current checked row
        c = col+1;//current checked column
        if(this.oppositeColor(r,c)){
            do{
                c++;
            }while(this.oppositeColor(r,c));
            if(this.sameColor(r,c)){//final square is same color
                do{
                    c--;
                    res.push([r,c]);
                }while(c != col);   
            }
        }
        //TOP
        r = row-1; //current checked row
        c = col;//current checked column
        if(this.oppositeColor(r,c)){//square on top is opposite color
            do{
                r--;
            }while(this.oppositeColor(r,c));//series of square on top are different color
            if(this.sameColor(r,c)){//final square is same color
                do{
                    r++;
                    res.push([r,c])
                }while(r != row);
            }
        }
        //Bottom RIGHT
        r = row+1; //current checked row
        c = col+1;//current checked column
        if(this.oppositeColor(r,c)){
            do{
                c++;
                r++;
            }while(this.oppositeColor(r,c));
            if(this.sameColor(r,c)){//final square is same color
                do{
                    r--;
                    c--;
                    res.push([r,c]);
                }while(r != row);
            }
        }
        //TOP LEFT
        r = row-1; //current checked row
        c = col-1;//current checked column
        if(this.oppositeColor(r,c)){
            do{
                c--;
                r--;
            }while(this.oppositeColor(r,c));
            if(this.sameColor(r,c)){//final square is same color
                do{
                    r++;
                    c++;
                    res.push([r,c]);
                }while(r != row);
            }
        }
        //TOP RIGHT
        r = row-1; //current checked row
        c = col+1;//current checked column
        if(this.oppositeColor(r,c)){
            do{
                c++;
                r--;
            }while(this.oppositeColor(r,c));
            if(this.sameColor(r,c)){//final square is same color
                do{
                    r++;
                    c--;
                    res.push([r,c]);
                }while(r != row);
            }
        }
        //BELOW LEFT
        r = row+1; //current checked row
        c = col-1;//current checked column
        if(this.oppositeColor(r,c)){
            do{
                c--;
                r++;
            }while(this.oppositeColor(r,c));
            if(this.sameColor(r,c)){//final square is same color
                do{
                    r--;
                    c++;
                    res.push([r,c]);
                }while(r != row);
            }
        }
        /*----------------------8 DIRECTION CHECKED-----------------------*/
    
        return res;
    }

    /*
    * Returns an heuristic value of the state (this). This value is positive if the state is good for player to play (global object 
    * "game" can tell us which player is to play)
    */
    heuristicValue1(level=EASY){
        // global turn == color of current maximising player
        let globalTurn = game.currentState.turn;
        // heuristics to add at the end
        let heuristicCorners = 0;
        let heuristicMobility = 0;
        let heuristicStability = 0;

        // CHECK CORNERS
        for (var coord of State.corners){
            // If a corner is taken by player to play, heuristic improves
            if (this.board[coord[0]][coord[1]] == globalTurn){
                heuristicCorners += 100;
            // if a corner is taken by opponent, heuristic diminishes
            } else if (this.board[coord[0]][coord[1]] != FREE){
                heuristicCorners -= 100;
            }
        }
        if (level == EASY){
            return heuristicCorners
        }

        // CHECK MOBILITY
        let nbMaximisingMoves = this.getLegalMoves(globalTurn, true).length;
        let nbMinimisingMoves = this.getLegalMoves(globalTurn, false).length;
        // nb of moves maximising player can play - nb of moves minimising player can play) *20
        // So having 5 more moves equals having a corner
        heuristicMobility = (nbMaximisingMoves - nbMinimisingMoves)*10
        if (level == MEDIUM){
            return heuristicCorners + heuristicMobility
        }

        //CHECK STABILITY

        return heuristicCorners + heuristicMobility + heuristicStability;
    }

    heuristicValue(level=EASY){
        // heuristics to add at the end
        let heuristicCorners = 0;
        let heuristicMobility = 0;
        let heuristicPotentialMobility = 0;
        let heuristicStability = 0;

        // CHECK CORNERS
        let corners = 0;
        let opposentCorners = 0;
        for (var coord of State.corners){
            // If a corner is taken by player that just played, heuristic improves
            if (this.board[coord[0]][coord[1]] == -this.turn){
                corners += 1;
            // if a corner is taken by opponent, heuristic diminishes
            } else if (this.board[coord[0]][coord[1]] != FREE){
                opposentCorners += 1;
            }
        }
        heuristicCorners = (corners - opposentCorners) * 100
        if (level == EASY){
            return heuristicCorners
        }

        // CHECK MOBILITY : if many possible moves => many good moves to play or opponent is forced to play bad moves if he has few
        let nbMaximisingMoves = this.getLegalMoves(-this.turn).length;
        let nbMinimisingMoves = this.getLegalMoves(this.turn).length;
        // nb of moves maximising player can play - nb of moves minimising player can play) *20
        heuristicMobility = (nbMaximisingMoves - nbMinimisingMoves)*10


        //CHECK POTENTIAL MOBILITY : if opponent has many tokens adjacent to free field, potential mobility increases
        let nbOpposentTokenAdjacentEmptyField = 0;
        let nbTokenAdjacentEmptyField = 0;
        for(let r=0; r<8 ; r++){
            for(let c=0 ; c<8 ; c++){
                if (this.board[r][c] == this.turn){
                    if (this.isEmpty(r+1, c) || this.isEmpty(r+1, c+1) || this.isEmpty(r, c+1) || this.isEmpty(r-1, c+1) || this.isEmpty(r-1, c)
                    || this.isEmpty(r-1, c-1) || this.isEmpty(r, c-1) || this.isEmpty(r+1, c-1)){
                        nbOpposentTokenAdjacentEmptyField++;
                    }
                }
                if (this.board[r][c] == -this.turn){
                    if (this.isEmpty(r+1, c) || this.isEmpty(r+1, c+1) || this.isEmpty(r, c+1) || this.isEmpty(r-1, c+1) || this.isEmpty(r-1, c)
                    || this.isEmpty(r-1, c-1) || this.isEmpty(r, c-1) || this.isEmpty(r+1, c-1)){
                        nbTokenAdjacentEmptyField++;
                    }
                }
            }
        }
        // potential mobility =
        heuristicPotentialMobility = (-nbOpposentTokenAdjacentEmptyField  + nbTokenAdjacentEmptyField) * 10
        

        //CHECK STABILITY

        return heuristicCorners + heuristicMobility + heuristicPotentialMobility + heuristicStability;
    }

};


