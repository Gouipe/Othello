// different values for each square of the board
const BLACK = 0;
const WHITE = 1;
const FREE = 2;

class State {
    constructor(old, player1=false, player2=false){
        //First instance : new State(null, x, x) (x can be human or an ai)
        //Then : state = new State(old)

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
            this.board = old.board
        }
        //player1
        if (player1 != false)
            this.player1 = player1;
        else
            this.player1 = old.player1;
        //player2
        if (player2 != false)
            this.player2 = player2;
        else
            this.player2 = old.player2;
        //Turn
        this.turn = BLACK;
    }

    //METHODS

    /*
    * Returns true if game is over
    */
    isGameOver(){
        return this.getLegalMoves().length == 0;
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
    * Returns a list of all the legal moves 
    */
    getLegalMoves(){
        let res = [];
        for (let r=0;r<8;r++){
            for(let c=0 ; c<8 ;c++){
                if (this.flipedSquares(r,c).length != 0){
                    res.push({row:r, col:c});
                }
            }
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
    * is is played
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

};


