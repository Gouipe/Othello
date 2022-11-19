var AI ={
    play : function(){
        options = legalSquares();
        playSquare(options[0].row,options[0].col);
    }
}