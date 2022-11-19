const BLACK = 0;
const WHITE = 1;
const FREE = 2;

class State {
    constructor(player1, player2){
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
        this.turn = BLACK;
        this.player1 = player1;
        this.player2 = player2;
    }

    //METHODS

    /*
    * Returns a list of all the legal moves 
    */
    getLegalMoves(){
        let res = [];
        for (let r=0;r<8;r++){
            for(let c=0 ; c<8 ;c++){
                if (flipedSquares(r,c).length != 0){
                    res.push({row:r, col:c});
                }
            }
        }
        return res;
    }

    /*
    * Returns the new game state worresponding to (@row,@col) being played
    */
    play(row,col){
        let fliped=this.flipedSquares(row,col); // gets all the tokens fliped by the play
        // flips every token that has to
        if (fliped.length != 0){
            let newState = this.clone();
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
    * Returns a deep copy of this
    */
    clone(){
        return JSON.parse(JSON.stringify(this));
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
    *
    */
    getSquare(r,c){
        if(r < 0 || c < 0 || r >= 8 || c >= 8)
            return null;
        else
            return this.board[r][c];

    }
    /*
    *Returns a list of all the fliped squares if the @node whose coordinates are (@row,@col)
    * is clicked
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

//TEST
let state = new State('human', 'ai');
let copy =  state.clone();

newState = state.play(2,3)