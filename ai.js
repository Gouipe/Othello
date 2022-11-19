ai ={
    play(){
        options = currentState.getLegalMoves();
        currentState = currentState.play(options[0].row,options[0].col);
    }
}